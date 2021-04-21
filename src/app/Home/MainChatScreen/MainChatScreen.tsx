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
import { switchConversation, updateAllConversations } from '../../redux/actions/conversations.actions'
import { Conversation } from '../../../models/ConversationModels/Conversation.model'
import { ConversationType } from '../../../models/ConversationModels/ConversationSwitch.model'
import { Message } from '../../../models/ConversationModels/Message.model'

const MainChatScreen = () => {
    const { sideBarMode, skeletonLoader, allConversations } = useSelector((state: any) => state);
    const dispatch = useDispatch();

    const toggleMainScreenSkeleton = () => {
        skeletonLoader.mainChatScreen = !skeletonLoader.mainChatScreen;
        dispatch(showSkeletonLoader({...skeletonLoader}));
    }

    const socketHandlers = (userData: User) => {
        //Attach the socket and it's handlers
        SocketController.connectSocket();

        SocketController.socket?.on(SOCKET_CONSTANT_EVENTS.UPDATE_INITIAL_STATE, (data: any) => updateInitialState(data, userData));
        SocketController.socket?.on(String(userData.email), (data: any) => getNewMessageFromForeignUser(data, userData));
    }

    const fetchComponentData =  async () => {
        toggleMainScreenSkeleton(); 
        try {
           //Fetch user data
           let userData: User = await httpClient.get(apiUrls["user-info"].route);
           dispatch(setUserData(userData));

           //Fetch all conversations
           let conversationsList = await httpClient.get(apiUrls["conversations"].route);
           setAllConversations(conversationsList, userData);

           socketHandlers(userData);
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
            SocketController.attachEventToSocket(newConversation.chat_id, pushConversationMessage, userData)
        }

        dispatch(updateAllConversations(allConversationsInstance));
    }

    /**
     * SOCKET HANDLERS
     */
    const updateInitialState = (conversationDetails: any, userData: User) => {
        let initialConversationId = conversationDetails.initial_message_to;
        if(!allConversations[initialConversationId])
        return;
        
        let conversationToBeUpdated: Conversation = {...allConversations[initialConversationId]};
        delete allConversations[initialConversationId];

        conversationToBeUpdated.chat_id = conversationDetails._id;
        allConversations[conversationToBeUpdated.chat_id] = conversationToBeUpdated;
        SocketController.attachEventToSocket(conversationToBeUpdated.chat_id, pushConversationMessage, userData)
        dispatch(updateAllConversations({...allConversations}));
        dispatch(switchConversation(conversationToBeUpdated.chat_id));
    }

    const getNewMessageFromForeignUser = (conversationDetails: any, userData: User) => {
        let conversation: Conversation = new Conversation(conversationDetails);
        let allConversationsInstance: ConversationType = SocketController.getAllConversations;

        console.log(conversationDetails, conversation);

        if(!allConversationsInstance[conversation.chat_id]) {
            allConversationsInstance[conversation.chat_id] = conversation;
            SocketController.attachEventToSocket(conversation.chat_id, pushConversationMessage, userData)
            dispatch(updateAllConversations({...allConversationsInstance}));
            dispatch(switchConversation(conversation.chat_id));
        } else {
            dispatch(switchConversation(conversation.chat_id));
        }
    }

    const pushConversationMessage = (messageDetails: any,userData: User) => {
        let message: Message = new Message(messageDetails);
        let allConversationsInstance: ConversationType = SocketController.getAllConversations;
        if(!allConversationsInstance[message.chat_id] || message.sender === userData.email) return;

        allConversationsInstance[message.chat_id].messages.push(message);
        allConversationsInstance[message.chat_id].last_message = message;
        allConversationsInstance[message.chat_id].updated_at = message.updated_at;
        dispatch(updateAllConversations({...allConversationsInstance}));
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
