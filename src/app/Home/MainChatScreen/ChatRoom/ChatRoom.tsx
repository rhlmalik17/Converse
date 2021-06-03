import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { faLaughBeam, faPhone, faVideo, faPhoneSlash, faVideoSlash, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SendIcon } from '../../../utilities/Icons/Icons';
import { Message } from '../../../../models/ConversationModels/Message.model';
import { updateAllConversations, updateCallState, updateCallTimer } from '../../../redux/actions/conversations.actions';
import SocketController, { SOCKET_CONSTANT_EVENTS } from '../../../../services/api-services/sockets'
import { Subscription } from 'rxjs';
import chatRoomService, { chatRoomEvents, ChatRoomUpdate } from '../../../../services/app-services/chatroom.service';
import { Conversation } from '../../../../models/ConversationModels/Conversation.model';
import { AxiosRequestConfig } from 'axios';
import { FetchMessages } from '../../../../models/request.models';
import { ScrollPaginator } from '../../../../models/app.model';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { apiUrls } from '../../../../services/api-services/api-urls';
import { showSkeletonLoader } from '../../../redux/actions/common.actions';
import { User, UserActiveStatus } from '../../../../models/ConversationModels/User.model';
import httpClient from '../../../../services/api-services/http-client';
import MessagesSkeleton from '../../../utilities/MessagesSkeleton/MessagesSkeleton';
import IsTypingMessage from './IsTypingMessage/IsTypingMessage';
import ChatTimeStampService from "../../../utilities/chat-time-stamp.service";
import DefaultChatScreen from '../../../utilities/DefaultChatScreen/DefaultChatScreen';
import defaultProfileImage from "../../../../assets/home/default-profile-picture.svg";
import onlineIcon from "../../../../assets/home/user-status/online-light.svg";
import messagesSpinner from "../../../../assets/home/loader.svg";
import VoiceVideoCall from './VoiceVideoCall/VoiceVideoCall';
import ChatTitle from './ChatTitle/ChatTitle';
import ChatCallIcon from "../../../../app/utilities/ChatCallIcon/ChatCallIcon";
import './ChatRoom.css';
import { GlobalState } from '../../../../models/GlobalStateModels/GlobalState.model';
import { CallState } from '../../../../models/ConversationModels/CallState.model';
import callService from '../../../../services/app-services/call.service';

