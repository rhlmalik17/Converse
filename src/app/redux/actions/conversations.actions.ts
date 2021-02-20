//Action to swtich conversation
export const switchConversation = (conversationDetails: any) => {
    return {
        type: "SWITCH_CONVERSATION",
        conversationDetails
    }
}