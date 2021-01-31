import Authentication from "./Authentication";

export default class SignIn extends Authentication {
    /* CONCAT THE PARENT ROUTE TO THE CURRENT ONE */

    static routeSignIn: string = Authentication.routeAuthentication + "sign-in/";
}