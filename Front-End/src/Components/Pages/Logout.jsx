import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any stored user information (e.g., tokens, user data)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to the login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="logout-container">
      <h3>Logging out...</h3>
    </div>
  );
};

export default Logout;
