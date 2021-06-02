import { combineReducers, createStore } from "redux";
import sideBarMode from './reducers/layout.modes'
import currentConversationId, { allConversations, isTyping } from './reducers/conversation.switch'
import { skeletonLoader, getUserData, callState } from './reducers/common.reducer'

//COMBINE ALL REDUCERS
const allReducer = combineReducers({
    currentConversationId,
    sideBarMode,
    skeletonLoader,
    allConversations,
    userData: getUserData,
    isTyping,
    callState
});

const rootReducer = (state: any, action: any) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === 'USER_LOGOUT') {
      state = undefined;
    }
  
    return allReducer(state, action);
  };

const store = createStore(rootReducer);
export default store;