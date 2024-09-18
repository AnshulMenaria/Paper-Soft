import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";
import AdminHeader from "../AdminHeader/AdminHeader";
import Footer from "../../Footer/Footer";
import API_BASE_URL from "../../../context/APIBASEURL";

const AdminHome = () => {
  const [letters, setLetters] = useState([]);
  const [categories, setCategories] = useState([
    { name: "A", color: "admin-color-4", count: 0 },
    { name: "G", color: "admin-color-5", count: 0 },
    { name: "Q", color: "admin-color-6", count: 0 },
    { name: "Publication", color: "admin-color-7", count: 0 },
    { name: "PRI", color: "admin-color-8", count: 0 },
  ]);
  const [filteredLetters, setFilteredLetters] = useState({
    pending: [],
    completed: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch letters
    fetch(`${API_BASE_URL}/letter`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched letters:", data); // Log fetched letters
        setLetters(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Update Category counts
    const categoryCounts = categories.map((category) => {
      const count = letters.filter(
        (letter) => letter.category === category.name
      ).length;
      console.log(`Category: ${category.name}, Count: ${count}`); // Log category counts
      return { ...category, count };
    });

    setCategories(categoryCounts);
  }, [letters]); // Dependency on 'letters' is correct

  useEffect(() => {
    // Filter letters based on status for pending and completed
    if (letters.length > 0) {
      const pendingLetters = letters.filter(
        (letter) => letter.status === "Pending"
      );
      const completedLetters = letters.filter(
        (letter) => letter.status === "Completed"
      );
      setFilteredLetters({
        pending: pendingLetters,
        completed: completedLetters,
      });
    }
  }, [letters]);

  const totalLetters = letters.length;
  const pendingLettersCount = filteredLetters.pending.length;
  const completedLettersCount = filteredLetters.completed.length;

  const handleCardClick = (filter) => {
    navigate(`/admin-letters/${filter}`);
  };

  return (
    <div>
      <AdminHeader />
      <div className="admin-dashboard-container">
        <div className="admin-row-container">
          <div
            className="admin-info-cards admin-rectangular-card admin-color-1"
            onClick={() => handleCardClick("all")}
          >
            <div className="admin-card-body">
              <div className="admin-card-title">Total Letters</div>
              <div className="admin-card-text">{totalLetters}</div>
            </div>
          </div>
          <div
            className="admin-info-cards admin-rectangular-card admin-color-2"
            // id="admin-info-card2Id"
            onClick={() => handleCardClick("Pending")}
          >
            <div className="admin-card-body admin-card-title1">
              <div className="admin-card-title">
                <br></br>Pending Letters
              </div>
              <div className="admin-card-text">{pendingLettersCount}</div>
            </div>
          </div>
          <div
            className="admin-info-cards admin-rectangular-card admin-color-3"
            onClick={() => handleCardClick("Completed")}
          >
            <div className="admin-card-body">
              <div className="admin-card-title">Completed Letters</div>
              <div className="admin-card-text">{completedLettersCount}</div>
            </div>
          </div>
        </div>

        {/* Displaying categories */}
        <div className="admin-row-container">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`admin-info-cards admin-rectangular-card admin-category-card ${category.color}`}
              onClick={() => handleCardClick(category.name)}
            >
              <div className="admin-card-body">
                <div className="admin-card-title">{category.name}</div>
                <div className="admin-card-text">{category.count} Letters</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminHome;
