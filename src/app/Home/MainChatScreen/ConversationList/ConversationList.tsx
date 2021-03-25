import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosRequestConfig } from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultProfileImage from "../../../../assets/home/default-profile-picture.svg";
import onlineUserDate from "../../../../assets/home/user-status/online-light.svg"
import { Conversation, CONVERSATION_TYPES } from "../../../../models/ConversationModels/Conversation.model";
import { ConversationSwitch } from "../../../../models/ConversationModels/ConversationSwitch.model";
import { User } from "../../../../models/ConversationModels/User.model";
import { InitiateConversationResponse } from "../../../../models/ResponseModels/InitiateConversationResponse.model";
import { apiUrls } from "../../../../services/api-services/api-urls";
import httpClient from "../../../../services/api-services/http-client";
import { switchConversation } from "../../../redux/actions/conversations.actions";
import { toggleLayout } from "../../../redux/actions/layout.actions";
import './ConversationList.css';
import EmptyState from "./EmptyState/EmptyState";
import SearchResults from "./SearchResults/SearchResults";

const ConversationList = () => {
    //Component's constants
    const searchTextThreshold: number = 3;
    let conversationSwitches: any = {
        "Friends": new ConversationSwitch("Friends")
    };
    
    //Component states
    const [selectedConversationType, setSelectedConversationType] = useState<ConversationSwitch>(conversationSwitches["Friends"]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>();
    const [searchInputState, setSearchInputState] = useState({ showDismissIcon: false, searchText: "" });
    const searchInputRef = useRef(null);
    const userData = useSelector((state: any) => state.commonReducer.userData);
    const dispatch = useDispatch();

    //Component handlers
    const handleConversationChange = (value: any) => {
        setSelectedConversation(value);
        dispatch(switchConversation(value));
    }

    //Search on change handler
    const handleSearchChange = (event: any) => {
        let searchText = event.target.value;
        setSearchInputState({
            showDismissIcon: (String(searchText).length > 0),
            searchText: searchText
        });
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
        let userInstance: User = new User(searchResult);
        let initiateConversationQuery: AxiosRequestConfig = { params: { participant: userInstance.email } };

        //Initiate the conversation
        httpClient.get(apiUrls["initiate-conversation"].route, initiateConversationQuery)
        .then((result: any) => handleSearchResultClickResponse(result, searchResult));
    }

    const handleSearchResultClickResponse = (result: any, receiverDetails: any) => {
        let response = new InitiateConversationResponse(result);
             
        let existingConvo = response.existing_conversation;
        if(existingConvo.length < 1) {
        //Add to the conversations
          let participants: Array<User> = new Array<User>();
          participants.push(new User(receiverDetails));
          participants.push(new User(receiverDetails));
          let conversation = new Conversation({ conversation_type: CONVERSATION_TYPES.p_to_p, participants });
          selectedConversationType.conversations.push(conversation);
          handleConversationChange(conversation);
        }
    }

    return (
        <div className="conversation__list__container">

            {/* SEARCH CONVERSATION OR PEOPLE */}
            <div className="search__conversations position-relative">
                <input ref={searchInputRef} value={searchInputState.searchText}  onChange={(event: any) => handleSearchChange(event)} className="search__box" placeholder="Search people using email" />
                <FontAwesomeIcon
                onClick={() => dismissSearchText()}
                className={"dismiss__search__icon" + ((!searchInputState.showDismissIcon) ? " hide__dismiss__icon" : "")}  
                icon={faTimes} />
            </div>

            <div className={"conversations__parent"  + (searchInputState.searchText.length < searchTextThreshold ? "d-block" : " d-none")}>

                {/* SWITCH BETWEEN CONVERSATIONS */}
                <div className="conversation__switches d-flex">
                    
                    {
                       Object.keys(conversationSwitches).map((conversation_type: string, index: number) => (
                        <div key={index}
                            onClick={() => setSelectedConversationType(conversationSwitches[conversation_type])}
                            className={'conversation__switch' 
                            //Conditional Class rendering
                            + ((conversationSwitches[conversation_type].conversationType === selectedConversationType.conversationType) ? ' selected__conversation__switch' : '')
                            + ((index > 0) ? ' switch__seperator' : '') }>
                               <div className="switch__name">
                                   <span>{conversationSwitches[conversation_type].conversationType}</span>
                               </div>
                            <div className="switch__underline"></div>
                        </div>
                       ))
                    }

                </div>
           
                {/* SELECTED CONVERSATIONS */}
                <div className="conversations__container">
                    {
                        selectedConversationType.conversations.map((value: any, index: number) => (
                            <div onClick={() => handleConversationChange(value)} key={index} 
                                 className={"conversation" + ((value.chat_id === selectedConversation?.chat_id) ? " selected__conversation" : "") }>
                                <div className="selected__border"></div>
                                <div className="conversation__card">
                                    <div className="conversation__img position-relative">
                                        <img className="profile-img" alt="" src={value.profile_image_url || defaultProfileImage} />
                                        <img className="" alt="" />
                                    </div>
                                    <div className="conversation__details">
                                        <div className="conversation__title">
                                            <span>{value.first_name + " " + value.last_name}</span>
                                        </div>
                                        <div className="conversation__last__message">
                                            <span className="conversation__message">{value.last_message.body}</span>
                                            <span className="conversation__timestamp">{value.last_message.created_at}</span>
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
                (selectedConversationType.conversations.length < 1 
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
