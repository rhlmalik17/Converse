import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, useHistory } from "react-router-dom";
import Authentication from './Authentication/Authentication';
import AuthService from '../services/app-services/auth-service';
import * as Authentication_Route from '../routes/Authentication/Authentication';

const App = () => {
  const history = useHistory();

  //Check if user is logged in
  if(!AuthService.isLoggedIn()) {
    history.push(Authentication_Route.default.routeAuthentication);
  }

  return (
    <div className="App">
        <Switch>
          <Route exact path={Authentication_Route.default.routeAuthentication} component={Authentication} />
        </Switch>
    </div>
  );
}

export default App;
