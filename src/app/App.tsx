import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, useHistory } from "react-router-dom";
import Authentication from './Authentication/Authentication';
import AuthService from '../services/app-services/auth-service';
import SignIn_Route from '../routes/Authentication/SignIn';
import { LoaderBar } from '../services/app-services/LoadingBar/LoadingBar'
import * as Authentication_Route from '../routes/Authentication/Authentication';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const history = useHistory();

  //Check if user is logged in
  if(!AuthService.isLoggedIn()) {
    history.push(SignIn_Route.routeSignIn);
  }

  return (
    <div className="main__container">
        
        {/* Place Loading Bar */}
        <LoaderBar />
        
        {/* Place Toast Container */}
        <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />

        <Switch>
          <Route path={Authentication_Route.default.routeAuthentication} component={Authentication} />
        </Switch>
    </div>
  );
}

export default App;
