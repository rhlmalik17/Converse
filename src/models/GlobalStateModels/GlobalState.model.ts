/* The Application Global State Blueprint */

import { CallState } from "../ConversationModels/CallState.model";
import { Conversation } from "../ConversationModels/Conversation.model";
import { User } from "../ConversationModels/User.model";
import { SkeletonLoader } from "../SkeletonModels/SkeletonLoader.model";

export interface GlobalState {
    currentConversationId: string;
    sideBarMode: boolean;
    skeletonLoader: SkeletonLoader;
    allConversations: { [key: string]: Conversation };
    userData: User;
    isTyping: boolean;
    callState: CallState;
}