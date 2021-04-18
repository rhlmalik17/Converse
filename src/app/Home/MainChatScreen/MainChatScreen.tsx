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

        SocketController.socket?.on(SOCKET_CONSTANT_EVENTS.UPDATE_INITIAL_STATE, (data: any) => updateInitialState(data));
        SocketController.socket?.on(String(userData.email), () => {

        });
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
        }

        dispatch(updateAllConversations(allConversationsInstance));
    }

    /**
     * SOCKET HANDLERS
     */
    const updateInitialState = (conversationDetails: any) => {
        let initialConversationId = conversationDetails.initial_message_to;
        if(!allConversations[initialConversationId])
        return;
        
        let conversationToBeUpdated: Conversation = {...allConversations[initialConversationId]};
        delete allConversations[initialConversationId];

        conversationToBeUpdated.chat_id = conversationDetails._id;
        allConversations[conversationToBeUpdated.chat_id] = conversationToBeUpdated;
        dispatch(updateAllConversations({...allConversations}));
        dispatch(switchConversation(conversationToBeUpdated.chat_id));
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
