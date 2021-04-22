/**
 *  Interceptor Options:-
 *  loader: For Sliding Loading Bar at the top
 *  toast: For displaying the notification on API response / Error
 *  token: Add Authentication token in header
 */

import { environment } from "../../environment";

//CONSTANTS
export const BASE_URL = environment.BASE_URL;

export const apiUrls: any = {
    "sign-in" : { route: "sign-in", "interceptor-options": { loader: true, successToast: true, errorToast: true } },
    "sign-up" : { route: "sign-up", "interceptor-options": { loader: true, successToast: true, errorToast: true } },
    "user-info": { route: "user-info", "interceptor-options": { loader: true, errorToast: true, token: true } },
    "upload-profile-image": { route: "upload-profile-image", "interceptor-options": { loader: true, successToast: true, errorToast: true, token: true }},
    "search-users": { route: "search-users" , "interceptor-options": { errorToast: true, token: true } },
    "initiate-conversation": { route: "initiate-conversation" , "interceptor-options": { loader: true, errorToast: true, token: true } },
    "conversations": { route: "conversations" , "interceptor-options": { loader: true, errorToast: true, token: true } },
    "messages": { route: "messages" , "interceptor-options": { loader: true, errorToast: true, token: true } },
}