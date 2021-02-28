import './SideBar.css'
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
import EmailIcon from "../../../assets/authentication/email.svg";
import UserIcon from "../../../assets/authentication/user.svg";

const SideBar = () => {
    //Modal Content
    const ManageProfileModal = () => {
        return (
            <div className="manage__profile__container">
                <div className="manage__profile__heading">
                    <span>Manage Profile</span>
                    <FontAwesomeIcon icon={faTimes} />
                </div>

                <div className="manage__profile__body">
                    <div className="profile__content">
                        <div className="profile__picture">
                            <div className="profile__img"></div>
                        </div>
                    </div>

                    <div className="set__profile__btn flex-column d-flex align-items-center justify-content-center">
                        <label htmlFor="upload-file-btn">SET PROFILE PHOTO</label>
                        <input className="d-none" id="upload-file-btn" type="file"/>
                    </div>

                    <div className="profile__details__container">

                        <div className="profile__details__parent">
                            <div className="profile__details__icon">
                                <img src={EmailIcon} alt="" />
                            </div>

                            <div className="profile__detail__field">
                                <span>Michael</span>
                                <label>First Name</label>
                            </div>
                        </div>

                        <div className="profile__details__parent">
                            <div className="profile__details__icon">
                                <img src={EmailIcon} alt="" />
                            </div>

                            <div className="profile__detail__field">
                                <span>Wong</span>
                                <label>Last Name</label>
                            </div>
                        </div>

                        <div className="profile__details__parent user__icon">
                            <div className="profile__details__icon">
                                <img src={UserIcon} alt="" />
                            </div>

                            <div className="profile__detail__field">
                                <span>wong.michael@gmail.com</span>
                                <label>Email Address</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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
            manage_profile: { showModal: true, modalContent: ManageProfileModal }
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
    const [modalOptions, setModalOptions] = useState({ manage_profile: { showModal: false, modalContent: ManageProfileModal }});

    return (
        <div className="side__bar__container">
            <div className="side__bar__parent">
                <div className="side__bar__content">

                    {/* All Models */}
                    <ModalComponent {...modalOptions.manage_profile} />

                    <div className="converse__logo">
                        <img src={SideBarLogo} alt="" />
                    </div>

                    <div className="profile__image"></div>
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
