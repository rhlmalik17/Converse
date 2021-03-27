interface SkeletonLoaderDetails {
    mainChatScreen: boolean,
    conversationList: boolean
}

export class SkeletonLoader implements SkeletonLoaderDetails {
    mainChatScreen: boolean = false;
    conversationList: boolean = false;
}