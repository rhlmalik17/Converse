
/* USER TYPE */
export class User {
    public first_name: string;
    public last_name: string;
    public profile_img: string;
    public email: string;

    constructor(user_details: any) {
        this.first_name = user_details.first_name || "";
        this.last_name = user_details.last_name || "";
        this.profile_img = user_details.profile_img || "";
        this.email = user_details.email || "";
    }
}

/* MESSAGE TYPE */
export class Message {
    public sender: string;
    public chat_id: string;
    public updated_at: Date;
    public body: string;

    constructor(message_details: any) {
        this.sender = message_details.sender || "";
        this.chat_id = message_details.chat_id || "";
        this.updated_at = message_details.updated_at || new Date();
        this.body = message_details.body || "";
    }
}

/* CONVERSATION TYPE */
export class Conversation {
    public chat_id: string;
    public participants: Array<User>;
    public last_message: Message;

    constructor(conversation_details: any) {
        this.chat_id = conversation_details.chat_id || "";
        this.participants = (conversation_details.participants || [])
                            .map((user: any) => new User(user));
        this.last_message = new Message(conversation_details.last_message);
    }
}

/* A CONVERSATION TYPE SWITCH */
export class ConversationSwitch {
    public conversationType: string = "";
    public conversations: Array<Conversation> = new Array<Conversation>();

    constructor(conversation_type: string, conversations?: Array<any>) {
        this.conversationType = conversation_type;
        this.conversations = (conversations || [])
                            .map((conversation: any) => new Conversation(conversation));
    }

    //Set Conversations explicitly
    public setConversations(conversations: Array<any>): void {
        this.conversations = (conversations || [])
        .map((conversation: any) => new Conversation(conversation));
    }
}
