import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

export const AppNavigation = () => {
  return (
    <nav className="w-full max-w-sm p-4 bg-blue-400 text-white text-2xl">
      <ul className="w-full flex justify-between">
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faTwitter} />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <FontAwesomeIcon icon={faUserAlt} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};
