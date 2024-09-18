import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    category: "",
    subCategory: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const onFormSubmit = (ev) => {
    ev.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (
      formData.category &&
      formData.category !== "Admin" &&
      !formData.subCategory
    ) {
      newErrors.subCategory = "Sub-category is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Set default subCategory for Admin
    const finalFormData = {
      ...formData,
      subCategory:
        formData.category === "Admin" ? "Head Clerk" : formData.subCategory,
    };

    fetch("http://localhost:4002/api/register", {
      method: "POST",
      body: JSON.stringify(finalFormData),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Registration successful!"); // Show success message
        setFormData({
          name: "",
          email: "",
          password: "",
          category: "",
          subCategory: "",
        });
        navigate("/"); // Redirect to login page
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const categoryOptions = ["Admin", "Hierarchy", "Clerk"];
  const subCategoryOptions = {
    Hierarchy: ["Commanding Officer", "2IC", "Adjutant", "Quad Master"],
    Clerk: ["A", "G", "Q", "PRI", "Publication"], // Replace with actual options
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container-reg">
      <form onSubmit={onFormSubmit} className="register-form-reg">
        <div>
          <h1>Register</h1>
        </div>
        <div className="form-group-reg">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input-reg"
          />
          {errors.name && <p className="error-reg">{errors.name}</p>}
        </div>
        <div className="form-group-reg">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input-reg"
          />
          {errors.email && <p className="error-reg">{errors.email}</p>}
        </div>
        <div className="form-group-reg">
          <label>Password:</label>
          <div className="password-container-reg">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input-reg"
            />
            <span
              onClick={togglePasswordVisibility}
              className="toggle-password-icon-reg"
            >
              <i
                className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
              ></i>
            </span>
          </div>
          {errors.password && <p className="error-reg">{errors.password}</p>}
        </div>
        <div className="form-group-reg">
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-input-reg"
          >
            <option value="">Select Category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="error-reg">{errors.category}</p>}
        </div>
        {formData.category && formData.category !== "Admin" && (
          <div className="form-group-reg">
            <label>Sub-category:</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="form-input-reg"
            >
              <option value="">Select Sub-category</option>
              {subCategoryOptions[formData.category].map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
            {errors.subCategory && (
              <p className="error-reg">{errors.subCategory}</p>
            )}
          </div>
        )}
        <div>
          <input
            type="submit"
            value="Register"
            className="register-button-reg"
          />
        </div>
      </form>
    </div>
  );
};

export default Register;
