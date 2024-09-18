import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the specific field error
      general: "", // Clear general errors
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const onFormSubmit = async (ev) => {
    ev.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://172.20.10.2:4002/api/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.success) {
        // Store tokens and user details in local storage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        setIsLoading(false);
        setFormData({ email: "", password: "" });
        setErrors({});

        // Redirect based on user category and sub-category
        const { category, subCategory } = data.user;
        localStorage.setItem("userRole", category);
        localStorage.setItem("subCategory", subCategory);

        if (category === "Admin") {
          navigate("/adminhome");
        } else if (category === "Hierarchy") {
          navigate("/hierarchy-home");
        } else if (category === "Clerk") {
          if (subCategory === "A") {
            navigate("/A-home");
          } else if (subCategory === "G") {
            navigate("/G-home");
          } else if (subCategory === "Q") {
            navigate("/Q-home");
          } else if (subCategory === "PRI") {
            navigate("/Pri-home");
          } else if (subCategory === "Publication") {
            navigate("/Pub-home");
          } else {
            setErrors({ general: "Sub-category is required for Clerk" });
          }
        }
      } else {
        setErrors({
          general: data.msg || "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({
        general: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container-log">
      <form onSubmit={onFormSubmit} className="login-form-log">
        <div>
          <h1>Login</h1>
        </div>
        <div className="form-group-log">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input-log"
          />
          {errors.email && <span className="error-log">{errors.email}</span>}
        </div>
        <div className="form-group-log">
          <label>Password:</label>
          <div className="password-container-log">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input-log"
            />
            <span
              onClick={togglePasswordVisibility}
              className="toggle-password-icon-log"
            >
              <i
                className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
              ></i>
            </span>
          </div>
          {errors.password && (
            <span className="error-log">{errors.password}</span>
          )}
        </div>
        {errors.general && <div className="error-log">{errors.general}</div>}
        <div className="form-group-log">
          <button type="submit" className="login-button-log">
            {isLoading ? "Loading..." : "Login"}
          </button>
        </div>
        <div className="form-group-log">
          <center>
            <p>Don't have an Account?</p>
          </center>
          <a href="/register" className="register-link-log">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
