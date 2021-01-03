import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Auth } from "../routes/auth";
import { Home } from "../routes/home";
import firebase from "firebase";

interface IAppRouter {
  isLoggedIn: Boolean;
}

export const AppRouter: React.FC<IAppRouter> = ({ isLoggedIn }) => {
  return (
    <Router>
      <Switch>
        {isLoggedIn ? (
          <Route exact path="/">
            <Home />
          </Route>
        ) : (
          <Route exact path-="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  );
};
