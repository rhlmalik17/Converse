import React from 'react'
import ChatRoom from './ChatRoom/ChatRoom'
import ConversationList from './ConversationList/ConversationList'
import './MainChatScreen.css'

const MainChatScreen = () => {
    return (
        <div className="main__chat__screen d-flex">
            {/* All Conversations View */}
            <ConversationList />

            {/* Selected Chat Room View */}
            <ChatRoom />
        </div>
    )
}

export default MainChatScreen
