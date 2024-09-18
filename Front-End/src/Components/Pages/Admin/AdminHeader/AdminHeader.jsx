import React from "react";
import "./AdminHeader.css";
import logo from "../../../Assests/PaperSoft.png";

const AdminHeader = () => {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="admin-navbar-menu">
          <li className="admin-navbar-item">
            <a href="/adminhome" className="admin-navbar-link">
              Home
            </a>
          </li>
          <li className="admin-navbar-item">
            <a href="/create-letter" className="admin-navbar-link">
              Create Letters
            </a>
          </li>
          <li className="admin-navbar-item">
            <a href="/letterlist" className="admin-navbar-link">
              Letters
            </a>
          </li>
          <li className="admin-navbar-item">
            <a href="/settings" className="admin-navbar-link">
              Settings
            </a>
          </li>
        </ul>
        <a href="/" className="admin-logout-button">
          Logout
        </a>
      </div>
    </nav>
  );
};

export default AdminHeader;
