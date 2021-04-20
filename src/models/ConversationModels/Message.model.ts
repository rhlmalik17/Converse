interface MessageDetails {
    sender: string;
    chat_id: string;
    updated_at: Date;
    body: string;
    initial_message_to?: string;
}

/* MESSAGE TYPE */
export class Message implements MessageDetails {
    public sender: string;
    public chat_id: string;
    public updated_at: Date;
    public body: string;
    public initial_message_to?: string;

    constructor(message_details?: MessageDetails) {
        this.sender = message_details?.sender || "";
        this.chat_id = message_details?.chat_id || "";
        this.updated_at = new Date(message_details?.updated_at || new Date());
        this.body = message_details?.body || "";
        this.initial_message_to = message_details?.initial_message_to || undefined;
    }
}