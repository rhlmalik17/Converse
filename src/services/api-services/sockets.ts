import socketIOClient,{ Socket } from "socket.io-client";
import { environment } from "../../environment";

class SocketController {  
    public socket: Socket | undefined;
    connectSocket(): void {
        this.socket = socketIOClient(environment.BASE_URL);
    }

    
}

export default new SocketController();