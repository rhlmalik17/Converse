import { Message } from "./Message.model";
import { User } from "./User.model";

export const CONVERSATION_TYPES = {
    p_to_p: "peer-to-peer",
    p_to_m: "peer-to-many"
}

interface ConversationDetails {
    chat_id?: string;
    participants: Array<User>;
    last_message?: Message;
    conversation_type: string;
    updated_at?: Date
}

/* CONVERSATION TYPE */
export class Conversation implements ConversationDetails{
    public chat_id: string;
    public participants: Array<User>;
    public last_message: Message;
    public conversation_type: string;
    public updated_at: Date
    constructor(conversation_details: ConversationDetails, excludeParticipant?: string) {
        this.chat_id = conversation_details.chat_id || "";
        this.participants = (conversation_details.participants || [])
                            .map((user: any) => new User(user)).filter((user: User) => user.email !== (excludeParticipant || ''));
        this.last_message =  conversation_details.last_message ? new Message(conversation_details.last_message) : new Message();
        this.conversation_type = conversation_details.conversation_type || "";
        this.updated_at = new Date(conversation_details.updated_at || new Date());
    }
}