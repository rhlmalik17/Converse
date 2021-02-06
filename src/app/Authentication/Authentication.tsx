import { useState } from 'react';
import { Route, useHistory } from "react-router-dom";
import Carousal from '../utilities/Carousal/Carousal';
import CarousalDots from '../utilities/Carousal/CarousalDots';
import ConverseLogo from '../../assets/converse-logo.svg';
import * as SignIn_Route from '../../routes/Authentication/SignIn'
import * as SignUp_Route from '../../routes/Authentication/SignUp'
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import './Authentication.scss';

const Authentication = () => {
    /* COMPONENT HOOKS */
    const [authScreenType, setAuthScreenType] = useState("sign-in");
    const history = useHistory();

    const toggleAuthScreen = (screenType: string) => {
        setAuthScreenType(screenType);

        let urlToRoute = screenType === "sign-in" ? SignIn_Route.default.routeSignIn : SignUp_Route.default.routeSignUp;
        history.push(urlToRoute);
    }

    return (
            <div className={"auth__container d-flex"}>

                <div className={"auth__carousal d-flex flex-column"}>

                    <div className={"auth__carousal__parent d-flex align-items-end justify-content-center"}>
                        <div className={"auth__carousal__container"}>
                            <Carousal />
                            <CarousalDots />
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

                        <Route exact path={SignIn_Route.default.routeSignIn} component={SignIn} />
                        <Route exact path={SignUp_Route.default.routeSignUp} component={SignUp} />
                </div>
            </div>
    )
}

export default Authentication;