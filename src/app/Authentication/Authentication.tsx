import { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import Carousal from '../utilities/Carousal/Carousal';
import ConverseLogo from '../../assets/converse-logo.svg';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import * as SignIn_Route from '../../routes/Authentication/SignIn'
import * as SignUp_Route from '../../routes/Authentication/SignUp'
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import './Authentication.scss';
import { Subject } from 'rxjs';

export const externalAuthScreenController: Subject<string> = new Subject<string>();

const Authentication = () => {
    /* COMPONENT HOOKS */
    const [authScreenType, setAuthScreenType] = useState("sign-in");
    const currentLocation = useLocation();
    const history = useHistory();

    /* COMPONENT SUBSCRIPTION */
    const toggleScreenSubscription = externalAuthScreenController.subscribe((screenType: string) => toggleAuthScreen(screenType));
 
    const toggleAuthScreen = (screenType: string) => {
        if(screenType !== "sign-in" && screenType !== "sign-up")
        return;

        setAuthScreenType(screenType);

        let urlToRoute = screenType === "sign-in" ? SignIn_Route.default.routeSignIn : SignUp_Route.default.routeSignUp;
        history.push(urlToRoute);
    }

    useEffect(() => {
        return () => {
            //Component cleanup
            if(toggleScreenSubscription)
            toggleScreenSubscription.unsubscribe();
        }
    },[toggleScreenSubscription]);

    return (
            <div className={"auth__container main__container d-flex"}>

                <div className={"auth__carousal d-flex flex-column"}>

                    <div className={"auth__carousal__parent d-flex align-items-end justify-content-center"}>
                        <div className={"auth__carousal__container"}>
                            <Carousal />
                        </div>
                    </div>
                    <div className="auth__heading__parent d-flex flex-column justify-content-center">
                        <h2 className="auth__heading p-0">Welcome to <span>Converse</span></h2>
                        <span className="auth__subHeading">Connect, talk and <span>Converse.</span></span>
                    </div>

                </div>

                <div className="auth__forms">
                    <div className="auth__logo d-flex justify-content-center">
                        <img src={ConverseLogo} alt="Converse" />
                    </div>

                    <div className="auth__switch position-relative">
                        <div className={"switch cursor-pointer" + ((authScreenType === 'sign-up') ? " toggle__auth__switch" : "")}></div>
                        <div className="switch__options">
                                <span onClick={() => toggleAuthScreen("sign-in")}>Sign In</span>
                                <span onClick={() => toggleAuthScreen("sign-up")}>Sign Up</span>
                        </div>
                    </div>
                <TransitionGroup>
                    <CSSTransition key={currentLocation.key} classNames="fade" timeout={500} >
                        <Switch>
                        <Route exact path={SignIn_Route.default.routeSignIn} component={SignIn} />
                        <Route exact path={SignUp_Route.default.routeSignUp} component={SignUp} />
                    </Switch>
                    </CSSTransition>
                    
                </TransitionGroup>
                
                        
                </div>
            </div>
    )
}

export default Authentication;