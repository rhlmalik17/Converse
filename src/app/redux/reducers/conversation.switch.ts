const currentConversationDetails = (state: any = {}, action: any) => {
    switch(action.type) {
        case "SWITCH_CONVERSATION":
            return action.conversationDetails ? action.conversationDetails : state;

        default:
            return state;
    }
}

export default currentConversationDetails;