import Routes from "../Routes"

export default class Authentication extends Routes {
    /* CONCAT THE PARENT ROUTE TO THE CURRENT ONE */

    static routeAuthentication: string = Routes.baseRoute + "auth/";
}