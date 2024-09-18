import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HEHome.css";
import HEHeader from "../HeHeader/HEHeader";
import Footer from "../../Footer/Footer";

const HEHome = () => {
  const [letters, setLetters] = useState([]);
  const [categories, setCategories] = useState([
    { name: "A", color: "he-color-9", count: 0 },
    { name: "G", color: "he-color-10", count: 0 },
    { name: "Q", color: "he-color-11", count: 0 },
    { name: "Publication", color: "he-color-12", count: 0 },
    { name: "PRI", color: "he-color-13", count: 0 },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4002/api/letter")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched letters:", data);
        setLetters(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const categoryCounts = categories.map((category) => {
      const count = letters.filter(
        (letter) => letter.category === category.name
      ).length;
      console.log(`Category: ${category.name}, Count: ${count}`);
      return { ...category, count };
    });

    setCategories(categoryCounts);
  }, [letters]);

  const totalLetters = letters.length;
  const pendingLettersList = letters.filter(
    (letter) => letter.status === "Pending"
  );
  const pendingLettersCount = pendingLettersList.length;
  const completedLetters = letters.filter(
    (letter) => letter.status === "Completed"
  ).length;

  const handleCardClick = (filter) => {
    console.log("Navigating to filter:", filter);
    navigate(`/hierarchy-home/${filter}`);
  };

  return (
    <div>
      <HEHeader />
      <div className="he-dashboard-container">
        <div className="he-row-container">
          <div
            className="he-info-cards he-rectangular-card he-color-1"
            onClick={() => handleCardClick("all")}
          >
            <div className="he-card-body">
              <div className="he-card-title">Total Letters</div>
              <div className="he-card-text">{totalLetters}</div>
            </div>
          </div>
          <div className="he-info-cards he-rectangular-card he-color-2">
            <div className="he-card-body he-card-title1">
              <div className="he-card-title">
                <br />
                Pending Letters
              </div>
              <div className="he-card-text">{pendingLettersCount}</div>
            </div>
          </div>
          <div className="he-info-cards he-rectangular-card he-color-3">
            <div className="he-card-body">
              <div className="he-card-title">Completed Letters</div>
              <div className="he-card-text">{completedLetters}</div>
            </div>
          </div>
        </div>
        <div className="he-row-container">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`he-info-cards he-rectangular-card  he-category-card ${category.color}`}
              onClick={() => handleCardClick(category.name)}
            >
              <div className="he-card-body">
                <div className="he-card-title">{category.name}</div>
                <div className="he-card-text">{category.count} Letters</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HEHome;
