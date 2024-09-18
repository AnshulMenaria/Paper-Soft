import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PriSetting.css"; 
import PriHeader from "../PriHeader/PriHeader";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PriSetting = () => {
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

      // Clear tokens from local storage and redirect to login page
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/"); // Redirect to your login page path
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
      <PriHeader />
      <div className="pri-form-container">
        <form onSubmit={handleFormSubmit} className="pri-settings-form">
          <div>
            <h1>User Settings</h1>
          </div>
          <div className="pri-form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="pri-form-input"
            />
          </div>
          <div className="pri-form-group">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="pri-form-input"
            />
          </div>
          <div className="pri-form-group">
            <label>New Password:</label>
            <div className="pri-password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pri-form-input"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="pri-toggle-password-icon"
                onClick={toggleShowPassword}
              />
            </div>
          </div>
          {error && <div className="pri-error">{error}</div>}
          {successMessage && (
            <div className="pri-success">{successMessage}</div>
          )}
          <div className="pri-form-group">
            <button type="submit" className="pri-settings-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriSetting;
