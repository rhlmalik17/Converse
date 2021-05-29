import onlineIcon from "../../../../../assets/home/user-status/online-light.svg";
import offLineIcon from "../../../../../assets/home/user-status/offline-light.svg";
import { useSelector } from "react-redux";
import './ChatTitle.css';

interface ChatTitleProps {
    isUserOnline: boolean;
    className?: string
}

const ChatTitle = ({ isUserOnline, className }: ChatTitleProps) => {
    const { currentConversationId, allConversations } = useSelector((state: any) => state);
    
    return (
        <div className={"conversation__label " + (className || '')}>
            <span>{`${allConversations[currentConversationId].participants[0]?.first_name} ${allConversations[currentConversationId].participants[0]?.last_name}`}</span>
            <img src={((isUserOnline) ? onlineIcon : offLineIcon)} alt="" />
        </div>
    )
}

export default ChatTitle;