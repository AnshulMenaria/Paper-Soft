import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import "./ALetterList.css";
import AHeader from "../AHeader/AHeader";

const ALetterList = () => {
  const { category } = useParams();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || "A");
  const [letterStatuses, setLetterStatuses] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4002/api/letter?category=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched letters for LetterList:", data);
        const sortedData = data.sort(
          (a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate)
        );
        setItems(sortedData);
        const initialStatuses = data.reduce((acc, item) => {
          acc[item._id] = item.status || "Pending";
          return acc;
        }, {});
        setLetterStatuses(initialStatuses);
      })
      .catch((error) => console.error("Error fetching letters:", error));
  }, [selectedCategory]);

  useEffect(() => {
    if (location.state && location.state.updatedStatuses) {
      setLetterStatuses(location.state.updatedStatuses);
    }
  }, [location.state]);

  const handleViewClick = (fileUrl, letterId) => {
    localStorage.setItem("currentLetterId", letterId); // Store letterId in local storage
    navigate("/A-letterview", { state: { fileUrl } });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const dateObj = new Date(timestamp);
    return isNaN(dateObj.getTime())
      ? ""
      : `${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()}`;
  };

  return (
    <>
      <AHeader />
      <Container className="a-letterlist-container">
        <Row className="a-letterlist-row">
          <table className="a-letterlist-table">
            <thead>
              <tr className="a-letterlist-header">
                <th>Title</th>
                <th>Dispatch ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Time and Date</th>
                <th>Status</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="a-letterlist-row-hover">
                  <td className="a-letterlist-cell" data-label="Title">
                    {item.title}
                  </td>
                  <td className="a-letterlist-cell" data-label="DispatchId">
                    {item.dispatchId}
                  </td>
                  <td
                    className="a-letterlist-cell a-letterlist-description"
                    data-label="Description"
                  >
                    {item.description}
                  </td>
                  <td className="a-letterlist-cell" data-label="Category">
                    {item.category}
                  </td>
                  <td className="a-letterlist-cell" data-label="Time and Date">
                    {formatDate(item.uploadedDate)}
                  </td>
                  <td className="a-letterlist-cell" data-label="Status">
                    <button className="a-status-button" disabled>
                      {letterStatuses[item._id] || "Pending"}
                    </button>
                  </td>
                  <td className="a-letterlist-cell" data-label="File">
                    <button
                      className="a-view-button"
                      onClick={() => handleViewClick(item.letters, item._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Row>
      </Container>
    </>
  );
};

export default ALetterList;
