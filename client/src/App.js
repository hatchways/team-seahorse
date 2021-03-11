import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import { theme } from "./themes/theme";
import UsersProvider from "./providers/UsersProvider";

import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <UsersProvider>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Route exact path="/" component={null} />
          <Route path="/dashboard" component={Dashboard} />
        </BrowserRouter>
      </MuiThemeProvider>
    </UsersProvider>
  );
}

export default App;
