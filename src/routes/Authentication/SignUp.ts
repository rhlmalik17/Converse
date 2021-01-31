import Authentication from "./Authentication";

export default class SignUp extends Authentication {
    /* CONCAT THE PARENT ROUTE TO THE CURRENT ONE */

    static routeSignUp: string = Authentication.routeAuthentication + "sign-up/";
}