const ChatRoom = (props: any) => {
    const [populatedChatBox, setPopulatedChatBox] = useState<boolean>(false);
    const [messagesPaginationLoader, setMessagesPaginationLoader] = useState<boolean>(false);
    const [isUserOnline, setIsUserOnline] = useState<boolean>(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [messageContent, setMessageContent] = useState<string>("");
    const { userData, currentConversationId, allConversations, skeletonLoader, isTyping, callState } = useSelector((state: GlobalState) => state);
    const chatWindow = useRef(null);
    const chatInput = useRef(null);
    const dispatch = useDispatch();

    /* STATIC CONTENT */
    const STATIC_CONTENT = { call_options_disabled_tooltip: "You're already on a call with someone" };

    let chatServiceSubscription: Subscription = chatRoomService.chatRoomBroadCaster.subscribe((data: any) => chatRoomServiceHandler(data));

    const messageBoxChangeHandler = (event: any) => {
        let messageBody = event.target.value;

        setPopulatedChatBox((String(messageBody).length > 0));
        setMessageContent(messageBody);

        if(!chatRoomService.isInitialConversation(allConversations, currentConversationId))
        SocketController.sendTypingSignal(currentConversationId, userData);
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
        if(allConversations[currentConversationId].chat_id === allConversations[currentConversationId].participants[0]?.email) {
            messageDetails.initial_message_to = allConversations[currentConversationId].participants[0]?.email;
        }

        SocketController.emitChatMessage(messageDetails);

        chatRoomService.pushMessageToConversation(messageDetails, allConversations, currentConversationId, dispatch, updateAllConversations, userData);

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
        else
        setMessagesPaginationLoader(true);

        httpClient.get(apiUrls['messages'].route, fetchMessagesPayload)
        .then((response: any) => {
            if(paginationOptions.page_number === 1)
            toggleMessagesSkeleton();
            else
            setMessagesPaginationLoader(false);

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
            !((event.currentTarget.scrollTop) <= 200))
        return;
        
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

    const handleUserStatus = (userStatus: UserActiveStatus) => {
        let conversation: Conversation = SocketController.getAllConversations[SocketController.getCurrentConversationId];
        if(!conversation) return;

        let [participant]: Array<User> = conversation.participants;
        if(participant.email !== userStatus.userEmail) return;

        setIsUserOnline(userStatus?.isUserActive || false);
    }

    const getUserActiveStatus = () => {
        SocketController.attachEventToSocket(SOCKET_CONSTANT_EVENTS.GET_USER_STATUS, handleUserStatus);
        if (!currentConversationId || !(allConversations[currentConversationId]?.participants?.length > 0)) return;
        let participant: User = allConversations[currentConversationId]?.participants[0];
        SocketController.socket.emit(SOCKET_CONSTANT_EVENTS.GET_USER_STATUS, { userEmail: participant.email });
    }

    const onEmojiClick = (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => {
        let newValue = messageContent + data.emoji;

        setPopulatedChatBox((String(newValue).length > 0));
        setMessageContent(newValue);

        (chatInput?.current as any)?.focus();
    }

    /* CALL ICONS CLICK HANDLERS */
    const handleInvokeCall = (icon: IconDefinition) => {
        // AUDIO STREAM / VOICE CALL MODE WILL ALWAYS BE TRUE
        let callStreams = { audio: true, video: icon === faVideo };

        /**
         * 1. Set the conversation ID the call is connected to
         * 2. Set the ongoing call flag to true
         * 3. Set the outgoing call to the participants array
         * 4. Set the call outgoing streams
         */
        callState.chat_id = currentConversationId;
        callState.ongoing_call = true;
        callState.outgoing_call_to = allConversations[currentConversationId]?.participants || new Array<User>();
        callState.call_streams = callStreams;
        callState.call_overlay = true;

        /* Start the timer Set the new call state */
        callService.startTimer(dispatch, updateCallTimer);
        dispatch(updateCallState(new CallState(callState)));
    }


    useEffect(() => {
        return () => {
            if(chatServiceSubscription)
            chatServiceSubscription.unsubscribe();
        }
    }, [chatServiceSubscription]);

    useEffect(() => {
        let paginationOptions: ScrollPaginator = allConversations[currentConversationId]?.scrollPaginator;
        if(paginationOptions && paginationOptions.page_number >= 2)
        scrollToBottom();

        setIsUserOnline(false);
        getUserActiveStatus();
        let conversation: Conversation = allConversations[currentConversationId];
        if(!conversation) return;

        if(conversation.messages.length < 1 
            && conversation.participants.length > 0
            && conversation.participants[0].email !== conversation.chat_id) {
            fetchConversationMessages();
        }
        //eslint-disable-next-line
    }, [currentConversationId]);

    useEffect(() => {
        let paginationOptions: ScrollPaginator = allConversations[currentConversationId]?.scrollPaginator;

        if(paginationOptions && paginationOptions.page_number >= 2)
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
        
        <div className="chat__room__container position-relative">
            {/* VOICE / VIDEO CALL SECTION */}
            { (callState.ongoing_call && callState.chat_id === currentConversationId) ? <VoiceVideoCall isUserOnline={isUserOnline} /> : null }

            {/* CONVERSATION TITLE */}
            <div className="chat__title">
                <ChatTitle isUserOnline={isUserOnline} />
                {
                    ((callState.chat_id === currentConversationId && callState.ongoing_call)) ?
                        <button className="cursor-pointer resume__call__btn"
                        onClick={() => callService.handleToggleCallOverlay(true, callState, dispatch, updateCallState) }> Resume Call </button> 
                        :
                        (<div className="chat__call__options position-relative d-flex">
                            <ChatCallIcon onClick={handleInvokeCall} disabledIconTooltip={STATIC_CONTENT.call_options_disabled_tooltip} icon={faPhone} disabledIcon={faPhoneSlash} disableIcon={(callState.chat_id !== currentConversationId && callState.ongoing_call)} />
                            <ChatCallIcon onClick={handleInvokeCall} disabledIconTooltip={STATIC_CONTENT.call_options_disabled_tooltip} icon={faVideo} disabledIcon={faVideoSlash} disableIcon={(callState.chat_id !== currentConversationId && callState.ongoing_call)} />
                        </div>)
                }      
            </div>

            {/* CONVERSATION WINDOW */}
            <div className="conversation__window" onScroll={(event: any) => onChatWindowScroll(event)} ref={chatWindow} id="conversation__window">
                {/* MESSAGES PAGINATION SPINNER */}
                {(messagesPaginationLoader) ?
                    (
                        <div className="messages__pagination__spinner">
                            <img src={messagesSpinner} alt="" />
                        </div>
                    ) : null
                }

                {
                    (skeletonLoader.messagesList) ? 
                    (
                        <MessagesSkeleton />
                    )
                    :
                    allConversations[currentConversationId].messages.map((messageDetails: Message, index: number) => (
                        <div key={index} className={ "message__container"
                             //Render Conditionally
                            + ((chatRoomService.selfMessageMargin(allConversations[currentConversationId].messages, index)) ? " self__message__margin" : "") 
                            + ((ChatTimeStampService.invalidTimeStamp(allConversations[currentConversationId].messages, index) ? 
                                '' : ' timestamp__margin'))}>

                            <div className={
                                ((ChatTimeStampService.showSegregator(allConversations[currentConversationId].messages, index) ? " message__day__segregator" : " d-none"))
                            }>
                                <div className="segregator"></div>
                                <span> {ChatTimeStampService.showSegregator(allConversations[currentConversationId].messages, index)} </span>
                            </div>
                            
                            <div className={ "d-flex w-100 align-items-start"
                                            + ((messageDetails.sender === userData.email) ? " self__message" : "")
                                        }>
                                <div className={"user__avatar__container position-relative " + ((messageDetails.sender !== userData.email) ? " d-none" : "")}>
                                    <div className={"user__avatar "}>
                                        <img src={(userData && userData.profile_img) || defaultProfileImage} alt="" />
                                    </div>
                                    <img className="online__status__dot" alt="" src={onlineIcon} ></img>
                                </div>


                                <div className="message__body position-relative">

                                    <div className={"message__timestamp "
                                        + ((ChatTimeStampService.invalidTimeStamp(allConversations[currentConversationId].messages, index) ?
                                            "d-none" : ''))}>
                                        <span>{ChatTimeStampService.getChatMessageTimeStamp(messageDetails.updated_at, true)}</span>
                                    </div>

                                    <div className="message__text">
                                        <span>{messageDetails.body}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* DYNAMIC is Typing MESSAGE */}
            <div className={"is__typing__container "+((!isTyping) ? " d-none" : "")}>
                <IsTypingMessage username={allConversations[currentConversationId].participants[0]?.first_name + " " + allConversations[currentConversationId].participants[0]?.last_name} />
            </div>

            {/* CHATBOX INPUT */}
            <div className="chatbox__input position-relative">
                <div className="chat__box__separator"></div>

                <input value={messageContent}
                       //CHAT BOX REFERENCE
                       ref={chatInput}

                       // CONDITIONAL RENDERING
                       className={(populatedChatBox) ? "populated__chat__box" : ""}

                       //Key Events
                       onKeyDown={(event: any) => handleKeydown(event)}
                       onChange={(event: any) => messageBoxChangeHandler(event)}

                       //Dynamic placeholder
                       placeholder={`Message ${allConversations[currentConversationId].participants[0]?.first_name}`} type="text"/>

                <div className="chat__box__option">
                    <button onClick={() => pushMessage(messageContent)} className="send__btn"  disabled={!populatedChatBox}>
                        <SendIcon active={populatedChatBox} className={(populatedChatBox) ? "cursor-pointer" : ""} />
                    </button>
                    <div className="option__separator"></div>
                    <FontAwesomeIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)} icon={faLaughBeam}
                        className={"emoji__icon " + (showEmojiPicker ? " active__emoji__icon" : "")}
                    />
                </div>
            </div>
            
            { /* EMOJI PICKER */ }
            <Picker native={true} pickerStyle={{ width: '100%', height: (showEmojiPicker) ? '320px' : '0px',transition: '0.6s ease' }} disableSearchBar={true} preload={true} onEmojiClick={onEmojiClick} />
        </div>
    )
}

export default ChatRoom;
