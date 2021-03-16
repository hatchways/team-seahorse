import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { theme } from "./themes/theme";
import UsersProvider from "./providers/UsersProvider";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

function App() {
  return (
    <UsersProvider>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Header />
          <Switch>
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Route exact path="/" component={null} />
            <Route render={() => <Redirect to="/404" />} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </UsersProvider>
  );
}

export default App;
