import Routes from "../Routes"

export default class Home extends Routes {
    /* CONCAT THE PARENT ROUTE TO THE CURRENT ONE */

    static routeHome: string = Routes.baseRoute + "home/";
}