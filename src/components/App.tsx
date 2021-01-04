import { firebaseAuth } from "firebase.app";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { AppRouter } from "./Router";

export interface IProfileText {
  displayName?: string | null;
  email?: string | null;
  photoUrl?: string | null;
}

function App() {
  const [loggedIn, setLoggedIn] = useState<firebase.User | null>(
    firebaseAuth.currentUser
  );
  const [profileText, setProfileText] = useState<IProfileText>({
    displayName: firebaseAuth.currentUser?.displayName,
    email: firebaseAuth.currentUser?.email,
  });

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      setLoggedIn(user);
      setProfileText({
        displayName: user?.displayName,
        email: user?.email,
        photoUrl: user?.photoURL,
      });
    });
  }, []);

  return (
    <div className="w-screen flex justify-center">
      <div className="w-full min-w-min max-w-screen-sm border border-gray-400">
        <AppRouter
          profileText={profileText}
          setProfileText={setProfileText}
          isLoggedIn={Boolean(loggedIn)}
        />
      </div>
    </div>
  );
}

export default App;
