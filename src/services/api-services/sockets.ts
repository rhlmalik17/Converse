import socketIOClient,{ Socket } from "socket.io-client";
import { environment } from "../../environment";
import { ConversationType } from "../../models/ConversationModels/ConversationSwitch.model";
import { Message } from "../../models/ConversationModels/Message.model";
import { User } from "../../models/ConversationModels/User.model";
import toastService from "../app-services/toast-service";

export const SOCKET_CONSTANT_EVENTS = {
    INITIAL_MESSAGE: 'INITIAL_MESSAGE',
    CONVERSATION_MESSAGE: 'CONVERSATION_MESSAGE',
    UPDATE_INITIAL_STATE: 'UPDATE_INITIAL_STATE',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

class SocketController {  
    public socket: Socket;
    private allConversations: ConversationType = {};

    constructor() {
        this.socket = socketIOClient(environment.BASE_URL);
    }

    connectSocket(): void {
        this.socket.on(SOCKET_CONSTANT_EVENTS.UNKNOWN_ERROR, this.handleUnknownServerSideError);
    }

    set setAllConversations(allConversations: ConversationType) {
        this.allConversations = allConversations;
    }

    get getAllConversations(): ConversationType {
        return this.allConversations;
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
        if(this.socket.hasListeners(eventName))
        return;

        if(!userData) {
            this.socket.on(eventName, listener);
        } else {
            this.socket.on(eventName, (data: any) => listener(data, userData));
        }
    }

    handleUnknownServerSideError(error: any): void {
        toastService.showToast("error", error.message);
    }
}

export default new SocketController();