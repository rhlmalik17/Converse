import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiUrls } from '../../../services/api-services/api-urls'
import httpClient from '../../../services/api-services/http-client'
import { setUserData } from '../../redux/actions/common.actions'
import HomeSkeletonLoader from '../HomeSkeletonLoader/HomeSkeletonLoader'
import ChatRoom from './ChatRoom/ChatRoom'
import ConversationList from './ConversationList/ConversationList'
import './MainChatScreen.css'

const MainChatScreen = () => {
    const sideBarMode = useSelector((state: any) => state.sideBarMode);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    const fetchComponentData =  async () => {
        setIsLoading(true); 
        try {
          //Fetch user data
           let userData = await httpClient.get(apiUrls["user-info"].route);
           dispatch(setUserData(userData));

        } catch(err: any) {} finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
       fetchComponentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(isLoading) {
        return (
            <div className="main__container main__chat__screen">
                <HomeSkeletonLoader />
            </div>
        )
    }

    return (
        <div className={"main__chat__screen d-flex "+ ((sideBarMode) ? "hide__side__bar" : "")}>
            {/* All Conversations View */}
            <ConversationList />

            {/* Selected Chat Room View */}
            <ChatRoom />
        </div>
    )
}

export default MainChatScreen
