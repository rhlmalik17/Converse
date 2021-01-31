/***********************/
/* MAIN API SERVICE ****/
/***********************/

import axios from "axios";
import LoaderService from "../app-services/LoadingBar/loader-service"
import { BASE_URL } from "./api-urls";

const AXIOS = () => {

   //INTERCEPT REQUEST
   const requestInterceptor = (config: any) => {
    console.log(config)
    //Start the loader
    LoaderService.start();
    return config;
  };

  //INTERCEPT RESPONSE
  const responseInterceptor = (config: any) => {
    console.log(config)
    if(!config || !config.data)
    return config;

    let result = config.data;

    //Stop the loader
    LoaderService.complete();

    return result;
  };

  //HANDLE HTTP REQUEST ERROR
  const handleError = (err: any) => {
    //Stop the loader and show the error
    LoaderService.complete();

    Promise.reject(err);
  };

  const HTTP_CLIENT = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json",
               "Access-Control-Allow-Origin" : "*"  }
  });

  //Attach Interceptors
  HTTP_CLIENT.interceptors.request.use(
    requestInterceptor, handleError);
  HTTP_CLIENT.interceptors.response.use(
    responseInterceptor, handleError);
  

  return HTTP_CLIENT;
}

export default AXIOS();
