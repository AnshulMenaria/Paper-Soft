import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ASetting.css"; // Import the CSS file
import AHeader from "../AHeader/AHeader";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ASetting = () => {
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
      <AHeader />
      <div className="a-form-container">
        <form onSubmit={handleFormSubmit} className="a-settings-form">
          <div>
            <h1>User Settings</h1>
          </div>
          <div className="a-form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="a-form-input"
            />
          </div>
          <div className="a-form-group">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="a-form-input"
            />
          </div>
          <div className="a-form-group">
            <label>New Password:</label>
            <div className="a-password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="a-form-input"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="a-toggle-password-icon"
                onClick={toggleShowPassword}
              />
            </div>
          </div>
          {error && <div className="a-error">{error}</div>}
          {successMessage && <div className="a-success">{successMessage}</div>}
          <div className="a-form-group">
            <button type="submit" className="a-settings-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ASetting;
