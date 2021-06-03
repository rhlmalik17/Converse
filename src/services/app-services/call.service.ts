import { Dispatch } from "redux";

export class CallService {
    /* The call duration in seconds */
    private callTimer: number = 0;

    /* The call time interval */
    private timeInterval: NodeJS.Timeout = null as any;

    public startTimer(dispatch: Dispatch<any>, updateCallTimer: Function): void {
      if(this.timeInterval) clearInterval(this.timeInterval);

      this.timeInterval = setInterval(() => {
        this.callTimer++;
        dispatch(updateCallTimer(this.callTimerTimeStamp));
      }, 1000);
    }

    public get callTimerTimeStamp(): string {
      return "" +
      // Hours
      ("0" + Math.floor(this.callTimer / (60 * 60))).slice(-2) + ":" +
      
      // Minutes
      ("0" + Math.floor(this.callTimer / (60))).slice(-2) + ":" +

      // Seconds
      ("0" + Math.floor(this.callTimer % 60)).slice(-2);
    }
    
    public stopTimer(): void {
      this.callTimer = 0;
      clearInterval(this.timeInterval);
    }
}

let callService = new CallService();
export default callService;