import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import EmailIcon from "../../../../assets/authentication/email.svg";
import UserIcon from "../../../../assets/authentication/user.svg";
import defaultProfile from "../../../../assets/home/default-profile-picture.svg"
import { setUserData } from "../../../redux/actions/common.actions";
import ModalComponent from "../../../utilities/ModalComponent/ModalComponent";
import SetProfilePictureModal from "./SetProfilePictureModal";

//Manage Profile Modal
export const ManageProfileModal = (props: any) => {
    const [imageSelectorOptions, setImageSelectorOptions] = useState<any>({
        file: null, showModal: false, modalContent: SetProfilePictureModal
    });

    const dispatch = useDispatch();
    const userData = props.userData;

    const onSuccessfullUpload = (result: any) => {
        if(!result || !result.profile_img)
        return;

        dispatch(setUserData({ ...userData, profile_img: result.profile_img }));
    }

    const handleProfilePictureChange = (event: any) => {
        if(!event || !event.target || !event.target.files)
        return;

        //Upload profile picture
        let fileInstance = event.target.files[0];

        //Clear the file values
        event.target.value = null;
        event.target.files = null;

        setImageSelectorOptions({ ...imageSelectorOptions, file: fileInstance, showModal: true });
    }

    const dimissImageSelector = () => {
        setImageSelectorOptions({ ...imageSelectorOptions, file: null, showModal: false });
    }

    return (
        <div className="manage__profile__container">

            {/* SHOW PROFILE UPLOAD MODAL */}
            <ModalComponent
            {...imageSelectorOptions} 
            backdropClassName="set__profile__backdrop"
            className="set__profile__modal" 
            modalProps={{ selectedImage: imageSelectorOptions.file, onHide: dimissImageSelector, onSuccessfullUpload }} 
            onHide={() => dimissImageSelector()} />
            
            <div className="manage__profile__heading">
                <span>Manage Profile</span>
                <FontAwesomeIcon className="cursor-pointer" icon={faTimes} onClick={() => props.onHide()} />
            </div>

            <div className="manage__profile__body">
                <div className="profile__content">
                    <div className="profile__picture">
                        <div style={{ backgroundImage: `url(${(userData && userData.profile_img) || defaultProfile})` }} className="profile__img"></div>
                    </div>
                </div>

                <div className="set__profile__btn flex-column d-flex align-items-center justify-content-center">
                    <label htmlFor="upload-file-btn">SET PROFILE PHOTO</label>
                    <input onChange={(event: any) => handleProfilePictureChange(event)} className="d-none" id="upload-file-btn" type="file" />
                </div>

                <div className="profile__details__container">

                    <div className="profile__details__parent">
                        <div className="profile__details__icon">
                            <img src={EmailIcon} alt="" />
                        </div>

                        <div className="profile__detail__field">
                            <span>{(userData && userData.first_name) ? userData.first_name : '-'}</span>
                            <label>First Name</label>
                        </div>
                    </div>

                    <div className="profile__details__parent">
                        <div className="profile__details__icon">
                            <img src={EmailIcon} alt="" />
                        </div>

                        <div className="profile__detail__field">
                            <span>{(userData && userData.last_name) ? userData.last_name : '-'}</span>
                            <label>Last Name</label>
                        </div>
                    </div>

                    <div className="profile__details__parent user__icon">
                        <div className="profile__details__icon">
                            <img src={UserIcon} alt="" />
                        </div>

                        <div className="profile__detail__field">
                            <span>{(userData && userData.email) ? userData.email : ''}</span>
                            <label>Email Address</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}