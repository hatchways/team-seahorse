import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import { theme } from "./themes/theme";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import AuthModal from "./components/AuthModal";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route exact path="/" component={null} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
