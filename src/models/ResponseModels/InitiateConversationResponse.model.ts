import { Conversation } from "../ConversationModels/Conversation.model";

interface InitiateConversationResponseDetails {
    code: number;
    existing_conversation: Array<Conversation>;
}

export class InitiateConversationResponse implements InitiateConversationResponseDetails {
    code: number;
    existing_conversation: Array<Conversation>;
    constructor(response: InitiateConversationResponseDetails) {
        this.code = response?.code || 0;
        this.existing_conversation = response.existing_conversation.map((value: any) => new Conversation(value)) || [];
    }
}