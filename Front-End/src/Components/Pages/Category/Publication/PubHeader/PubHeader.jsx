import React from "react";
import "./PubHeader.css";
import logo from "../../../../Assests/PaperSoft.png";

const PubHeader = () => {
  return (
    <nav className="pub-navbar">
      <div className="pub-navbar-container">
        <div className="pub-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="pub-navbar-menu">
          <li className="pub-navbar-item">
            <a href="/Pub-home" className="pub-navbar-link">
              Home
            </a>
          </li>
          <li className="pub-navbar-item">
            <a href="/Pub-letterlist" className="pub-navbar-link">
              Letters
            </a>
          </li>
          <li className="pub-navbar-item">
            <a href="/Pub-setting" className="pub-navbar-link">
              Settings
            </a>
          </li>
        </ul>
        <a href="/" className="pub-logout-button">
          Logout
        </a>
      </div>
    </nav>
  );
};

export default PubHeader;
