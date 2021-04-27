/***********************/
/* MAIN API SERVICE ****/
/***********************/

import axios from "axios";
import AuthService from "../app-services/auth-service";
import LoaderService from "../app-services/LoadingBar/loader-service";
import ToastService from "../app-services/toast-service";
import { apiUrls, BASE_URL } from "./api-urls";

const requestQueue = new Array<any>();

const AXIOS = () => {
  //INTERCEPT REQUEST
  const requestInterceptor = (config: any) => {
    let requestOptions: any = apiUrls[config.url]["interceptor-options"];

    //Show the loader if required
    if(requestOptions.loader)
    LoaderService.start();

    //Attach token if required
    if(requestOptions.token && AuthService.getToken()) {
      config.headers = {
        ...config.headers,
        Authorization: AuthService.getToken()
      }
    }

    //Push the request to the queue
    requestQueue.push(1);
    return config;
  };

  //INTERCEPT RESPONSE
  const responseInterceptor = (response: any) => {
    if (!response || !response.data) return response;

    let requestOptions: any = apiUrls[response.config.url]["interceptor-options"];

    let result = response.data;
    requestQueue.pop();
    if (requestQueue.length === 0) {
      LoaderService.complete();
    }

    if(!result.success && requestOptions.errorToast) {
      ToastService.showToast("error", result.message);
    } else if(result.success && result.message && requestOptions.successToast) {
      ToastService.showToast("success", result.message);
    }

    if(result.message === "Unauthorized" && result.code === 406 && AuthService.isLoggedIn()) {
      AuthService.logOut();
    }

    return result;
  };

  //HANDLE HTTP REQUEST ERROR
  const handleError = (err: Error) => {
    requestQueue.pop();
    if (requestQueue.length === 0) {
      //Stop the loader
      LoaderService.complete();
    }

    //Show Error toast
    ToastService.showToast("error", err.message);

    Promise.reject(err);
  };

  const HTTP_CLIENT = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  //Attach Interceptors
  HTTP_CLIENT.interceptors.request.use(requestInterceptor, handleError);
  HTTP_CLIENT.interceptors.response.use(responseInterceptor, handleError);

  return HTTP_CLIENT;
};

export default AXIOS();
