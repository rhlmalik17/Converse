import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, useHistory } from "react-router-dom";
import Authentication from './Authentication/Authentication';
import AuthService from '../services/app-services/auth-service';
import SignIn_Route from '../routes/Authentication/SignIn';
import * as Authentication_Route from '../routes/Authentication/Authentication';

const App = () => {
  const history = useHistory();

  //Check if user is logged in
  if(!AuthService.isLoggedIn()) {
    history.push(SignIn_Route.routeSignIn);
  }

  return (
    <div className="main__container">
        <Switch>
          <Route path={Authentication_Route.default.routeAuthentication} component={Authentication} />
        </Switch>
    </div>
  );
}

export default App;
