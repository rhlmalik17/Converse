import { User } from "./User.model";

/**
 * ongoing_call : Flag to determine if there is any call going on currently.
 * chat_id : The conversation ID the call initiated to
 * outgoing_call_to : Array containing the participants of the call
 */
interface CallStateDetails {
  ongoing_call: boolean;
  chat_id: string;
  outgoing_call_to: Array<User>
}

export class CallState implements CallStateDetails {
    public ongoing_call: boolean = false;
    public chat_id: string = "";
    outgoing_call_to: Array<User> = [];
}
