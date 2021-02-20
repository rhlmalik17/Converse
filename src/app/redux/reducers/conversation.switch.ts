const currentConversationDetails = (state: any = {}, action: any) => {
    switch(action.type) {
        case "SWITCH_CONVERSATION":
            state = action.conversationDetails;
            return state;
    }
}

export default currentConversationDetails;