import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { theme } from "./themes/theme";
import UsersProvider from "./providers/UsersProvider";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Followers from "./pages/Followers";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import ProductProvider from "./providers/ProductProvider";
import SocketProvider from "./providers/SocketProvider";
import PublicLists from "./pages/PublicLists";

function App() {
  return (
    <UsersProvider>
      <SocketProvider>
        <ProductProvider>
          <MuiThemeProvider theme={theme}>
            <BrowserRouter>
              <Header />
              <Switch>
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path="/followers" component={Followers} />
                <Route path="/public-lists/:userId" component={PublicLists} />
                <Route path="/sign-up" component={Signup} />
                <Route path="/sign-in" component={Signin} />
                <Route exact path="/" component={null} />
                <Route render={() => <Redirect to="/404" />} />
              </Switch>
            </BrowserRouter>
          </MuiThemeProvider>
        </ProductProvider>
      </SocketProvider>
    </UsersProvider>
  );
}

export default App;
