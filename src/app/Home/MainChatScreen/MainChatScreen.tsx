import React from 'react'
import { useSelector } from 'react-redux'
import ChatRoom from './ChatRoom/ChatRoom'
import ConversationList from './ConversationList/ConversationList'
import './MainChatScreen.css'

const MainChatScreen = () => {
    const sideBarMode = useSelector((state: any) => state.sideBarMode);

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
