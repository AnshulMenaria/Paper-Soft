import React from "react";
import "./QHeader.css";
import logo from "../../../../Assests/PaperSoft.png";

const QHeader = () => {
  return (
    <nav className="q-navbar">
      <div className="q-navbar-container">
        <div className="q-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="q-navbar-menu">
          <li className="q-navbar-item">
            <a href="/Q-home" className="q-navbar-link">
              Home
            </a>
          </li>
          <li className="q-navbar-item">
            <a href="/Q-letterlist" className="q-navbar-link">
              Letters
            </a>
          </li>
          <li className="q-navbar-item">
            <a href="/Q-setting" className="q-navbar-link">
              Settings
            </a>
          </li>
        </ul>
        <a href="/" className=" q-logout-button">
          Logout
        </a>
      </div>
    </nav>
  );
};

export default QHeader;
