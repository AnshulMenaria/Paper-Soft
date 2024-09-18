import React from "react";
import "./AHeader.css";
import logo from "../../../../Assests/PaperSoft.png";

const AHeader = () => {
  return (
    <nav className="a-navbar">
      <div className="a-navbar-container">
        <div className="a-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="a-navbar-menu">
          <li className="a-navbar-item">
            <a href="/A-home" className="a-navbar-link">
              Home
            </a>
          </li>
          <li className="a-navbar-item">
            <a href="/A-letterlist" className="a-navbar-link">
              Letters
            </a>
          </li>
          <li className="a-navbar-item">
            <a href="/A-setting" className="a-navbar-link">
              Settings
            </a>
          </li>
        </ul>
        <a href="/" className="a-logout-button">
          Logout
        </a>
      </div>
    </nav>
  );
};

export default AHeader;
