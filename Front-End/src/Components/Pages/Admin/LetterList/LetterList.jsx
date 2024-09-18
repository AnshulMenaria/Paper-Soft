import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./LetterList.css"; // Import the CSS file
import AdminHeader from "../AdminHeader/AdminHeader";
import Footer from "../../Footer/Footer";

const LetterList = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4002/api/letter")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched letters for LetterList:", data); // Log fetched letters
        setItems(data);
      })
      .catch((error) => console.log("Error fetching letters:", error));

    fetch("http://172.20.10.2:4002/api/categories")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched categories:", data); // Log fetched categories
        setCategories(data);
      })
      .catch((error) => console.log("Error fetching categories:", error));
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return ""; // handle case where timestamp is null or undefined
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj.getTime())) {
      return ""; // handle invalid date
    } else {
      return `${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()}`;
    }
  };

  const handleViewClick = (fileUrl, letterId, category) => {
    localStorage.setItem("currentLetterId", letterId, ); // Store letterId in local storage
    navigate("/admin-viewletter", { state: { fileUrl } });
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  console.log("Selected Category:", selectedCategory);
  console.log("Filtered Items:", filteredItems);

  return (
    <>
      <AdminHeader />
      <Container className="admin-letterlist-container">
        <Row className="admin-letterlist-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="admin-letterlist-select"
          >
            <option value="">Select a category</option>
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
        </Row>
        <Row className="admin-letterlist-row">
          <table className="admin-letterlist-table">
            <thead>
              <tr className="admin-letterlist-header">
                <th className="admin-letterlist-header">Title</th>
                <th className="admin-letterlist-header">DispatchId</th>
                <th className="admin-letterlist-header">Description</th>
                <th className="admin-letterlist-header">Category</th>
                <th className="admin-letterlist-header">Time and Date</th>
                <th className="admin-letterlist-header">Status</th>
                <th className="admin-letterlist-header">File</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id} className="admin-letterlist-row-hover">
                  <td className="admin-letterlist-cell" data-label="Title">
                    {item.title}
                  </td>
                  <td className="admin-letterlist-cell" data-label="DispatchId">
                    {item.dispatchId}
                  </td>
                  <td
                    className="admin-letterlist-cell admin-letterlist-description"
                    data-label="Description"
                  >
                    {item.description}
                  </td>
                  <td className="admin-letterlist-cell" data-label="Category">
                    {item.category}
                  </td>
                  <td
                    className="admin-letterlist-cell"
                    data-label="Time and Date"
                  >
                    {formatDate(item.uploadedDate)}
                  </td>
                  <td className="admin-letterlist-cell" data-label="Status">
                    <button className="admin-letterlist-button" disabled>
                      {item.status || "Pending"}
                    </button>
                  </td>
                  <td className="admin-letterlist-cell" data-label="File">
                    <button
                      className="admin-letterlist-view-button"
                      onClick={() => handleViewClick(item.letters, item._id, item.category)}
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
      <Footer />
    </>
  );
};

export default LetterList;
