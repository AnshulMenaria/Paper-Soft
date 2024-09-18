import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import "./PriLetterList.css";
import PriHeader from "../PriHeader/PriHeader";

const PriLetterList = () => {
  const { category } = useParams();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || "PRI");
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
    navigate("/Pri-letterView", { state: { fileUrl } });
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
      <PriHeader />
      <Container className="pri-letterlist-container">
        <Row className="pri-letterlist-row">
          <table className="pri-letterlist-table">
            <thead>
              <tr className="pri-letterlist-header">
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
                <tr key={item._id} className="pri-letterlist-row-hover">
                  <td className="pri-letterlist-cell" data-label="Title">
                    {item.title}
                  </td>
                  <td className="pri-letterlist-cell" data-label="DispatchId">
                    {item.dispatchId}
                  </td>
                  <td
                    className="pri-letterlist-cell pri-letterlist-description"
                    data-label="Description"
                  >
                    {item.description}
                  </td>
                  <td className="pri-letterlist-cell" data-label="Category">
                    {item.category}
                  </td>
                  <td className="pri-letterlist-cell" data-label="Time and Date">
                    {formatDate(item.uploadedDate)}
                  </td>
                  <td className="pri-letterlist-cell" data-label="Status">
                    <button className="pri-status-button" disabled>
                      {letterStatuses[item._id] || "Pending"}
                    </button>
                  </td>
                  <td className="pri-letterlist-cell" data-label="File">
                    <button
                      className="pri-view-button"
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

export default PriLetterList;
