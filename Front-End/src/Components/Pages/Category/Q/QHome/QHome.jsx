import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./QHome.css";
import QHeader from "../QHeader/QHeader";

const QHome = () => {
  const [ALetters, setALetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchALetters();
  }, []);

  const fetchALetters = () => {
    fetch("http://localhost:4002/api/letter?category=Q")
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
    navigate("/Q-letterlist", { state: { fileUrl } });
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
      <QHeader />
      <div className="letter-list-container">
        <div className="letters-list">
          <h3>Latest Letters</h3>
          <Container>
            <Row>
              <div className="letters-list-header">
                <div className="header-item">Title</div>
                <div className="header-item">Category</div>
                <div className="header-item">Time and Date</div>
                <div className="header-item">File</div>
              </div>
              {ALetters.map((item) => (
                <div className="letters-list-item" key={item._id}>
                  <div className="item-title">{item.title}</div>
                  <div className="item-category">{item.category}</div>
                  <div className="item-date">
                    {formatDate(item.uploadedDate)}
                  </div>
                  <div className="item-file">
                    <button onClick={() => handleViewClick(item.letters)}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </Row>
          </Container>
        </div>

        <div className="right-column">
          <div className="card color-9">
            <div className="card-body">
              <div className="card-title">Total Letters</div>
              <div className="card-text" id="total-letters">
                {totalLetters}
              </div>
            </div>
          </div>
          <div className="card color-10">
            <div className="card-body">
              <div className="card-title">Pending Letters</div>
              <div className="card-text" id="pending-letters">
                {pendingLettersCount}
              </div>
            </div>
          </div>
          <div className="card color-11">
            <div className="card-body">
              <div className="card-title">Completed Letters</div>
              <div className="card-text" id="completed-letters">
                {completedLetters}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QHome;
