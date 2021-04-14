import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SkeletonLoader } from '../../../models/SkeletonModels/SkeletonLoader.model'
import { apiUrls } from '../../../services/api-services/api-urls'
import httpClient from '../../../services/api-services/http-client'
import { setUserData, showSkeletonLoader } from '../../redux/actions/common.actions'
import HomeSkeletonLoader from '../HomeSkeletonLoader/HomeSkeletonLoader'
import ChatRoom from './ChatRoom/ChatRoom'
import ConversationList from './ConversationList/ConversationList'
import SocketController from '../../../services/api-services/sockets'
import './MainChatScreen.css'

const MainChatScreen = () => {
    const sideBarMode = useSelector((state: any) => state.sideBarMode);
    const showSkeleton: SkeletonLoader = useSelector((state: any) => state.skeletonLoader);
    const dispatch = useDispatch();

    const toggleMainScreenSkeleton = () => {
        showSkeleton.mainChatScreen = !showSkeleton.mainChatScreen;
        dispatch(showSkeletonLoader({...showSkeleton}));
    }

    const fetchComponentData =  async () => {
        toggleMainScreenSkeleton(); 
        try {
          //Fetch user data
           let userData = await httpClient.get(apiUrls["user-info"].route);
           dispatch(setUserData(userData));

          //Attach the socket and it's handlers
          SocketController.connectSocket();
        } catch(err: any) {} finally {
            toggleMainScreenSkeleton();
        }
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
