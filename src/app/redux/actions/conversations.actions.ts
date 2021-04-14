import { Conversation } from "../../../models/ConversationModels/Conversation.model"
import { ConversationType } from "../../../models/ConversationModels/ConversationSwitch.model"
import { Message } from "../../../models/ConversationModels/Message.model"

//Action to swtich conversation
export const switchConversation = (conversationId: string) => {
    return {
        type: "SWITCH_CONVERSATION",
        conversationId
    }
}

export const addNewConversation = (conversation: Conversation, allConversations: ConversationType) => {
    allConversations[conversation.chat_id] = conversation;
    return {
        type: "ADD_NEW_CONVERSATION",
        allConversations
    }
}

export const addNewMessage = (message: Message, allConversations: ConversationType) => {
    return {
        type: "ADD_MESSAGE",
        message,
        allConversations
    }
}