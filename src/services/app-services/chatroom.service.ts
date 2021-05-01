/**
 * CHAT ROOM SERVICE
 */
import { Subject } from "rxjs";
import { ConversationType } from "../../models/ConversationModels/ConversationSwitch.model";
import { Message } from "../../models/ConversationModels/Message.model";
import { User } from "../../models/ConversationModels/User.model";
import SocketController from '../../services/api-services/sockets'

export const chatRoomEvents = {
    SCROLL_TO_BOTTOM: 'SCROLL_TO_BOTTOM'
}

export type ChatRoomUpdate = {
    mode: string;
    data?: any
}

 class ChatRoomService  {
    public isTypingMessageQueue: Array<number> = new Array<number>();
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
                              callBackDispatch: Function, callBackAction: Function, userData: User): void {
        allConversations[message.chat_id].last_message = message;
        allConversations[message.chat_id].updated_at = message.updated_at;     
        
        if(currentConversationId !== message.chat_id) {
            if(allConversations[message.chat_id].conversationState[userData.email]) {
                allConversations[message.chat_id].conversationState[userData.email].unread_count++;
            } else {
                allConversations[message.chat_id].conversationState[userData.email] = { unread_count: 1 };
            }

            SocketController.updateUnreadCount(message.chat_id, allConversations[message.chat_id].conversationState[userData.email].unread_count, userData.email);
        } else {
            allConversations[message.chat_id].messages.push(message);
        }

        this.playAudioOnMessage(message, userData, currentConversationId);
        callBackDispatch(callBackAction({...allConversations}));
    }

    playAudioOnMessage(message: Message, userData: User,currentConversationId: String): void {
        if(message.chat_id !== currentConversationId) return;

        let { sender  } = message;
        let { email } = userData;

        let audioSource = (sender === email) ? "/send-message-sound.mp3" : "/receive-message-sound.mp3";

        let audio = new Audio(audioSource);
        audio.crossOrigin = 'anonymous';
        audio.play();
    }

    isInitialConversation(allConversations: ConversationType, currentConversationId: string) {
        if(!allConversations || !allConversations[currentConversationId]) return true;
        return (allConversations[currentConversationId].participants[0]?.email 
                === currentConversationId);
    }
 }
 
 let chatRoomService = new ChatRoomService();
 export default chatRoomService;