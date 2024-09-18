import React from "react";
import { Link } from "react-router-dom";
import "./HEHeader.css";
import Logo from "../../../Assests/PaperSoft.png";

const HEHeader = () => {
  return (
    <nav className="hie-navbar">
      <div className="hie-navbar-container">
        <div className="hie-logo">
          <img src={Logo} alt="Logo" />
        </div>

        <ul className="hie-navbar-menu">
          <li className="hie-navbar-item">
            <a href="/hierarchy-home" className="hie-navbar-link">
              Home
            </a>
          </li>
          <li className="hie-navbar-item">
            <a href="/he-letterlist" className="hie-navbar-link">
              Letters
            </a>
          </li>
          <li className="hie-navbar-item">
            <a href="/he-setting" className="hie-navbar-link">
              Settings
            </a>
          </li>
        </ul>
        <a href="/" className="hie-logout-button">
          Logout
        </a>
      </div>
    </nav>
  );
};

export default HEHeader;
