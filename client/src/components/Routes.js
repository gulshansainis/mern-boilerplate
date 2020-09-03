import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "../App";
import Signin from "./Signin";
import Signup from "./Signup";
import Activate from "./Activate";
import PrivateRoute from "./PrivateRoute";
import Admin from "./Admin";
import AdminRoute from "./AdminRoute";
import Forgot from "./Forgot";
import Reset from "./Reset";
import EditProfile from "./EditProfile";
import User from "./User";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/auth/activate/:token" exact component={Activate} />
        <Route path="/auth/password/forgot" exact component={Forgot} />
        <Route path="/auth/password/reset/:token" exact component={Reset} />
        <PrivateRoute path="/edit/profile" exact component={EditProfile} />
        <PrivateRoute path="/user" exact component={User} />
        <AdminRoute path="/admin" exact component={Admin} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
