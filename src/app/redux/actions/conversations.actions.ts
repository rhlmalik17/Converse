import { ConversationType } from "../../../models/ConversationModels/ConversationSwitch.model"
import { User } from "../../../models/ConversationModels/User.model";
import SocketController from '../../../services/api-services/sockets'

//Action to swtich conversation
export const switchConversation = (conversationId: string, allConversations: ConversationType, dispatchCallback: Function, userData: User) => {
    SocketController.setCurrentConversationId = conversationId;
    if(allConversations[conversationId] && allConversations[conversationId].conversationState !== undefined)
    allConversations[conversationId].conversationState[userData.email] = { unread_count: 0 };
    dispatchCallback(updateAllConversations(allConversations));
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