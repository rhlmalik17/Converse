import { useState } from "react";
import defaultProfileImage from "../../../../assets/home/default-profile-picture.svg";
import './ConversationList.css';

const ConversationList = () => {

    //Component's constants
    const conversationSwitches = [{ name: "Friends", 
    conversations: [
        { first_name: "Michael", last_name: "Wong", chat_id: 'x$135', profile_image_url: "", last_message: { body: "Yeah, we all Loved it!", created_at: "7:47 PM" } },
        { first_name: "Peter", last_name: "Parker", chat_id: 'x2135', profile_image_url: "", last_message: { body: "You have a metal Arm?!, thats cool!", created_at: "7:48 PM" } } 
    ]}
    
,{ name: "Groups", conversations: []}];

    //Component states
    const [selectedConversationType, setSelectedConversationType] = useState(conversationSwitches[0]);
    const [selectedConversation, setSelectedConversation] = useState(conversationSwitches[0].conversations[0]);

    return (
        <div className="conversation__list__container">

            {/* SEARCH CONVERSATION OR PEOPLE */}
            <div className="search__conversations">
                <input className="search__box" placeholder="Search people or conversations" />
            </div>

            <div className="conversations__parent">

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
                            <div onClick={() => setSelectedConversation(value)} key={index} className={"conversation" + ((value.chat_id === selectedConversation.chat_id) ? " selected__conversation" : "") }>
                                <div className="selected__border"></div>
                                <div className="conversation__card">
                                    <div className="conversation__img">
                                        <img alt="" src={value.profile_image_url || defaultProfileImage} />
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
        </div>
    )
}

export default ConversationList
