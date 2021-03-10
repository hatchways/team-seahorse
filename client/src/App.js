import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import { theme } from "./themes/theme";

import "./App.css";
import Dashboard from "./pages/Dashboard";
import AuthModal from "./components/AuthModal";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <AuthModal />
      <BrowserRouter>
        <Route exact path="/" component={null} />
        <Route path="/dashboard" component={Dashboard} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
