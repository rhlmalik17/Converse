import React, { useState } from 'react'
import { useSelector } from "react-redux"
import onlineIcon from "../../../../assets/home/user-status/online-light.svg";
import { SendIcon } from '../../../utilities/Icons/Icons';
import SendEmojiIcon from "../../../../assets/home/emojis.svg";
import './ChatRoom.css'

const ChatRoom = (props: any) => {

    const [populatedChatBox, setPopulatedChatBox] = useState(false);
    const currentConversationDetails = useSelector((state: any) => state.currentConversationDetails);

    if(Object.keys(currentConversationDetails).length < 1) {
        //RENDER DEFAULT CHAT SCREEN
        return (
            <div>
                Default Chat Screen
            </div>
        )
    }

    return (
        
        <div className="chat__room__container">
            {/* CONVERSATION TITLE */}
            <div className="chat__title">
                <span>{`${currentConversationDetails.first_name} ${currentConversationDetails.last_name}`}</span>
                <img src={onlineIcon} alt=""/>
            </div>


            {/* CONVERSATION WINDOW */}
            <div className="conversation__window">

            </div>

            {/* CHATBOX INPUT */}
            <div className="chatbox__input position-relative">
                <div className="chat__box__separator"></div>
                <input className={(populatedChatBox) ? "populated__chat__box" : ""} 
                       onChange={(event: any) => setPopulatedChatBox((String(event.target.value).length > 0))} 
                       placeholder={`Message ${currentConversationDetails.first_name}`} type="text"/>
                <div className="chat__box__option">
                    <SendIcon active={populatedChatBox} className="cursor-pointer"/>
                    <div className="option__separator"></div>
                    <img src={SendEmojiIcon} className="cursor-pointer emoji__icon" alt=""/>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;
