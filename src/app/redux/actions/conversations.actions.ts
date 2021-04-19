import { ConversationType } from "../../../models/ConversationModels/ConversationSwitch.model"
import SocketController from '../../../services/api-services/sockets'

//Action to swtich conversation
export const switchConversation = (conversationId: string) => {
    return {
        type: "SWITCH_CONVERSATION",
        conversationId
    }
}

export const updateAllConversations = (allConversations: ConversationType) => {
    SocketController.setAllConversations = allConversations;
    return {
        type: "UPDATE_ALL_CONVERSATIONS",
        allConversations
    }
}