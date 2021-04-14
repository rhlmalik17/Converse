import { ConversationType } from "../../../models/ConversationModels/ConversationSwitch.model";

const currentConversationId = (state: string = '', action: any) => {
    switch(action.type) {
        case "SWITCH_CONVERSATION":
            return action.conversationId ? action.conversationId : state;

        default:
            return state;
    }
}

export const allConversations = (state: ConversationType = {}, action: any) => {
    switch (action.type) {
      case "ADD_NEW_CONVERSATION":
        return action.allConversations;

      case "ADD_MESSAGE":
        action.allConversations[action.message.chat_id].messages.push(action.message);
        return state;

      default:
          return state;
    }
}

export default currentConversationId;