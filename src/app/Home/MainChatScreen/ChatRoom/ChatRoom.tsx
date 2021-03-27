import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from "react-redux"
import defaultProfileImage from "../../../../assets/home/default-profile-picture.svg";
import onlineIcon from "../../../../assets/home/user-status/online-light.svg";
import { SendIcon } from '../../../utilities/Icons/Icons';
import { faLaughBeam } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatTimeStampService from "../../../utilities/chat-time-stamp.service";
import './ChatRoom.css'
import DefaultChatScreen from '../../../utilities/DefaultChatScreen/DefaultChatScreen';
import { Message } from '../../../../models/ConversationModels/Message.model';

const ChatRoom = (props: any) => {

    const [populatedChatBox, setPopulatedChatBox] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const { currentConversationDetails, userData } = useSelector((state: any) => state);
    const chatWindow = useRef(null);

    //MESSAGE LIST
    const [chatMessages, setChatMessages] = useState<Array<Message>>([
        new Message({ sender: "", chat_id: "", body: "Hi", updated_at: new Date()})
    ]);

    const messageBoxChangeHandler = (event: any) => {
        let messageBody = event.target.value;

        setPopulatedChatBox((String(messageBody).length > 0));
        setMessageContent(messageBody);
    }

    const scrollToBottom = () => {
        if(!chatWindow || !chatWindow.current) 
        return;

        //Scroll the chat window to bottom
        let chatWindowElement: any = chatWindow.current;
        chatWindowElement.scrollTop = chatWindowElement.scrollHeight + 1000;
    }

    const pushMessage = (messageBody: string) => {
        let messageDetails: Message = new Message();
        messageDetails.sender = userData.email;
        messageDetails.updated_at = new Date();
        messageDetails.body = messageBody;

        if(!currentConversationDetails.chat_id) {
            messageDetails.initial_message_to = currentConversationDetails.participants[0].email;
        }

        setChatMessages(chatMessages.concat([messageDetails]));
        setMessageContent("");
        setPopulatedChatBox(false);
    }

    const handleKeydown = (event: any) => {
        if(event.keyCode === 13) {
            //Enter key pressed

            if(String(event.target.value).length > 0) {
              pushMessage(event.target.value);
            }
        }
    }

    useEffect(() => {
        scrollToBottom();
    },[chatMessages])

    if(Object.keys(currentConversationDetails).length < 1) {
        //RENDER DEFAULT CHAT SCREEN
        return (
           <DefaultChatScreen />
        )
    }

    return (
        
        <div className="chat__room__container">
            {/* CONVERSATION TITLE */}
            <div className="chat__title">
                <span>{`${currentConversationDetails.participants[0].first_name} ${currentConversationDetails.participants[0].last_name}`}</span>
                <img src={onlineIcon} alt=""/>
            </div>


            {/* CONVERSATION WINDOW */}
            <div className="conversation__window" ref={chatWindow} id="conversation__window">

                {
                    chatMessages.map((messageDetails: any, index: number) => (
                        <div key={index} className={ "message__container"
                             //Render Conditionally
                            + ((messageDetails.sender === userData.email) ? " self__message" : "") }>
                            
                            <div className={"user__avatar " + ((messageDetails.sender !== userData.email) ? " d-none" : "")}>
                                <img src={defaultProfileImage} alt="" />
                            </div>
                            
                            <div className="message__body position-relative">
                              <div className="message__timestamp">
                                  <span>{ChatTimeStampService.getChatMessageTimeStamp(messageDetails.updated_at)}</span>
                              </div>

                              <div className="message__text">
                                  <span>{messageDetails.body}</span>
                              </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* DYNAMIC is Typing MESSAGE */}
            {/* <div className="is__typing__container">
                <IsTypingMessage username={currentConversationDetails.participants[0].first_name + " " + currentConversationDetails.participants[0].last_name} />
            </div> */}

            {/* CHATBOX INPUT */}
            <div className="chatbox__input position-relative">
                <div className="chat__box__separator"></div>

                <input value={messageContent}
                       // CONDITIONAL RENDERING
                       className={(populatedChatBox) ? "populated__chat__box" : ""}

                       //Key Events
                       onKeyDown={(event: any) => handleKeydown(event)}
                       onChange={(event: any) => messageBoxChangeHandler(event)}

                       //Dynamic placeholder
                       placeholder={`Message ${currentConversationDetails.participants[0].first_name}`} type="text"/>

                <div className="chat__box__option">
                    <button onClick={() => pushMessage(messageContent)} className="send__btn"  disabled={!populatedChatBox}>
                        <SendIcon active={populatedChatBox} className={(populatedChatBox) ? "cursor-pointer" : ""} />
                    </button>
                    <div className="option__separator"></div>
                    <FontAwesomeIcon className="emoji__icon" icon={faLaughBeam} />
                </div>
            </div>
        </div>
    )
}

export default ChatRoom;
