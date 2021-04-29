import { ConversationType } from "../../../models/ConversationModels/ConversationSwitch.model"
import { User } from "../../../models/ConversationModels/User.model";
import SocketController from '../../../services/api-services/sockets'
import chatRoomService from "../../../services/app-services/chatroom.service";

//Action to swtich conversation
export const switchConversation = (conversationId: string, allConversations: ConversationType, dispatchCallback: Function, userData: User) => {
    //Reset the isTyping queue
    chatRoomService.isTypingMessageQueue = new Array<number>();

    //Set the current conversation ID for socket handlers to access
    SocketController.setCurrentConversationId = conversationId;

    if(allConversations[conversationId] && allConversations[conversationId].conversationState !== undefined) {
        allConversations[conversationId].conversationState[userData.email] = { unread_count: 0 };
        dispatchCallback(updateAllConversations(allConversations));
    }

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

export const showTypingMessage = (isTyping: boolean) => {
    return {
        type: "SHOW_TYPING_MESSAGE",
        isTyping
    }
}