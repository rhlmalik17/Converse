import LoadingBar from 'react-top-loading-bar'
import React from 'react';
import LoaderService from './loader-service';
import './loadingBar.css';
import { useEffect, useRef } from 'react';

/* Loading Bar Component */
export const LoaderBar = () => {
    const loaderReference: any = useRef(null);
    const loadingBarOptions = {
      shadow: true,
      height: 4,
      ref: loaderReference,
      transitionTime: 1000,
      className: 'loading-bar'
  }
  
  const invokeLoadingBar = () => {
      if(!loaderReference || !loaderReference.current)
      return;
  
      loaderReference.current.continuousStart(0,800);
    }
  
    const completeLoadingBarProgress = () => {
      if(!loaderReference || !loaderReference.current)
      return;
  
      loaderReference.current.complete();
    }
  
    const loaderChangeHandler = (changeType: any) => {
        switch(changeType) {
            case "start":
                invokeLoadingBar();
                break;
            case "complete":
              completeLoadingBarProgress();
                break;
            default:
                break;
        }
    }
  
    let loaderChangeSubscription = LoaderService.loaderChangeEmitter.subscribe(loaderChangeHandler);
    
    useEffect(() => {
      return () => {
          /* UNSUBSCRIBE THE SUBSCRIPTIONS */
          loaderChangeSubscription.unsubscribe();
      }
    }, [loaderChangeSubscription]);
  
    return (
      <div>
           <LoadingBar {...loadingBarOptions} />
      </div>
  )
  }