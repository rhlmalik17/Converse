import { CallState } from "../../../models/ConversationModels/CallState.model";
import { User } from "../../../models/ConversationModels/User.model";
import { SkeletonLoader } from "../../../models/SkeletonModels/SkeletonLoader.model";
import { invokeIncomingCall } from "../actions/conversations.actions";

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
interface CallStateReducerAction {
    type: string;
    callState?: CallState;
    timer?: string;
    invokeIncomingCall?: boolean;
    caller?: User
}

export const callState = (state: CallState = new CallState(), action: CallStateReducerAction) => {
    switch(action.type) {
        case "UPDATE_CALL_STATE": 
            return action.callState;

        case "UPDATE_CALL_TIMER":
            state.callTimerClock = action.timer || state.callTimerClock;
            return {...state};

        case "INVOKE_INCOMING_CALL":
            return {...state, incoming_call: invokeIncomingCall, participants: [action.caller || new User()] };

        default:
            return state;
    }
}