/**
 * USER AUTHENTICATION SERVICE
 */

class AuthenticationService  {

    setToken(token: string): void {
        if(!token || token.length < 1)
        return;

        localStorage.setItem("token", token);
    }

    isLoggedIn(): boolean {
        let token = localStorage.getItem("token");
        
        if(!token || token.length < 1)
        return false;
    
        //TODO: Integrate to verify the token
        // httpClient.post(apiUrls.)
        
        return token ? true : false;
    }

    logOut() {
        //Clear the token
        localStorage.removeItem("token");
    }
}

let AuthService = new AuthenticationService();

export default AuthService;