import { User } from "./User.model";

/**
 * ongoing_call : Flag to determine if there is any call going on currently.
 * chat_id : The conversation ID the call initiated to.
 * participants : Array containing the participants of the call.
 * call_streams: Define the outgoing streams i.e. video or audio.
 * call_overlay: Whether to display the call overlay on chat room or not.
 */
interface CallStateDetails {
  ongoing_call: boolean;
  chat_id: string;
  participants: Array<User>;
  call_streams: { video: boolean, audio: boolean };
  call_overlay: boolean;
  incoming_call: boolean;
}

export class CallState implements CallStateDetails {
    public ongoing_call: boolean = false;
    public chat_id: string = "";
    public participants: Array<User> = [];
    public call_streams: { video: boolean, audio: boolean } = { video: false, audio: false };
    public callTimerClock: string = "00:00:00";
    public call_overlay: boolean = false;
    public incoming_call: boolean = false;

    constructor(callStateOverload?: CallStateDetails) {
      this.ongoing_call = callStateOverload?.ongoing_call || false;
      this.chat_id = callStateOverload?.chat_id || "";
      this.participants = callStateOverload?.participants || [];
      this.call_streams = callStateOverload?.call_streams || { video: false, audio: false };
      this.call_overlay = callStateOverload?.call_overlay || false;
    }
}