import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Auth } from "../routes/auth";
import { Home } from "../routes/home";
import firebase from "firebase";
import { AppNavigation } from "./Navigation";
import { Profile } from "routes/profile";

interface IAppRouter {
  isLoggedIn: Boolean;
}

export const AppRouter: React.FC<IAppRouter> = ({ isLoggedIn }) => {
  return (
    <Router>
      {isLoggedIn && <AppNavigation />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Redirect from="*" to="/" />
          </>
        ) : (
          <Route exact path-="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  );
};
