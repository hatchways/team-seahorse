import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { userContext as context } from "../providers/UsersProvider";

const ProtectedRoute = ({component : Component, ...rest}) => {
  const userContext = useContext(context);
  const { user, token } = userContext;

  return (
    <Route
      {...rest}
      render={props =>
        !user && !token ? (
          <Redirect to='/signin' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default ProtectedRoute;
