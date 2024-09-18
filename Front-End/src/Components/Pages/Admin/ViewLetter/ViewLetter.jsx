import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "./ViewLetter.css";

const ViewLetter = () => {
  const location = useLocation();
  const { fileUrl } = location.state;
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState("");
  const [userSubCategory, setUserSubCategory] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [remark, setRemark] = useState("");
  const [remarks, setRemarks] = useState({});
  const [editMode, setEditMode] = useState(false);

  const designations = [
    "Commanding Officer",
    "2IC",
    "Adjutant",
    "Quad Master",
    "Head Clerk",
  ];

  useEffect(() => {
    const fetchUserData = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserRole(storedUser.category);
        setUserSubCategory(storedUser.subCategory);
        setSelectedDesignation(storedUser.subCategory);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRemarks = async () => {
      const letterId = localStorage.getItem("currentLetterId");
      if (!letterId) {
        console.error("No letterId found in localStorage.");
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          `http://localhost:4002/api/remark/${letterId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const remarksMap = response.data.reduce((acc, remark) => {
          acc[remark.designation] = remark;
          return acc;
        }, {});
        setRemarks(remarksMap);
      } catch (error) {
        console.error(
          "Error fetching remarks:",
          error.response?.data || error.message
        );
      }
    };

    fetchRemarks();
  }, []);

  const handleRadioChange = (designation) => {
    setSelectedDesignation(designation);
    setRemark(remarks[designation]?.remark || "");
    setEditMode(!!remarks[designation]);
  };

  const handleInputChange = (event) => {
    setRemark(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const remarkData = {
      designation: selectedDesignation,
      remark: remark,
      letterId: localStorage.getItem("currentLetterId"),
    };

    try {
      let response;
      const token = localStorage.getItem("accessToken");

      if (editMode && remarks[selectedDesignation]) {
        response = await axios.put(
          `http://localhost:4002/api/remark/${remarks[selectedDesignation]._id}`,
          remarkData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRemarks((prevRemarks) => ({
          ...prevRemarks,
          [selectedDesignation]: response.data,
        }));
      } else {
        response = await axios.post(
          "http://localhost:4002/api/remark",
          remarkData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRemarks((prevRemarks) => ({
          ...prevRemarks,
          [selectedDesignation]: response.data,
        }));
      }

      setSelectedDesignation(userSubCategory);
      setRemark("");
      setEditMode(false);
    } catch (error) {
      console.error(
        "Error submitting remark:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (designation) => {
    if (userRole !== "HE") return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        `http://localhost:4002/api/remark/${remarks[designation]._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRemarks((prevRemarks) => {
        const newRemarks = { ...prevRemarks };
        delete newRemarks[designation];
        return newRemarks;
      });
    } catch (error) {
      console.error(
        "Error deleting remark:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="vltr-container">
      <div className="vltr-header">
        <FaTimes
          className="vltr-close-icon"
          onClick={() => navigate("/letterlist")}
        />
      </div>
      <div className="vltr-content">
        <div className="vltr-iframe-container">
          <iframe
            src={fileUrl}
            className="vltr-file-viewer"
            title="file-viewer"
          ></iframe>
        </div>
        <div className="vltr-remarks-container">
          <form onSubmit={handleSubmit}>
            <div>
              <h1>Remarks</h1>
            </div>
            <div className="vltr-designation-radios">
              {designations.map((designation) => (
                <div key={designation} className="vltr-radio">
                  <div className="vltr-designation-row">
                    <input
                      type="radio"
                      id={designation}
                      name="designation"
                      checked={selectedDesignation === designation}
                      onChange={() => handleRadioChange(designation)}
                      disabled={userSubCategory !== designation}
                    />
                    <label htmlFor={designation}>{designation}</label>
                  </div>
                  {remarks[designation] && (
                    <div className="vltr-remark-box">
                      <p className="vltr-remark-text">
                        {remarks[designation]?.remark}
                      </p>
                      <small className="vltr-text-muted">
                        {new Date(
                          remarks[designation]?.createdAt
                        ).toLocaleDateString()}
                        <br />
                        {new Date(
                          remarks[designation]?.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="vltr-remarks-input">
              <div className="vltr-input-group">
                <label htmlFor="remark">Remark:</label>
                <textarea
                  id="remark"
                  value={remark}
                  onChange={handleInputChange}
                  disabled={!userSubCategory || editMode}
                  className="vltr-remark-textarea"
                />
                <button type="submit" className="vltr-submit-button">
                  {editMode ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewLetter;
