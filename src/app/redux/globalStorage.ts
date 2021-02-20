import { combineReducers, createStore } from "redux";
import currentLayoutMode from './reducers/layout.modes'
import currentConversationDetails from './reducers/conversation.switch'

//COMBINE ALL REDUCERS
const allReducers = combineReducers({
    currentConversationDetails,
    currentLayoutMode
});

const store = createStore(allReducers);
export default store;