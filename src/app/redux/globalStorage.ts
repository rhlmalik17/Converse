import { combineReducers, createStore } from "redux";
import sideBarMode from './reducers/layout.modes'
import currentConversationDetails from './reducers/conversation.switch'

//COMBINE ALL REDUCERS
const allReducer = combineReducers({
    currentConversationDetails,
    sideBarMode
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