import "./ChatCallIcon.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface ChatCallIconProps {
    disableIcon: boolean;
    icon: IconDefinition;
    disabledIcon: IconDefinition;
    disabledIconTooltip: string;
}

const ChatCallIcon = (props: ChatCallIconProps) => {
    return (
        <div title={(props.disableIcon) ? props.disabledIconTooltip : ""} className={"chat__call__option " + ((props.disableIcon) ? "disabled__call__option" : "")}>
            <FontAwesomeIcon icon={(props.disableIcon) ? props.disabledIcon : props.icon} />
        </div>
    )
}

export default ChatCallIcon;
