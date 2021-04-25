/**
 * CHAT ROOM SERVICE
 */
import { Subject } from "rxjs";
import { ConversationType } from "../../models/ConversationModels/ConversationSwitch.model";
import { Message } from "../../models/ConversationModels/Message.model";

export const chatRoomEvents = {
    SCROLL_TO_BOTTOM: 'SCROLL_TO_BOTTOM'
}

export type ChatRoomUpdate = {
    mode: string;
    data?: any
}

 class ChatRoomService  {
    public chatRoomBroadCaster: Subject<ChatRoomUpdate> = new Subject<ChatRoomUpdate>();

    /**
     * Send the subscribers the update to invoke some logic on scroll to bottom event
     * Update from the user to scroll the room to bottom
     */
    scrollChatRoomToBottom(): void {
        let update: ChatRoomUpdate = { mode: chatRoomEvents.SCROLL_TO_BOTTOM };
        this.chatRoomBroadCaster.next(update);
    }

    /**
     * Push new messages to conversation
     * @param message - Message to be pushed
     * @param allConversations - All Conversation Object
     * @param callBackDispatch - Redux Dispatch Function
     * @param callBackAction - Redux Action Function
     */
    pushMessageToConversation(message: Message, allConversations: ConversationType, currentConversationId: String,
                              callBackDispatch: Function, callBackAction: Function): void {
        allConversations[message.chat_id].last_message = message;
        allConversations[message.chat_id].updated_at = message.updated_at;     
        
        if(currentConversationId !== message.chat_id) {
            allConversations[message.chat_id].unreadMessages.push(message);
        } else {
            allConversations[message.chat_id].messages.push(message);
        }

        callBackDispatch(callBackAction({...allConversations}));
    }
 }
 
 let chatRoomService = new ChatRoomService();
 export default chatRoomService;