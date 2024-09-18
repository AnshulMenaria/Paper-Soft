import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "./HeViewLetter.css";

const HeViewLetter = () => {
  const location = useLocation();
  const { fileUrl } = location.state;
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState("");
  const [category1, setCategory1] = useState("");
  const [userSubCategory, setUserSubCategory] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [remark, setRemark] = useState("");
  const [remarks, setRemarks] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [headClerkRemarkExists, setHeadClerkRemarkExists] = useState(false);
  const [secondRemarkExists, setSecondRemarkExists] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);

  const designations = [
    "Commanding Officer",
    "2IC",
    "Adjutant",
    "Quad Master",
    "Head Clerk",
  ];

  const categoryToDesignation = {
    PRI: "2IC",
    A: "Adjutant",
    G: "Adjutant",
    Publication: "Adjutant",
    Q: "Quad Master",
  };

  useEffect(() => {
    const fetchUserData = () => {
      const storedCategory1 = localStorage.getItem("category1");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedCategory1) {
        setCategory1(storedCategory1);
      }

      if (storedUser) {
        setUserRole(storedUser.category);
        setUserSubCategory(storedUser.subCategory);
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

        console.log("Fetched remarks:", remarksMap);
        console.log("Number of remarks:", Object.keys(remarksMap).length);

        setHeadClerkRemarkExists(!!remarksMap["Head Clerk"]);
        setSecondRemarkExists(Object.keys(remarksMap).length >= 2);
        setCanConfirm(Object.keys(remarksMap).length >= 3);
      } catch (error) {
        console.error(
          "Error fetching remarks:",
          error.response?.data || error.message
        );
      }
    };

    fetchRemarks();
  }, []);

  useEffect(() => {
    if (userSubCategory && category1) {
      setSelectedDesignation(userSubCategory);
      setRemark(remarks[userSubCategory]?.remark || "");
      setEditMode(!!remarks[userSubCategory]);
    }
  }, [userSubCategory, category1, remarks]);

  const handleCheckboxChange = (designation) => {
    if (
      designation !== "Commanding Officer" ||
      userSubCategory === "Commanding Officer"
    ) {
      setSelectedDesignation(designation);
      setRemark(remarks[designation]?.remark || "");
      setEditMode(!!remarks[designation]);
    }
  };

  const handleInputChange = (event) => {
    setRemark(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allowedDesignation = categoryToDesignation[category1];
    if (
      selectedDesignation !== allowedDesignation &&
      selectedDesignation !== "Commanding Officer"
    ) {
      console.warn("Selected designation is not allowed.");
      return;
    }

    const remarkData = {
      designation: selectedDesignation,
      remark: remark,
      letterId: localStorage.getItem("currentLetterId"),
    };

    try {
      const token = localStorage.getItem("accessToken");
      let response;

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
        console.log("Remark updated:", response.data);
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
        console.log("Remark created:", response.data);
        setRemarks((prevRemarks) => ({
          ...prevRemarks,
          [selectedDesignation]: response.data,
        }));
      }

      setRemark("");
      setEditMode(false);
    } catch (error) {
      console.error(
        "Error submitting remark:",
        error.response?.data || error.message
      );
    }
  };

  const handleConfirm = async () => {
    const letterId = localStorage.getItem("currentLetterId");
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.put(
        `http://localhost:4002/api/letter/${letterId}`,
        { status: "Confirmed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Letter confirmed:", response.data);
      navigate("/he-letterlist"); // Navigate to the list after confirmation
    } catch (error) {
      console.error("Error confirming letter:", error.response?.data || error.message);
    }
  };

  return (
    <div className="he-view-letter-container">
      <div className="he-header">
        <FaTimes
          className="he-close-icon"
          onClick={() => navigate("/he-letterlist")}
        />
      </div>
      <div className="he-content">
        <div className="he-iframe-container">
          <iframe
            src={fileUrl}
            className="he-file-viewer"
            title="file-viewer"
          ></iframe>
        </div>
        <div className="he-remarks-container">
          <form onSubmit={handleSubmit}>
            <div>
              <h1>Remarks</h1>
            </div>
            <div className="he-designation-radiobuttons">
              {designations.map((designation) => {
                const isAllowedToComment =
                  category1 === categoryToDesignation[designation] ||
                  (designation === "Commanding Officer" &&
                    secondRemarkExists &&
                    userSubCategory === "Commanding Officer");

                return (
                  <div key={designation} className="he-radiobutton">
                    <div className="designation-row">
                      <input
                        type="radio"
                        name="designation"
                        id={designation}
                        checked={selectedDesignation === designation}
                        onChange={() => handleCheckboxChange(designation)}
                        disabled={!isAllowedToComment}
                      />
                      <label htmlFor={designation}>{designation}</label>
                    </div>
                    {remarks[designation] && (
                      <div className="he-remark-box">
                        <p className="he-remark-text">
                          {remarks[designation]?.remark}
                        </p>
                        <small className="he-text-muted">
                          {new Date(
                            remarks[designation]?.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <br />
                          {new Date(
                            remarks[designation]?.createdAt
                          ).toLocaleDateString()}
                        </small>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="he-remarks-input">
              <div className="he-input-group">
                <label htmlFor="remark">Remark:</label>
                <textarea
                  id="remark"
                  value={remark}
                  onChange={handleInputChange}
                  disabled={
                    (selectedDesignation !== categoryToDesignation[category1] &&
                      selectedDesignation !== "Commanding Officer") ||
                    (selectedDesignation === "Commanding Officer" &&
                      !secondRemarkExists)
                  }
                  className="he-remark-textarea"
                />
                <button
                  type="submit"
                  className="he-vltr-submit-button"
                  disabled={
                    (selectedDesignation !== categoryToDesignation[category1] &&
                      selectedDesignation !== "Commanding Officer") ||
                    (selectedDesignation === "Commanding Officer" &&
                      !secondRemarkExists)
                  }
                >
                  {editMode ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </form>
          {canConfirm && userSubCategory === categoryToDesignation[category1] && (
            <button className="he-confirm-button" onClick={handleConfirm}>
              Confirm Letter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeViewLetter;
