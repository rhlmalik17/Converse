/**
 * USER AUTHENTICATION SERVICE
 */

class AuthenticationService {

    isLoggedIn(): boolean {
        //Check if user logged In
        return localStorage.getItem("token") ? true : false;
    }

}

let AuthService = new AuthenticationService();

export default AuthService;