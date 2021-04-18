import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosRequestConfig } from "axios";
import  { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultProfileImage from "../../../../assets/home/default-profile-picture.svg";
import onlineUserDate from "../../../../assets/home/user-status/online-light.svg"
import { Conversation, CONVERSATION_TYPES } from "../../../../models/ConversationModels/Conversation.model";
import { User } from "../../../../models/ConversationModels/User.model";
import { InitiateConversationResponse } from "../../../../models/ResponseModels/InitiateConversationResponse.model";
import { apiUrls } from "../../../../services/api-services/api-urls";
import httpClient from "../../../../services/api-services/http-client";
import { showSkeletonLoader } from "../../../redux/actions/common.actions";
import { switchConversation, addNewConversation } from "../../../redux/actions/conversations.actions";
import { toggleLayout } from "../../../redux/actions/layout.actions";
import chatTimeStampService from "../../../utilities/chat-time-stamp.service";
import './ConversationList.css';
import EmptyState from "./EmptyState/EmptyState";
import SearchResults from "./SearchResults/SearchResults";

const ConversationList = () => {
    //Component's constants
    const searchTextThreshold: number = 3;
    
    //Component states
    const [searchInputState, setSearchInputState] = useState({ showDismissIcon: false, searchText: "" });
    const { userData, currentConversationId, skeletonLoader, allConversations } = useSelector((state: any) => state);
    const searchInputRef = useRef(null);
    const dispatch = useDispatch();

    //Component handlers
    const handleConversationChange = (chat_id: string) => {
        dispatch(switchConversation(chat_id));
    }

    //Search on change handler
    const handleSearchChange = (event: any) => {
        let searchText = event.target.value;
        setSearchInputState({
            showDismissIcon: (String(searchText).length > 0),
            searchText: searchText
        });
    }

    const toggleConversationListSkeleton = () => {
        skeletonLoader.conversationList = !skeletonLoader.conversationList;
        dispatch(showSkeletonLoader({...skeletonLoader}))
    }

    const focusOnSearch = () => {
        if(!searchInputRef.current) return;
        (searchInputRef.current as any).focus();
    }

    const dismissSearchText = () => {
        setSearchInputState({ showDismissIcon: false, searchText: "" });
    }

    /* SEARCH RESULT CLICK FLOW */
    const handlerSearchResultClick = (searchResult: any) => {
        //Clear search pattern
        dismissSearchText();
        let userInstance: User = new User(searchResult);
        let initiateConversationQuery: AxiosRequestConfig = { params: { participant: userInstance.email } };

        toggleConversationListSkeleton();
        //Initiate the conversation
        httpClient.get(apiUrls["initiate-conversation"].route, initiateConversationQuery)
        .then((result: any) => handleSearchResultClickResponse(result, userInstance))
        .finally(() => { 
            toggleConversationListSkeleton();
         });
    }

    const handleSearchResultClickResponse = (result: any, receiverDetails: User) => {
        let response = new InitiateConversationResponse(result);

        let existingConvo = response.existing_conversation;
        if(existingConvo.length < 1) {
        //Add to the conversations
          let participants: Array<User> = new Array<User>();
          participants.push(receiverDetails);

          let conversation = new Conversation({ conversation_type: CONVERSATION_TYPES.p_to_p, chat_id: participants[0].email, participants, messages: [] }, (userData.email || ''));
          addConversation(conversation);
          handleConversationChange(conversation.chat_id);
        } else {
            //Search the conversation and select it
            if(allConversations[existingConvo[0].chat_id]) {
                handleConversationChange(existingConvo[0].chat_id);
            }
        }
    }

    const addConversation = (conversation: Conversation) => {
        dispatch(addNewConversation(conversation, allConversations));
    }

    return (
        <div className="conversation__list__container">

            {/* SEARCH CONVERSATION OR PEOPLE */}
            <div className="search__conversations position-relative">
                <input ref={searchInputRef} value={searchInputState.searchText}  onChange={(event: any) => handleSearchChange(event)} className="search__box" placeholder="Search people using email or name" />
                <FontAwesomeIcon
                onClick={() => dismissSearchText()}
                className={"dismiss__search__icon" + ((!searchInputState.showDismissIcon) ? " hide__dismiss__icon" : "")}  
                icon={faTimes} />
            </div>

            <div className={"conversations__parent"  + (searchInputState.searchText.length < searchTextThreshold ? "d-block" : " d-none")}>

                {/* SWITCH BETWEEN CONVERSATIONS */}
                <div className="conversation__switches d-flex">
                        <div className={'conversation__switch selected__conversation__switch'}>
                               <div className="switch__name">
                                   <span>Friends</span>
                               </div>
                            <div className="switch__underline"></div>
                        </div>
                </div>
           
                {/* SELECTED CONVERSATIONS */}
                <div className="conversations__container">
                    {
                        Object.keys(allConversations).map((chat_id: string, index: number) => (
                            <div onClick={() => handleConversationChange(chat_id)} key={index} 
                                 className={"conversation" + ((chat_id === currentConversationId) ? " selected__conversation" : "") }>
                                <div className="selected__border"></div>
                                <div className="conversation__card">

                                    <div className="conversation__img"
                                        style={{ backgroundImage: `url(${allConversations[chat_id].participants[0].profile_img || defaultProfileImage})`, 
                                                 backgroundSize: (allConversations[chat_id].participants[0].profile_img) ? 'cover': 'auto' }}>
                                    </div>

                                    <div className="conversation__details">
                                        <div className="conversation__title">
                                            <span>{allConversations[chat_id].participants[0].first_name + " " + allConversations[chat_id].participants[0].last_name}</span>
                                        </div>
                                        <div className="conversation__last__message">
                                            <span className="conversation__message">{allConversations[chat_id].last_message.body || allConversations[chat_id].participants[0].email}</span>
                                            <span className="conversation__timestamp">
                                                {chatTimeStampService.getChatMessageTimeStamp(allConversations[chat_id].updated_at)}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {
                /* RENDER EMPTY STATE */
                (Object.keys(allConversations).length < 1 
                && (searchInputState.searchText.length < searchTextThreshold)) ?
                (<div className="d-flex align-items-center justify-content-center empty__state__container">
                    <EmptyState onClick={() => focusOnSearch()}/>
                </div>) : null
            }

            {/* SHOW SEARCH RESULTS */}
            <div className={"search__list__container d-flex"}>
                {
                    (searchInputState.searchText.length >= searchTextThreshold) ? 
                    <SearchResults onSearchClick={handlerSearchResultClick} searchText={searchInputState.searchText} /> : null
                }
            </div>
        
            {/* FLOATING PROFILE ICON */}
            <div style={{ backgroundImage: `url(${(userData && userData.profile_img) || defaultProfileImage})` }}
                onClick={() => dispatch(toggleLayout())} title="Show Profile" 
                className={"profile__img__container " + ((userData && userData.profile_img) ? "" : " default__profile__img")}>
                <img className="online__status__dot" alt="" src={onlineUserDate} ></img>
            </div>
        </div>
    )
}

export default ConversationList;
