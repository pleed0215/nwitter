import React, { useState } from "react";
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
import { firebaseAuth } from "firebase.app";
import { IProfileText } from "./App";

interface IAppRouter {
  isLoggedIn: Boolean;
  profileText: IProfileText;
  setProfileText: React.Dispatch<IProfileText>;
}

export const AppRouter: React.FC<IAppRouter> = ({
  isLoggedIn,
  profileText,
  setProfileText,
}) => {
  return (
    <Router>
      {isLoggedIn && (
        <AppNavigation
          displayName={profileText.displayName}
          email={profileText.email}
          photoUrl={profileText.photoUrl}
        />
      )}
      {isLoggedIn ? (
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/profile">
            <Profile
              setProfileText={setProfileText}
              profileText={profileText}
            />
          </Route>
          <Redirect from="*" to="/" />
        </Switch>
      ) : (
        <Switch>
          <Route exact path-="/">
            <Auth />
          </Route>
        </Switch>
      )}
    </Router>
  );
};
