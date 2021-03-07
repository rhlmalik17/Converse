/**
 *  Interceptor Options:-
 *  slidingLoader: For Sliding Loading Bar at the top
 *  toast: For displaying the notification on API response / Error
 *  token: Add Authentication token in header
 */

import { environment } from "../../environment";

//CONSTANTS
export const BASE_URL = environment.BASE_URL;

export const apiUrls: any = {
    "sign-in" : { route: "sign-in", "interceptor-options": { loader: true, toast: true } },
    "sign-up" : { route: "sign-up", "interceptor-options": { loader: true, toast: true } },
    "verify-token": { route: "verify-token", "interceptor-options": { loader: true, toast: true, token: true } }
}