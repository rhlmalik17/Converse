interface SkeletonLoaderDetails {
    mainChatScreen: boolean,
    conversationList: boolean,
    messagesList: boolean
}

export class SkeletonLoader implements SkeletonLoaderDetails {
    mainChatScreen: boolean = false;
    conversationList: boolean = false;
    messagesList: boolean = false;
}