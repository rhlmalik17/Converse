/***********************/
/* MAIN API SERVICE ****/
/***********************/

import axios from "axios";
import LoaderService from "../app-services/LoadingBar/loader-service";
import ToastService from "../app-services/toast-service";
import { BASE_URL } from "./api-urls";

const requestQueue = new Array<any>();

const AXIOS = () => {
  //INTERCEPT REQUEST
  const requestInterceptor = (config: any) => {
    console.log(config);
    //Start the loader
    LoaderService.start();
    requestQueue.push(1);
    return config;
  };

  //INTERCEPT RESPONSE
  const responseInterceptor = (config: any) => {
    if (!config || !config.data) return config;

    let result = config.data;
    requestQueue.pop();
    if (requestQueue.length === 0) {
      //Stop the loader
      LoaderService.complete();
    }

    if(!result.success) {
      //Show Error toast
      ToastService.showToast("error", result.message);
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
