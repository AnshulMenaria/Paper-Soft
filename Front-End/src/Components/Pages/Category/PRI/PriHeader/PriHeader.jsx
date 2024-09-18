import React from "react";
import "./PriHeader.css";
import logo from "../../../../Assests/PaperSoft.png";

const PriHeader = () => {
  return (
    <nav className="pri-navbar">
      <div className="pri-navbar-container">
        <div className="pri-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="pri-navbar-menu">
          <li className="pri-navbar-item">
            <a href="/Pri-home" className="pri-navbar-link">
              Home
            </a>
          </li>
          <li className="pri-navbar-item">
            <a href="/Pri-letterlist" className="pri-navbar-link">
              Letters
            </a>
          </li>
          <li className="pri-navbar-item">
            <a href="/Pri-setting" className="pri-navbar-link">
              Settings
            </a>
          </li>
        </ul>
        <a href="/" className="pri-logout-button">
          Logout
        </a>
      </div>
    </nav>
  );
};

export default PriHeader;
