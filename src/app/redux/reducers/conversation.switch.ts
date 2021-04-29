import { ConversationType } from "../../../models/ConversationModels/ConversationSwitch.model";

const currentConversationId = (state: string = '', action: any) => {
    switch(action.type) {
        case "SWITCH_CONVERSATION":
            return action.conversationId ? action.conversationId : state;

        default:
            return state;
    }
}

export const isTyping = (state: boolean = false, action: any): boolean => {
  switch(action.type) {
    case "SHOW_TYPING_MESSAGE": 
      return action.isTyping;

    default:
      return state;
  }
}

export const allConversations = (state: ConversationType = {}, action: any) => {
    switch (action.type) {
      case "ADD_NEW_CONVERSATION":
        return action.allConversations;

      case "UPDATE_ALL_CONVERSATIONS":
        return action.allConversations;

      default:
          return state;
    }
}

export default currentConversationId;