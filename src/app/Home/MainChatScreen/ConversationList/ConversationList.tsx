import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultProfileImage from "../../../../assets/home/default-profile-picture.svg";
import onlineUserDate from "../../../../assets/home/user-status/online-light.svg"
import { switchConversation } from "../../../redux/actions/conversations.actions";
import { toggleLayout } from "../../../redux/actions/layout.actions";
import './ConversationList.css';
import SearchResults from "./SearchResults/SearchResults";

const ConversationList = () => {

    //Component's constants
    const conversationSwitches = [{
        name: "Friends",
        conversations: [
            { first_name: "Michael", last_name: "Wong", chat_id: 'x$135', profile_image_url: "", last_message: { body: "Yeah, we all Loved it!", created_at: "7:47 PM" } },
            { first_name: "Peter", last_name: "Parker", chat_id: 'x2135', profile_image_url: "", last_message: { body: "You have a metal Arm?!, thats cool!", created_at: "7:48 PM" } }
        ]
    }

    , { name: "Groups", conversations: [] }];

    const searchTextThreshold: number = 3;

    //Component states
    const [selectedConversationType, setSelectedConversationType] = useState(conversationSwitches[0]);
    const [selectedConversation, setSelectedConversation] = useState({ chat_id: null });
    const [searchInputState, setSearchInputState] = useState({ showDismissIcon: false, searchText: "" });
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

    const dismissSearchText = () => {
        setSearchInputState({ showDismissIcon: false, searchText: "" });
    }

    return (
        <div className="conversation__list__container">

            {/* SEARCH CONVERSATION OR PEOPLE */}
            <div className="search__conversations position-relative">
                <input value={searchInputState.searchText}  onChange={(event: any) => handleSearchChange(event)} className="search__box" placeholder="Search people or conversations" />
                <FontAwesomeIcon
                onClick={() => dismissSearchText()}
                className={"dismiss__search__icon" + ((!searchInputState.showDismissIcon) ? " hide__dismiss__icon" : "")}  
                icon={faTimes} />
            </div>

            <div className={"conversations__parent"  + (searchInputState.searchText.length < searchTextThreshold ? "d-block" : " d-none")}>

                {/* SWITCH BETWEEN CONVERSATIONS */}
                <div className="conversation__switches d-flex">
                    
                    {
                       conversationSwitches.map((value: any, index: number) => (
                        <div key={index}
                            onClick={() => setSelectedConversationType(value)}
                            className={'conversation__switch' 
                            //Conditional Class rendering
                            + ((value.name === selectedConversationType.name) ? ' selected__conversation__switch' : '')
                            + ((index > 0) ? ' switch__seperator' : '') }>
                               <div className="switch__name">
                                   <span>{value.name}</span>
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
                            <div onClick={() => handleConversationChange(value)} key={index} className={"conversation" + ((value.chat_id === selectedConversation.chat_id) ? " selected__conversation" : "") }>
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


            {/* SHOW SEARCH RESULTS */}
            <div className={"search__list__container " + (searchInputState.searchText.length < searchTextThreshold ? "d-none" : " d-flex")}>
                <SearchResults searchText={searchInputState.searchText} />    
            </div>
        
            {/* FLOATING PROFILE ICON */}
            <div onClick={() => dispatch(toggleLayout())} title="Show Profile" className="profile__img__container">
                <img className="profile__img" alt="" src={(userData && userData.profile_img) || defaultProfileImage} />
                <img className="online__status__dot" alt="" src={onlineUserDate} ></img>
            </div>

        </div>
    )
}

export default ConversationList;
