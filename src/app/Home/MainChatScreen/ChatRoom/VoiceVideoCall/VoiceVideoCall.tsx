import { useDispatch, useSelector } from 'react-redux';
import ChatTitle from '../ChatTitle/ChatTitle';
import ProfilePicture from '../../../Sidebar/ProfilePicture/ProfilePicture';
import CallMicrophone from '../../../../../assets/home/call/call-mic.svg';
import HangUpIcon from '../../../../../assets/home/call/call-phone.svg';
import VideoIcon from '../../../../../assets/home/call/call-video-icon.svg';
import MessageIcon from '../../../../../assets/home/call/call-message.svg';
import DownArrow from '../../../../../assets/home/call/down-arrow.svg';

import './VoiceVideoCall.css';
import { GlobalState } from '../../../../../models/GlobalStateModels/GlobalState.model';
import { updateCallState } from '../../../../redux/actions/conversations.actions';
import { CallState } from '../../../../../models/ConversationModels/CallState.model';
import callService from '../../../../../services/app-services/call.service';

/* COMPONENT PROPERTIES */
interface VoiceVideoCallProps {
    isUserOnline: boolean
}

const VoiceVideoCall = ({ isUserOnline }: VoiceVideoCallProps) => {
    const { currentConversationId, allConversations, callState } = useSelector((state: GlobalState) => state);
    const dispatch = useDispatch();

    /* HANG UP THE CALL */
    const hangUpCall = () => {
        /* STOP THE TIMER AND RENEW THE CALL STATE */
        callService.stopTimer();
        dispatch(updateCallState(new CallState()));
    }

    return (
        <div className={"d-flex flex-column align-items-center call__container" + ((callState.call_overlay) ? "" : " hide__call__overlay")}>
            <ChatTitle className="call__chat__title" isUserOnline={isUserOnline} />

            <div className="call__avatar__container position-relative">

                <div className="call__avatar__rings call__avatar__rings__one call__avatar__blip">
                    <div className="call__avatar__rings__two">
                        <div className="call__avatar__rings__three"></div>
                    </div>
                </div>

                <ProfilePicture userData={allConversations[currentConversationId].participants[0] || {}} className="call__avatar" />
            </div>

            <div className="call__dashboard d-flex align-items-center flex-column">
                <div className="call__timestamp">{ callState.callTimerClock }</div>

                <div className="call__options d-flex justify-content-between">
                    {/* MUTE OPTION */}
                    <div className="call__option">
                        <img src={CallMicrophone} alt="" />
                    </div>

                    {/* HANG CALL OPTION */}
                    <div className="call__option" onClick={() => hangUpCall()}>
                        <div className="call__option__overlay"></div>
                        <img src={HangUpIcon} alt="" />
                    </div>

                    {/* TOGGLE VIDEO OPTION */}
                    <div className="call__option">
                        <img src={VideoIcon} alt="" />
                    </div>
                </div>

                <div className="toggle__call__container d-flex flex-column cursor-pointer align-items-center"
                    onClick={() => callService.handleToggleCallOverlay(false, callState, dispatch, updateCallState) }>
                    <div className="toggle__call__btn">
                        <img src={MessageIcon} alt="" />
                    </div>
                    <img className="toggle__call__arrow" src={DownArrow} alt="" />
                </div>
            </div>
        </div>
    )
}

export default VoiceVideoCall;
