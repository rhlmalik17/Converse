import { Conversation } from "./Conversation.model";

/* A CONVERSATION TYPE SWITCH */
export class ConversationSwitch {
    public conversationType: string = "";
    public conversations: Array<Conversation> = new Array<Conversation>();

    constructor(conversation_type: string, conversations?: Array<Conversation>, excludeParticipant?: string) {
        this.conversationType = conversation_type;
        this.conversations = (conversations || [])
                            .map((conversation: any) => new Conversation(conversation, excludeParticipant));
    }

    //Set Conversations explicitly
    public setConversations(conversations: Array<any>): void {
        this.conversations = (conversations || [])
        .map((conversation: any) => new Conversation(conversation));
    }
}
