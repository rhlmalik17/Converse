import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { faLaughBeam } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultProfileImage from "../../../../assets/home/default-profile-picture.svg";
import onlineIcon from "../../../../assets/home/user-status/online-light.svg";
import { SendIcon } from '../../../utilities/Icons/Icons';
import ChatTimeStampService from "../../../utilities/chat-time-stamp.service";
import DefaultChatScreen from '../../../utilities/DefaultChatScreen/DefaultChatScreen';
import { Message } from '../../../../models/ConversationModels/Message.model';
import { updateAllConversations } from '../../../redux/actions/conversations.actions';
import SocketController from '../../../../services/api-services/sockets'
import './ChatRoom.css'
import { Subscription } from 'rxjs';
import chatRoomService, { chatRoomEvents, ChatRoomUpdate } from '../../../../services/app-services/chatroom.service';
import { Conversation } from '../../../../models/ConversationModels/Conversation.model';
import { AxiosRequestConfig } from 'axios';
import { FetchMessages } from '../../../../models/request.models';
import { ScrollPaginator } from '../../../../models/app.model';
import httpClient from '../../../../services/api-services/http-client';
import { apiUrls } from '../../../../services/api-services/api-urls';
import { showSkeletonLoader } from '../../../redux/actions/common.actions';
import MessagesSkeleton from '../../../utilities/MessagesSkeleton/MessagesSkeleton';

const ChatRoom = (props: any) => {
    const [populatedChatBox, setPopulatedChatBox] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const { userData, currentConversationId, allConversations, skeletonLoader } = useSelector((state: any) => state);
    const chatWindow = useRef(null);
    const dispatch = useDispatch();

    let chatServiceSubscription: Subscription = chatRoomService.chatRoomBroadCaster.subscribe((data: any) => chatRoomServiceHandler(data));

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
        /* CREATE MESSAGE INSTANCE */
        let messageDetails: Message = new Message();
        messageDetails.sender = userData.email;
        messageDetails.updated_at = new Date();
        messageDetails.body = messageBody;
        messageDetails.chat_id = allConversations[currentConversationId].chat_id;

        /* SET IF AN INITIAL CONVERSATION MESSAGE */
        if(allConversations[currentConversationId].chat_id === allConversations[currentConversationId].participants[0].email) {
            messageDetails.initial_message_to = allConversations[currentConversationId].participants[0].email;
        }

        SocketController.emitChatMessage(messageDetails);
        allConversations[currentConversationId].messages.push(messageDetails);
        allConversations[currentConversationId].last_message = messageDetails;
        allConversations[currentConversationId].updated_at = messageDetails.updated_at;
        dispatch(updateAllConversations({...allConversations}));
        setMessageContent("");
        setPopulatedChatBox(false);
    }

    const fetchConversationMessages = () => {
        let paginationOptions: ScrollPaginator = allConversations[currentConversationId].scrollPaginator;

        if(paginationOptions.halt_lazy_loading || paginationOptions['ongoing_request'])
        return;

        paginationOptions['ongoing_request'] = true;
        let fetchMessagesPayload: AxiosRequestConfig = { params: new FetchMessages(currentConversationId, paginationOptions.page_number) };
        
        if(paginationOptions.page_number === 1)
        toggleMessagesSkeleton();

        httpClient.get(apiUrls['messages'].route, fetchMessagesPayload)
        .then((response: any) => {
            if(paginationOptions.page_number === 1)
            toggleMessagesSkeleton();

            let messagesList: Array<Message> = response.message_list || [];
            concatConversationMessages(messagesList);

            /* Increment Page for Pagination */
            paginationOptions.page_number++;

            if(messagesList.length < paginationOptions.per_page_record)
            paginationOptions.halt_lazy_loading = true;
        })
        .finally(() => {
            paginationOptions['ongoing_request'] = false; 
        });
    }

    const onChatWindowScroll = (event: React.UIEvent<HTMLElement>) => {
        let paginationOptions: ScrollPaginator = allConversations[currentConversationId].scrollPaginator;
        if(paginationOptions.ongoing_request ||
            paginationOptions.halt_lazy_loading ||
            !((event.currentTarget.scrollTop) <= 1))
        return;
        
        console.log("invoked")
        //Scrolled at bottom
        fetchConversationMessages();
    }

    const toggleMessagesSkeleton = () => {
        skeletonLoader.messagesList = !skeletonLoader.messagesList;
        dispatch(showSkeletonLoader({...skeletonLoader}));
    }

    const concatConversationMessages = (messages: Array<Message>) => {
        if(!messages || messages.length < 1)
        return;

        let allMessages = ((messages).map((message: any) => new Message(message))).concat(allConversations[currentConversationId].messages);
        allConversations[currentConversationId].messages = allMessages;

        dispatch(updateAllConversations({...allConversations}));
    }

    const handleKeydown = (event: any) => {
        if(event.keyCode === 13) {
            //Enter key pressed

            if(String(event.target.value).length > 0) {
              pushMessage(event.target.value);
            }
        }
    }

    const chatRoomServiceHandler = (data: ChatRoomUpdate) => {
        switch(data.mode){
            case chatRoomEvents.SCROLL_TO_BOTTOM: 
            scrollToBottom();
            break;
        }
    }

    useEffect(() => {
        return () => {
            if(chatServiceSubscription)
            chatServiceSubscription.unsubscribe();
        }
    }, [chatServiceSubscription]);

    useEffect(() => {
        let conversation: Conversation = allConversations[currentConversationId];
        if(!conversation) return;

        if(conversation.messages.length < 1) {
            fetchConversationMessages();
        }
        //eslint-disable-next-line
    }, [currentConversationId]);

    useEffect(() => {
        scrollToBottom();
        //eslint-disable-next-line
    }, [allConversations]);

    if(Object.keys(allConversations[currentConversationId] || {}).length < 1) {
        //RENDER DEFAULT CHAT SCREEN
        return (
           <DefaultChatScreen />
        )
    }

    return (
        
        <div className="chat__room__container">
            {/* CONVERSATION TITLE */}
            <div className="chat__title">
                <span>{`${allConversations[currentConversationId].participants[0].first_name} ${allConversations[currentConversationId].participants[0].last_name}`}</span>
                <img src={onlineIcon} alt=""/>
            </div>


            {/* CONVERSATION WINDOW */}
            <div className="conversation__window" onScroll={(event: any) => onChatWindowScroll(event)} ref={chatWindow} id="conversation__window">
                {
                    (skeletonLoader.messagesList) ? 
                    (
                        <MessagesSkeleton />
                    )
                    :
                    allConversations[currentConversationId].messages.map((messageDetails: any, index: number) => (
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
                       placeholder={`Message ${allConversations[currentConversationId].participants[0].first_name}`} type="text"/>

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
