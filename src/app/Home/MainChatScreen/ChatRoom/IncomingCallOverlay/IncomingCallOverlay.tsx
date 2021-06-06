import { useSelector } from 'react-redux';
import { GlobalState } from '../../../../../models/GlobalStateModels/GlobalState.model';
import ProfilePicture from '../../../Sidebar/ProfilePicture/ProfilePicture';
import callAcceptIcon from "../../../../../assets/home/call/call-accept.svg";
import './IncomingCallOverlay.css';

const IncomingCallOverlay = () => {
    const { userData } = useSelector((state: GlobalState) => state);

    return (
        <div className="incoming__call__container d-flex flex-column">
            <div className="incoming__call__header d-flex align-items-center justify-content-center">
                <span className="mr-2">Incoming Call...</span>
                <img src={callAcceptIcon} alt="" />
            </div>
            
            <div className="incoming__call__parent">
                <div className="incoming__caller d-flex mb-2">
                    <ProfilePicture className="incoming__caller__avatar" userData={userData} />
                    <div className="incoming__caller__details ml-3 d-flex flex-column justify-content-center">
                        <span className="incoming__caller__name">{`${userData.first_name} ${userData.last_name}`}</span>
                        <span className="incoming__caller__email">{userData.email}</span>
                    </div>
                </div>

                <div className="incoming__call__overlay__options d-flex justify-content-end">
                    <button className="incoming__call__reject__btn mr-2"> Reject </button>
                    <button className="incoming__call__accept__btn"> Accept </button>
                </div>
            </div>
        </div>
    )
}

export default IncomingCallOverlay;
