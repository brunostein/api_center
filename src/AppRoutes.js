import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Accounts from './pages/Accounts'
import Settings from './pages/Settings'
import Logs from './pages/Logs'
import PrivateRoute from './components/PrivateRoute'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/login" component={Welcome} />
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/accounts" component={Accounts} />
        <PrivateRoute exact path="/settings" component={Settings} />
        <PrivateRoute exact path="/logs" component={Logs} />
      </Switch>
    </BrowserRouter>
  );
}

export default AppRoutes;
