import { User } from "./User.model";

/**
 * ongoing_call : Flag to determine if there is any call going on currently.
 * chat_id : The conversation ID the call initiated to.
 * outgoing_call_to : Array containing the participants of the call.
 * call_streams: Define the outgoing streams i.e. video or audio
 */
interface CallStateDetails {
  ongoing_call: boolean;
  chat_id: string;
  outgoing_call_to: Array<User>;
  call_streams: { video: boolean, audio: boolean }
}

export class CallState implements CallStateDetails {
    public ongoing_call: boolean = false;
    public chat_id: string = "";
    public outgoing_call_to: Array<User> = [];
    public call_streams: { video: boolean, audio: boolean } = { video: false, audio: false };
    public callTimerClock: string = "00:00:00";

    constructor(callStateOverload?: CallStateDetails) {
      this.ongoing_call = callStateOverload?.ongoing_call || false;
      this.chat_id = callStateOverload?.chat_id || "";
      this.outgoing_call_to = callStateOverload?.outgoing_call_to || [];
      this.call_streams = callStateOverload?.call_streams || { video: false, audio: false };
    }
}