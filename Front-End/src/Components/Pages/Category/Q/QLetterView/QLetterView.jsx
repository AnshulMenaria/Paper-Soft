import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "./QLetterView.css";

const QLetterView = () => {
  const location = useLocation();
  const { fileUrl, letterId } = location.state;
  const navigate = useNavigate();

  const [letter, setLetter] = useState({});
  const [userRole, setUserRole] = useState("");
  const [userSubCategory, setUserSubCategory] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [remark, setRemark] = useState("");
  const [remarks, setRemarks] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [letterStatus, setLetterStatus] = useState("Pending");

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
    console.log("fileUrl:", fileUrl);
  }, [fileUrl]);

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

  const handleCheckboxChange = (designation) => {
    setSelectedDesignation(designation);
    setRemark(remarks[designation]?.remark || "");
    setEditMode(!!remarks[designation]);
  };

  const handleMarkAsComplete = () => {
    const currentLetterId = localStorage.getItem("currentLetterId");
    fetch(`http://localhost:4002/api/letter/${currentLetterId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Completed" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLetterStatus("Completed");
        navigate("/Q-letterlist", {
          state: { updatedStatuses: { [letterId]: "Completed" } },
        });
      })
      .catch((error) => {
        console.error("Error marking letter as complete:", error);
      });
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

  const isLetterCompleted = letterStatus === "Completed";

  return (
    <div className="q-view-letter-container">
      <div className="q-header">
        <FaTimes
          className="q-close-icon"
          onClick={() => navigate("/Q-letterlist")}
        />
      </div>
      <div className="q-content">
        <div className="q-iframe-container">
          <iframe
            src={fileUrl}
            className="q-file-viewer"
            title="file-viewer"
          ></iframe>
        </div>
        <div className="q-remarks-container">
          <form onSubmit={handleSubmit}>
            <div>
              <h1>Remarks</h1>
            </div>
            <div className="q-designation-radiobuttons">
              {designations.map((designation) => (
                <div key={designation} className="q-radiobutton">
                  <div className="q-designation-row">
                    <input
                      type="radio" // Changed to radio
                      name="designation" // Added name attribute to group them
                      id={designation}
                      checked={selectedDesignation === designation}
                      onChange={() => handleCheckboxChange(designation)}
                      disabled={userSubCategory !== designation}
                    />
                    <label htmlFor={designation}>{designation}</label>
                  </div>
                  {remarks[designation] && (
                    <div className="q-remark-box">
                      <p className="q-remark-text">
                        {remarks[designation]?.remark}
                      </p>
                      <small className="q-text-muted">
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
              ))}
            </div>
            {!isLetterCompleted && (
              <button
                onClick={handleMarkAsComplete}
                className="q-mark-complete-button"
              >
                Mark as Complete
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default QLetterView;
