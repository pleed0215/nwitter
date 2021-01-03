import { firebaseAuth } from "firebase.app";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { AppRouter } from "./Router";

function App() {
  const [loggedIn, setLoggedIn] = useState<firebase.User | null>(
    firebaseAuth.currentUser
  );

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => setLoggedIn(user));
  }, []);

  return (
    <div className="w-screen flex justify-center">
      <div className="w-full max-w-sm border border-gray-400">
        <AppRouter isLoggedIn={Boolean(loggedIn)} />
      </div>
    </div>
  );
}

export default App;
