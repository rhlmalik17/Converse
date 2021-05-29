import defaultProfileImage from "../../../../assets/home/default-profile-picture.svg";
import { User } from '../../../../models/ConversationModels/User.model';
import './ProfilePicture.css';

interface ProfilePictureProps {
    userData: User,
    onClick?: Function,
    className?: string
}

const ProfilePicture = ({ onClick, className, userData }: ProfilePictureProps) => {

    return (
        <div className={((userData && userData.profile_img) ? "cursor-pointer" : " default__profile__image") + " profile__image " + (className || '') }
            style={{ backgroundImage: `url(${(userData && userData.profile_img) || defaultProfileImage})` }}
            onClick={() => (onClick) ? onClick((userData && userData.profile_img) || defaultProfileImage) : {}}>
        </div>
    )
}

export default ProfilePicture;
