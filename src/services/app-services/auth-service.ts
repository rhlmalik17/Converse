/**
 * USER AUTHENTICATION SERVICE
 */

import { Subject, Observable } from "rxjs";
import SignIn_Route from '../../routes/Authentication/SignIn';
import LoaderService from "../app-services/LoadingBar/loader-service";
import ToastService from "../app-services/toast-service";

class AuthenticationService  {
    private authGuard: Subject<any> = new Subject<any>();

    setToken(token: string): void {
        if(!token || token.length < 1)
        return;

        localStorage.setItem("token", token);
    }

    isLoggedIn(): boolean {
        let token = localStorage.getItem("token");
        
        if(!token || token.length < 1)
        return false;
        
        return token ? true : false;
    }

    logOut() {
        //Clear the token
        localStorage.removeItem("token");

        //Broadcast to route out of the application
        this.authGuard.next({ action: "USER_LOGOUT", route: SignIn_Route.routeSignIn });

        //Show loader and toast
        LoaderService.complete();
        ToastService.showToast("success", "Logged Out Successfully.")
    }

    getToken(): string | null {
        return localStorage.getItem("token") || null;
    }

    getAuthGuard(): Observable<any> {
        return this.authGuard.asObservable();
    }
}

let AuthService = new AuthenticationService();

export default AuthService;