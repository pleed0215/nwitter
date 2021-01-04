import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseAuth } from "firebase.app";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface IProfileText {
  displayName?: string | null;
  email?: string | null;
  photoUrl?: string | null;
}

export const AppNavigation: React.FC<IProfileText> = ({
  displayName,
  email,
  photoUrl,
}) => {
  return (
    <nav className="w-full p-4 bg-blue-400 text-white text-2xl">
      <ul className="w-full flex justify-between">
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faTwitter} />
          </Link>
        </li>
        <li>
          <Link to="/profile" className="flex items-center group">
            {photoUrl ? (
              <div
                className="w-8 h-8 rounded-full bg-cover bg-center mr-2"
                style={{ backgroundImage: `url(${photoUrl})` }}
              ></div>
            ) : (
              <FontAwesomeIcon icon={faUserAlt} className="mr-2" />
            )}
            <span className="text-sm group-hover:underline">
              {displayName}({email})
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
