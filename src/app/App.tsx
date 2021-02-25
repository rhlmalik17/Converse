import React, { useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { logOut } from './redux/actions/auth.actions';

const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  //Auth Guard Handler
  const authGuard = (order: any) => {
    switch(order.action) {
      case "USER_LOGOUT":
        history.push(order.route);
        dispatch(logOut());
        break;
    }
  }

  //Route where the auth guard demands to
  let AuthGuardSubscription = AuthService.getAuthGuard().subscribe(authGuard);

  //Check if user is logged in
  if(AuthService.isLoggedIn()) {
    history.push(Home_Route.routeHome);
  } else {
    history.push(SignIn_Route.routeSignIn);
  }

  useEffect(() => {
    return () => {
      if(AuthGuardSubscription)
      AuthGuardSubscription.unsubscribe();
    }
  }, [AuthGuardSubscription])

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
