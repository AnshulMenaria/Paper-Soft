import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Setting.css"; // Updated the CSS file import
import AdminHeader from "../AdminHeader/AdminHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("Access token not found.");
          return;
        }

        const response = await fetch(`http://localhost:4002/api/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data: ${
              response.status
            } ${await response.text()}`
          );
        }

        const userData = await response.json();
        setFormData({
          name: userData.name,
          email: userData.email,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Access token not found.");
        return;
      }

      const response = await fetch(`http://localhost:4002/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update user data: ${
            response.status
          } ${await response.text()}`
        );
      }

      setSuccessMessage("User data updated successfully.");
      setError("");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("Error updating user data. Please try again later.");
      setSuccessMessage("");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <AdminHeader />
      <div className="unique-form-container-settings">
        <form onSubmit={handleFormSubmit} className="unique-settings-form">
          <h1>User Settings</h1>
          <div className="unique-form-group-settings">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="unique-form-input-settings"
            />
          </div>
          <div className="unique-form-group-settings">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="unique-form-input-settings"
            />
          </div>
          <div className="unique-form-group-settings">
            <label>New Password:</label>
            <div className="unique-password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="unique-form-input-settings"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="unique-toggle-password-icon"
                onClick={toggleShowPassword}
              />
            </div>
          </div>
          {error && <div className="unique-error-settings">{error}</div>}
          {successMessage && (
            <div className="unique-success-settings">{successMessage}</div>
          )}
          <button type="submit" className="unique-settings-button">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
