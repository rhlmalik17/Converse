import './SideBar.css'
import defaultProfile from "../../../assets/home/default-profile-picture.svg"
import SideBarLogo from "../../../assets/home/sidebar-logo.svg"
import home from "../../../assets/sidebar-icons/home.svg"
import homeActive from "../../../assets/sidebar-icons/home-active.svg"
import manageProfile from "../../../assets/sidebar-icons/manage-profile.svg"
import manageProfileActive from "../../../assets/sidebar-icons/manage-profile-active.svg"
import signOut from "../../../assets/sidebar-icons/sign-out.svg"
import signOutActive from "../../../assets/sidebar-icons/sign-out-active.svg"
import aboutDeveloper from "../../../assets/sidebar-icons/about-developer.svg"
import aboutDeveloperActive from "../../../assets/sidebar-icons/about-developer-active.svg"
import reportBug from "../../../assets/sidebar-icons/report-bug.svg"
import reportBugActive from "../../../assets/sidebar-icons/report-bug-active.svg"
import AuthService from "../../../services/app-services/auth-service"
import { useState } from 'react'
import { environment } from '../../../environment'
import ModalComponent from '../../utilities/ModalComponent/ModalComponent'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from 'react-redux'
import { ManageProfileModal } from './ManageProfileModal/ManageProfileModal'

const SideBar = () => {
    const userData = useSelector((state: any) => state.commonReducer.userData);

    //View Profile Content
    const ViewProfileModal = (props: any) => {
        const userData = props.userData;

        return (
            <div className="profile__picture__view">
                <div className="d-flex justify-content-center align-items-center profile__picture__view__dismiss__btn">
                    <FontAwesomeIcon className="cursor-pointer" icon={faTimes} onClick={() => onHideProfilePictureView()} />
                </div>
                <img src={(userData && userData.profile_img) || defaultProfile} alt=""/>
            </div>
        )
    }

    //Modal On hide handlers
    const onHideManageProfileModal = () => {
        setModalOptions({
            ...modalOptions,
            manage_profile: { ...modalOptions.manage_profile, showModal: false }
        });

        setSelectedOption("Home");
    }

    const onHideProfilePictureView = () => {
        setModalOptions({
            ...modalOptions,
            view_profile_picture: { ...modalOptions.view_profile_picture, showModal: false }
        });
    }

    //Icon click handlers
    const handleLogOut = () => {
        AuthService.logOut();
    }

    const handleAboutDeveloper = (option: string) => {
        window.open(environment.portfolio_link);
        setSelectedOption(option);
    }
    
    const handleManageProfile = () => {
        setModalOptions({
            ...modalOptions,
            manage_profile: { ...modalOptions.manage_profile, showModal: true }
        });
    }

    const handleViewProfilePicture = (profilePicture: any) => {
        if(profilePicture === defaultProfile)
        return;

        setModalOptions({
            ...modalOptions,
            view_profile_picture: { ...modalOptions.view_profile_picture, showModal: true }
        });
    }

    const sideBarConstants: any = {
        //User related sidebar options
        userOptions: [
            { onClick: () => {}, label: "Home", icon: home, activeIcon: homeActive, className: "home" },
            { onClick: handleManageProfile, label: "Manage Profile", icon: manageProfile, activeIcon: manageProfileActive, className: "manageProfile" },
            { onClick: handleLogOut, label: "Logout", icon: signOut, activeIcon: signOutActive, className: "logout" }
        ],

        //Application related sidebar options
        appOptions: [
            { onClick: () => handleAboutDeveloper("Home"), label: "About Developer", icon: aboutDeveloper, activeIcon: aboutDeveloperActive, className: "aboutDeveloper" },
            { onClick: () => {}, label: "Help / Report Bug", icon: reportBug, activeIcon: reportBugActive, className: "reportBug" }
        ]
    }

    const [selectedOption, setSelectedOption] = useState(sideBarConstants.userOptions[0].label);
    const [modalOptions, setModalOptions] = useState({
        manage_profile: { showModal: false, modalContent: ManageProfileModal, onHide: () => onHideManageProfileModal() },
        view_profile_picture: { showModal: false, modalContent: ViewProfileModal, onHide: () => onHideManageProfileModal() }
    });

    return (
        <div className="side__bar__container">
            <div className="side__bar__parent">
                <div className="side__bar__content">

                    {/* All Models */}
                    <ModalComponent {...modalOptions.manage_profile} modalProps={{userData, onHide: handleViewProfilePicture}} />
                    <ModalComponent {...modalOptions.view_profile_picture} modalProps={{userData}} />

                    <div className="converse__logo">
                        <img src={SideBarLogo} alt="" />
                    </div>

                    <div className={ ((userData && userData.profile_img) ? "cursor-pointer" : "") + " profile__image" }
                        style={{ backgroundImage: `url(${(userData && userData.profile_img) || defaultProfile})` }}
                        onClick={() => handleViewProfilePicture((userData && userData.profile_img) || defaultProfile)}>
                    </div>

                    <div className="side__bar__options">
                        <div className="user__options d-flex flex-column align-items-center w-100">
                            {
                                sideBarConstants.userOptions.map((option: any, index: number) => (
                                    
                                   <div className={`option ${option.className} ` + ((selectedOption === option.label) ? "selected__option" : "" ) } onClick={() =>  { setSelectedOption(option.label); option.onClick(); }} key={index}>
                                       <img src={((selectedOption === option.label) ? option.activeIcon : option.icon)} alt=""/>
                                       <span>{option.label}</span>
                                   </div>

                                ))
                            }
                        </div>

                        <div className="app__options d-flex flex-column align-items-center w-100">
                        {
                                sideBarConstants.appOptions.map((option: any, index: number) => (
                                    
                                   <div className={`option ${option.className} ` + ((selectedOption === option.label) ? "selected__option" : "" ) }
                                       onClick={() => { setSelectedOption(option.label); option.onClick(); }} key={index}>
                                       <img src={((selectedOption === option.label) ? option.activeIcon : option.icon)} alt=""/>
                                       <span>{option.label}</span>
                                   </div>

                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar;
