import React, { useEffect, useState } from "react";
import "./CreateLetter.css";
import Footer from "../../Footer/Footer";
import AdminHeader from "../AdminHeader/AdminHeader";
import API_BASE_URL from "../../../context/APIBASEURL";

const CreateLetter = () => {
  const [formData, setFormData] = useState({
    title: "",
    dispatchId: "",
    description: "",
    letters: null,
    category: "", // Added category to formData
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`) // Correct endpoint for categories
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error); // Improved error handling
      });
  }, []);

  const handleletters = (ev) => {
    if (ev.target.files) {
      setFormData({
        ...formData,
        letters: ev.target.files[0],
      });
    }
  };

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onFormSubmit = (ev) => {
    ev.preventDefault();
    if (
      formData.title &&
      formData.dispatchId &&
      formData.description &&
      formData.category &&
      formData.letters
    ) {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("dispatchId", formData.dispatchId);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("letters", formData.letters);

      fetch(`${API_BASE_URL}/letter`, {
        method: "POST",
        body: form,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Upload response:", data);
          window.alert("Letter is successfully Uploaded!"); // Alert on success
          window.location.reload(); // Refresh the page
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          window.alert("Failed to submit the form. Please try again."); // Alert on error
        });
    } else {
      window.alert("Please fill out all fields."); // Alert on validation failure
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="create-letter-super-container">
        <form onSubmit={onFormSubmit} className="create-letter-form-container">
          <div className="create-letter-form-title">
            <h3>Upload Letter</h3>
          </div>
          <div>
            <div className="create-letter-form-group">
              <label className="create-letter-form-label">Title:</label>{" "}
              <input
                type="text"
                name="title"
                className="create-letter-input-text"
                onChange={handleInputChange}
              />
            </div>
            <div className="create-letter-form-group">
              <label className="create-letter-form-label">DispatchId:</label>{" "}
              <input
                type="text"
                name="dispatchId"
                className="create-letter-input-text"
                onChange={handleInputChange}
              />
            </div>
            <div className="create-letter-form-group">
              <label className="create-letter-form-label">Description:</label>{" "}
              <input
                type="text"
                name="description"
                className="create-letter-input-text"
                onChange={handleInputChange}
              />
            </div>
            <div className="create-letter-form-group">
              <label className="create-letter-form-label">Branch:</label>
              <select
                name="category"
                className="create-letter-choose"
                onChange={handleInputChange}
                required
              >
                <option value="">Select Branch</option>
                <option value="A">A</option>
                <option value="G">G</option>
                <option value="Q">Q</option>
                <option value="PRI">PRI</option>
                <option value="Publication">Publication</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-letter-form-group">
              <label className="create-letter-form-label">Upload:</label>{" "}
              <input
                type="file"
                name="letters"
                className="create-letter-input-file"
                onChange={handleletters}
              />
            </div>
            <div className="create-letter-form-group">
              <input
                type="submit"
                className="create-letter-submit-btn"
                value="Submit"
              />
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateLetter;
