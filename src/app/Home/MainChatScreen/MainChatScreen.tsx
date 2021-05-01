import  { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiUrls } from '../../../services/api-services/api-urls'
import httpClient from '../../../services/api-services/http-client'
import { setUserData, showSkeletonLoader } from '../../redux/actions/common.actions'
import HomeSkeletonLoader from '../HomeSkeletonLoader/HomeSkeletonLoader'
import ChatRoom from './ChatRoom/ChatRoom'
import ConversationList from './ConversationList/ConversationList'
import SocketController, { SOCKET_CONSTANT_EVENTS } from '../../../services/api-services/sockets'
import './MainChatScreen.css'
import { User } from '../../../models/ConversationModels/User.model'
import { showTypingMessage, switchConversation, updateAllConversations } from '../../redux/actions/conversations.actions'
import { Conversation, ConversationEvents, ConversationTypingEvent } from '../../../models/ConversationModels/Conversation.model'
import { ConversationType } from '../../../models/ConversationModels/ConversationSwitch.model'
import { Message } from '../../../models/ConversationModels/Message.model'
import chatRoomService from '../../../services/app-services/chatroom.service'

const MainChatScreen = () => {
    const { sideBarMode, skeletonLoader, allConversations } = useSelector((state: any) => state);
    const dispatch = useDispatch();

    const toggleMainScreenSkeleton = () => {
        skeletonLoader.mainChatScreen = !skeletonLoader.mainChatScreen;
        dispatch(showSkeletonLoader({...skeletonLoader}));
    }

    const socketHandlers = (userData: User) => {
        //Attach the socket and it's handlers
        SocketController.connectSocket(userData);

        SocketController.socket?.on(SOCKET_CONSTANT_EVENTS.UPDATE_INITIAL_STATE, (data: any) => updateInitialState(data, userData));
        SocketController.socket?.on(String(userData.email), (data: any) => getNewMessageFromForeignUser(data, userData));
    }

    const fetchComponentData =  async () => {
        toggleMainScreenSkeleton(); 
        try {
           //Fetch user data
           let userData: User = await httpClient.get(apiUrls["user-info"].route);
           dispatch(setUserData(userData));
           SocketController.userData = userData;

           //Connect Socket
           socketHandlers(userData);

           //Fetch all conversations
           let conversationsList = await httpClient.get(apiUrls["conversations"].route);
           setAllConversations(conversationsList, userData);
        } catch(err: any) {} finally {
            toggleMainScreenSkeleton();
        }
    }

    const setAllConversations = ({ conversations_list } : any,userData: User) => {
        if(!conversations_list || !userData || conversations_list.length < 1) return;

        let allConversationsInstance: ConversationType = {...allConversations};
        for(let conversation of conversations_list) {
            let newConversation: Conversation = new Conversation(conversation, userData.email);
            allConversationsInstance[newConversation.chat_id] = newConversation;
            SocketController.attachEventToSocket(newConversation.chat_id, handleConversationEvents, userData)
        }

        dispatch(updateAllConversations(allConversationsInstance));
    }

    /**
     * SOCKET HANDLERS
     */
    const updateInitialState = (conversationDetails: any, userData: User) => {
        let initialConversationId = conversationDetails.initial_message_to;
        let allConversationsInstance: ConversationType = SocketController.getAllConversations;
        if(!allConversationsInstance[initialConversationId])
        return;
        
        let conversationToBeUpdated: Conversation = {...allConversationsInstance[initialConversationId]};
        delete allConversationsInstance[initialConversationId];

        conversationToBeUpdated.chat_id = conversationDetails._id;
        allConversationsInstance[conversationToBeUpdated.chat_id] = conversationToBeUpdated;
        SocketController.attachEventToSocket(conversationToBeUpdated.chat_id, handleConversationEvents, userData)
        dispatch(updateAllConversations({...allConversationsInstance}));
        dispatch(switchConversation(conversationToBeUpdated.chat_id, allConversationsInstance, dispatch, userData));
    }

    const getNewMessageFromForeignUser = (conversationDetails: any, userData: User) => {
        let conversation: Conversation = new Conversation(conversationDetails);
        let allConversationsInstance: ConversationType = SocketController.getAllConversations;

        if(!allConversationsInstance[conversation.chat_id] && conversation.participants.length > 0) {
                conversation.conversationState = {
                    [userData.email] : { unread_count : 1 }
                }
                
            allConversationsInstance[conversation.chat_id] = conversation;
            SocketController.attachEventToSocket(conversation.chat_id, handleConversationEvents, userData)
            dispatch(updateAllConversations({...allConversationsInstance}));
        } 
    }

    const handleConversationEvents = (conversationEvent: ConversationEvents, userData: User) => {
        switch (conversationEvent.eventType) {
            case 'CONVERSATION_MESSAGE':
                pushConversationMessage(conversationEvent.eventData, userData);
                break;
        
            case 'TYPING_STATE':
                handleTypingState(conversationEvent.eventData as ConversationTypingEvent, userData);
                break;
        }
    }

    const handleTypingState = (typingEvent: ConversationTypingEvent, userData: User) => {
        if(typingEvent.sender.email === userData.email
           || SocketController.getCurrentConversationId !== typingEvent.conversationId)
           return;
        
        chatRoomService.isTypingMessageQueue.push(0);
        dispatch(showTypingMessage(true));
        setTimeout(() => { 
            chatRoomService.isTypingMessageQueue.pop();
            if(chatRoomService.isTypingMessageQueue.length < 1) {
                dispatch(showTypingMessage(false));
            }   
         }, 500);
    }

    const pushConversationMessage = (messageDetails: any,userData: User) => {
        let message: Message = new Message(messageDetails);
        let allConversationsInstance: ConversationType = SocketController.getAllConversations;
        if(!allConversationsInstance[message.chat_id] || message.sender === userData.email) return;
        chatRoomService.pushMessageToConversation(message, allConversationsInstance, SocketController.getCurrentConversationId, dispatch, updateAllConversations, userData);
    }

    useEffect(() => {
       fetchComponentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={"main__chat__screen d-flex "+ ((sideBarMode) ? "hide__side__bar" : "")}>
            {/* Skeleton Loader */}
            <HomeSkeletonLoader />

            {/* All Conversations View */}
            <ConversationList />

            {/* Selected Chat Room View */}
            <ChatRoom />
        </div>
    )
}

export default MainChatScreen
