import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { theme } from "./themes/theme";
import UsersProvider from "./providers/UsersProvider";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Notifications from "./pages/AllNotifications";
import Followers from "./pages/Followers";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import ProductProvider from "./providers/ProductProvider";
import SocketProvider from "./providers/SocketProvider";
import UtilitiesProvider from "./providers/UtilitiesProvider";

function App() {
  return (
    <UsersProvider>
      <SocketProvider>
        <ProductProvider>
          <UtilitiesProvider>
            <MuiThemeProvider theme={theme}>
              <BrowserRouter>
                <Header />
                <Switch>
                  <ProtectedRoute path="/dashboard" component={Dashboard} />
                  <ProtectedRoute path="/followers" component={Followers} />
                  <ProtectedRoute path="/notifications-all" component={Notifications} />
                  <Route path="/sign-up" component={Signup} />
                  <Route path="/sign-in" component={Signin} />
                  <Route exact path="/" component={null} />
                  <Route render={() => <Redirect to="/404" />} />
                </Switch>
              </BrowserRouter>
            </MuiThemeProvider>
          </UtilitiesProvider>
        </ProductProvider>
      </SocketProvider>
    </UsersProvider>
  );
}

export default App;
