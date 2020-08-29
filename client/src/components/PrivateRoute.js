import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "../utility/helpers";

const PrivateRoute = ({ Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
