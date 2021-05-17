import socketIOClient,{ Socket } from "socket.io-client";
import { environment } from "../../environment";
import { ConversationType } from "../../models/ConversationModels/ConversationSwitch.model";
import { Message, UnreadCountUpdate } from "../../models/ConversationModels/Message.model";
import { User } from "../../models/ConversationModels/User.model";
import toastService from "../app-services/toast-service";

export const SOCKET_CONSTANT_EVENTS = {
    INITIAL_MESSAGE: 'INITIAL_MESSAGE',
    CONVERSATION_MESSAGE: 'CONVERSATION_MESSAGE',
    UPDATE_INITIAL_STATE: 'UPDATE_INITIAL_STATE',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    UNREAD_COUNT_UPDATE: 'UNREAD_COUNT_UPDATE',
    IS_TYPING: 'IS_TYPING',
    GET_USER_STATUS: 'GET_USER_STATUS'
}
class SocketController {  
    public socket!: Socket;
    public userData: User = new User();
    private allConversations: ConversationType = {};
    private currentConversationId: string = "";

    connectSocket(userData: User): void {
        this.socket = socketIOClient(environment.BASE_URL, { query: { userEmail: userData.email }});
        this.socket.on(SOCKET_CONSTANT_EVENTS.UNKNOWN_ERROR, this.handleUnknownServerSideError);
    }

    set setAllConversations(allConversations: ConversationType) {
        this.allConversations = allConversations;
    }

    get getAllConversations(): ConversationType {
        return this.allConversations;
    }

    set setCurrentConversationId(currentConversationId: string) {
        this.currentConversationId = currentConversationId;
    }

    get getCurrentConversationId(): string {
        return this.currentConversationId;
    }

    /**
     * EMIT THE MESSAGE FROM CHAT
     * @param message 
     * 
    */
    emitChatMessage(message: Message): void {
      if(message.initial_message_to) {
          this.socket?.emit(SOCKET_CONSTANT_EVENTS.INITIAL_MESSAGE, message);
          return;
      }

      this.socket?.emit(SOCKET_CONSTANT_EVENTS.CONVERSATION_MESSAGE, message);
    }

    /**
     * @param eventName - Event name to be attached
     * @param callBack  - Callback function to be invoked for that event 
     * @param userData  - Optional Parameter for complex callback functions
     */
    attachEventToSocket(eventName: string, listener: (...args: any[]) => void, userData?: User): void {
        if(!this.socket || this.socket.hasListeners(eventName))
        return;

        if(!userData) {
            this.socket.on(eventName, listener);
        } else {
            this.socket.on(eventName, (data: any) => listener(data, userData));
        }
    }

    /**
     * Update the unread count of a conversation
     * @param chatId - Conversation ID to edit the unread count of
     * @param unreadCount - New Conversation Unread Count
     */
    updateUnreadCount(chatId: string, unreadCount: number, sender: string): void {
        let unreadCountUpdate: UnreadCountUpdate = { chat_id: chatId, unread_count: unreadCount, participant: sender };
        this.socket.emit(SOCKET_CONSTANT_EVENTS.UNREAD_COUNT_UPDATE, unreadCountUpdate);
    }

    /**
     * 
     * @param conversationId - Conversation ID the signal is intended for
     * @param userData - Sender's Info
     */
    sendTypingSignal(conversationId: string, sender: User): void {
        this.socket.emit(SOCKET_CONSTANT_EVENTS.IS_TYPING, { conversationId, sender });
    }

    disconnectSocket = () => {
        this.socket.disconnect();
        this.allConversations = {};
        this.userData = new User();
        this.currentConversationId = "";
    }

    handleUnknownServerSideError(error: any): void {
        toastService.showToast("error", error.message);
    }
}

export default new SocketController();