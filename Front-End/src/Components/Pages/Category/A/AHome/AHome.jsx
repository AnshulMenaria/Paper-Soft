import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AHome.css";
import AHeader from "../AHeader/AHeader";
import Footer from "../../../Footer/Footer";

const AHome = () => {
  const [ALetters, setALetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchALetters();
  }, []);

  const fetchALetters = () => {
    fetch("http://localhost:4002/api/letter?category=A")
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate)
        );
        setALetters(sortedData);
      })
      .catch((error) => console.log(error));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return ""; // handle case where timestamp is null or undefined
    const dateObj = new Date(timestamp);
    return isNaN(dateObj.getTime())
      ? ""
      : `${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()}`;
  };

  const handleViewClick = (fileUrl) => {
    navigate("/A-letterlist", { state: { fileUrl } });
  };

  const handleMarkAsComplete = (id) => {
    // Update the letter status to "Completed"
    fetch(`http://localhost:4002/api/letter/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Completed" }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Update the letters state
        setALetters((prevALetters) =>
          prevALetters.map((letter) =>
            letter._id === id ? { ...letter, status: "Completed" } : letter
          )
        );
      })
      .catch((error) => console.log(error));
  };

  const totalLetters = ALetters.length;
  const pendingLettersList = ALetters.filter(
    (letter) => letter.status === "Pending"
  );
  const pendingLettersCount = pendingLettersList.length;
  const completedLetters = ALetters.filter(
    (letter) => letter.status === "Completed"
  ).length;

  return (
    <>
      <AHeader />
      <div className="a-letter-list-container">
        <div className="a-letters-list">
          <h3>Latest Letters</h3>
          <Container>
            <Row>
              <div className="a-letters-list-header">
                <div className="a-header-item">Title</div>
                <div className="a-header-item">Category</div>
                <div className="a-header-item">Time and Date</div>
                <div className="a-header-item">File</div>
              </div>
              {ALetters.map((item) => (
                <div className="a-letters-list-item" key={item._id}>
                  <div className="a-item-title">{item.title}</div>
                  <div className="a-item-category">{item.category}</div>
                  <div className="a-item-date">
                    {formatDate(item.uploadedDate)}
                  </div>
                  <div className="a-item-file">
                    <button onClick={() => handleViewClick(item.letters)}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </Row>
          </Container>
        </div>

        <div className="a-right-column">
          <div className="a-card color-9">
            <div className="a-card-body">
              <div className="a-card-title">Total Letters</div>
              <div className="a-card-text" id="total-letters">
                {totalLetters}
              </div>
            </div>
          </div>
          <div className="a-card color-10">
            <div className="a-card-body">
              <div className="a-card-title">Pending Letters</div>
              <div className="a-card-text" id="pending-letters">
                {pendingLettersCount}
              </div>
            </div>
          </div>
          <div className="a-card color-11">
            <div className="a-card-body">
              <div className="a-card-title">Completed Letters</div>
              <div className="a-card-text" id="completed-letters">
                {completedLetters}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AHome;
