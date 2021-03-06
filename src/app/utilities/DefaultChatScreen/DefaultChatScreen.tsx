import './DefaultChatScreen.css'
import defaultConverseLogo from "../../../assets/converse-logo.svg";

const DefaultChatScreen = () => {
    return (
        <div className="default__chat__screen d-flex align-items-center justify-content-center">
            <div className="d-flex flex-column position-relative">
                <img className={"chat__screen__logo"} src={defaultConverseLogo} alt="" />
                <h3 className={"chat__screen__label"} >Select A Conversation to Continue</h3>
            </div>
        </div>
    )
}

export default DefaultChatScreen;
