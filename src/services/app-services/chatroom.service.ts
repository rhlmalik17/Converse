/**
 * CHAT ROOM SERVICE
 */
import { Subject } from "rxjs";

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
 }
 
 let chatRoomService = new ChatRoomService();
 export default chatRoomService;