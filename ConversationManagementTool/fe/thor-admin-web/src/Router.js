import React from "react";
import loadable from "@loadable/component";
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import Auth from "./helpers/auth";
import HelpPage from "./components/dashboard/HelpPage";
import TrainingComponent from "./components/conversation/data_set/components/TrainingComponent";
import TestingComponent from "./components/conversation/data_set/components/TestingComponent";
import DataSetDetailsComponent from "./components/conversation/data_set/components/DataSetDetailsComponent";
import LogPage from "./components/conversation/log/pages/LogPage";
import ActionPage from "./components/conversation/action/pages/ActionPage";
import LogComponent from "./components/conversation/log/components/LogComponent";
import ModelPage from "./components/model/pages/ModelPage";
import CreateModel from "./components/model/pages/CreateModel";
import PublishModel from "./components/model/pages/PublishModel";
import TestModel from "./components/model/pages/TestModel";
import ShadowMoniteringPage from "./components/conversation/shadow_monitoring/pages/shadowMoniteringPage";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";

// Code splitting using loadable components
// const Login = loadable(() => import("./components/login/Login"));
// const Dashboard = loadable(() => import("./components/dashboard/Dashboard"));

/* Router function to enable routing between the various components
 * in the project with authentication as well as authorization
 */

const Router = (props) => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/login" component={Login} />
      <PrivateRoute exact path="/home" component={Dashboard} />
      <PrivateRoute exact path="/dashboards/:bot/:username/" component={Dashboard} />
      <PrivateRoute exact path="/models/:bot/:name/:username" component={ModelPage} />
      <PrivateRoute exact path="/models/createModel/:bot/:name/create/:username" component={CreateModel} />
      <PrivateRoute exact path="/models/publishModel/:bot/:name/publish/:username" component={PublishModel} />
      <PrivateRoute exact path="/models/publishModel/:bot/:name/testModel/:username" component={TestModel} />
      <PrivateRoute exact path="/helpPage" component={HelpPage} />
      <PrivateRoute exact path="/shadowmonitering" component={ShadowMoniteringPage} />
      <PrivateRoute
        exact
        path="/conversations/data-sets/:bot/training/:username"
        component={TrainingComponent}
      />
      <PrivateRoute
        exact
        path="/conversations/data-sets/:bot/testing/:username"
        component={TestingComponent}
      />
      <PrivateRoute
        exact
        path="/conversations/data-sets/:bot/:name/details/:username"
        component={DataSetDetailsComponent}
      />
      <PrivateRoute 
      exact path="/conversations/:bot/logs/:username" 
      component={LogPage} 
    />
      <PrivateRoute 
      exact path="/conversations/:bot/actions/:username" 
      component={ActionPage} 
    />
    
    </Switch>
  </BrowserRouter>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      true ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )
    }
  />
);

export default Router;
