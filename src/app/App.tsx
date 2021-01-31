import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Authentication from './Authentication/Authentication';
import * as Authentication_Route from '../routes/Authentication/Authentication';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path={Authentication_Route.default.routeAuthentication} component={Authentication} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
