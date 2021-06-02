import { CallState } from "../../../models/ConversationModels/CallState.model";
import { SkeletonLoader } from "../../../models/SkeletonModels/SkeletonLoader.model";

export const getUserData = (commonState: any = {}, action: any) => {
    switch(action.type) {
        case "SET_USER_DATA":
            return action.userData;

        default:
            return commonState;
    }
}

export const skeletonLoader = (state: SkeletonLoader = new SkeletonLoader(), action: any) => {
    switch(action.type) {
        case "SHOW_SKELETON_LOADER":
            return action.showState || state;

        default:
            return state;
    }
}

/* ONGOING CALL STATE REDUCER */
export const callState = (state: CallState = new CallState(), action: { type: string }) => {
    switch(action.type) {
        case "UPDATE_CALL_STATE": 
            return state;

        default:
            return state;
    }
}