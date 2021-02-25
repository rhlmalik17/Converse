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


const SideBar = () => {

    //Icon click handlers
    const handleLogOut = () => {
        AuthService.logOut();
    }

    const handleAboutDeveloper = (option: string) => {
        window.open("https://rahul-malik.netlify.app/");
        setSelectedOption(option);
    } 

    const sideBarConstants: any = {
        //User related sidebar options
        userOptions: [
            { onClick: () => {}, label: "Home", icon: home, activeIcon: homeActive, className: "home" },
            { onClick: () => {}, label: "Manage Profile", icon: manageProfile, activeIcon: manageProfileActive, className: "manageProfile" },
            { onClick: handleLogOut, label: "Logout", icon: signOut, activeIcon: signOutActive, className: "logout" }
        ],

        //Application related sidebar options
        appOptions: [
            { onClick: () => handleAboutDeveloper("Home"), label: "About Developer", icon: aboutDeveloper, activeIcon: aboutDeveloperActive, className: "aboutDeveloper" },
            { onClick: () => {}, label: "Help / Report Bug", icon: reportBug, activeIcon: reportBugActive, className: "reportBug" }
        ]
    }

    const [selectedOption, setSelectedOption] = useState(sideBarConstants.userOptions[0].label);

    return (
        <div className="side__bar__container">
            <div className="side__bar__parent">
                <div className="side__bar__content">
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
