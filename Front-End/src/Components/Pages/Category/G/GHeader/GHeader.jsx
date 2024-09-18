import React from "react";
import "./GHeader.css";
import logo from "../../../../Assests/PaperSoft.png";

const GHeader = () => {
  return (
    <nav className="g-navbar">
      <div className="g-navbar-container">
        <div className="g-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="g-navbar-menu">
          <li className="g-navbar-item">
            <a href="/G-home" className="g-navbar-link">
              Home
            </a>
          </li>
          <li className="g-navbar-item">
            <a href="/G-letterlist" className="g-navbar-link">
              Letters
            </a>
          </li>
          <li className="g-navbar-item">
            <a href="/G-setting" className="g-navbar-link">
              Settings
            </a>
          </li>
        </ul>
        <a href="/" className="g-logout-button">
          Logout
        </a>
      </div>
    </nav>
  );
};

export default GHeader;
