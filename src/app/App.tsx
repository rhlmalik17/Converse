import React from 'react';
import Home from './Home/Home';
import { ToastContainer } from 'react-toastify';
import { LoaderBar } from '../services/app-services/LoadingBar/LoadingBar';
import { Route, Switch, useHistory } from "react-router-dom";
import Authentication from './Authentication/Authentication';
import AuthService from '../services/app-services/auth-service';
import SignIn_Route from '../routes/Authentication/SignIn';
import Authentication_Route from '../routes/Authentication/Authentication';
import Home_Route from '../routes/Home/Home';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const history = useHistory();

  //Check if user is logged in
  if(AuthService.isLoggedIn()) {
    history.push(Home_Route.routeHome);
  } else {
    history.push(SignIn_Route.routeSignIn);
  }

  return (
    <div className="main__app">
        
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
          <Route path={Authentication_Route.routeAuthentication} component={Authentication} />
          <Route path={Home_Route.routeHome} component={Home} />
        </Switch>
    </div>
  );
}

export default App;
