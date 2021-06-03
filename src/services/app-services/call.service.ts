import { Dispatch } from "redux";
import { CallState } from "../../models/ConversationModels/CallState.model";

export class CallService {
  /* The call duration in seconds */
  private callTimer: number = 0;

  /* The call time interval */
  private timeInterval: NodeJS.Timeout = null as any;

  public startTimer(dispatch: Dispatch<any>, updateCallTimer: Function): void {
    if (this.timeInterval) clearInterval(this.timeInterval);

    this.timeInterval = setInterval(() => {
      this.callTimer++;
      dispatch(updateCallTimer(this.callTimerTimeStamp));
    }, 1000);
  }

  public get callTimerTimeStamp(): string {
    return (
      "" +
      // Hours
      ("0" + Math.floor(this.callTimer / (60 * 60))).slice(-2) +
      ":" +
      // Minutes
      ("0" + Math.floor(this.callTimer / 60)).slice(-2) +
      ":" +
      // Seconds
      ("0" + Math.floor(this.callTimer % 60)).slice(-2)
    );
  }

  public stopTimer(): void {
    this.callTimer = 0;
    clearInterval(this.timeInterval);
  }

  /**
   * TOGGLE CALL OVERLAY
   * @param overlay_status - Show the call overlay or not
   * @param callState - The current call state
   * @param dispatch - Dispatch Redux method
   * @param updateCallState - Reducer to apply the new updates
   */
  public handleToggleCallOverlay = (overlay_status: boolean, callState: CallState, dispatch: Dispatch, updateCallState: Function) => {
    /* Hide overlay state to hide the call overlay */
    callState.call_overlay = overlay_status;
    dispatch(updateCallState(new CallState(callState)));
  };
}

let callService = new CallService();
export default callService;