import React from 'react'
import './EmptyState.css'
import emptyState from '../../../../../assets/home/emptystate.svg'

const EmptyState = (props: any) => {
    return (
        <div className="d-flex flex-column align-items-center empty__state__parent">
            <img className="empty__state__logo" src={emptyState} alt=""/>
            
            <div className="d-flex align-items-center flex-column empty__state__messages">
                <label> No Chats Yet! </label>
                <span>You have no active chats</span>
            </div>

            <button onClick={props.onClick} className="primary-btn empty__state__btn"> Search People</button>
        </div>
    )
}

export default EmptyState;
