import { firebaseAuth } from "firebase.app";
import React from "react";

export const Profile = () => {
  const onLogOutClick = () => firebaseAuth.signOut();
  return (
    <div>
      Profile
      <button onClick={onLogOutClick}>Logout</button>
    </div>
  );
};
