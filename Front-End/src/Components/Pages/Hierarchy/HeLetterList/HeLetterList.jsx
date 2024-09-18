import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./HeLetterList.css"; // Import the CSS file
import HEHeader from "../HeHeader/HEHeader";
import Footer from "../../Footer/Footer";

const HeLetterList = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4002/api/letter")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched letters for HeLetterList:", data); // Log fetched letters
        setItems(data);
      })
      .catch((error) => console.log("Error fetching letters:", error));

    fetch("http://localhost:4002/api/categories")
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
    localStorage.setItem("currentLetterId", letterId); // Store letterId in local storage
    localStorage.setItem("category1", category); // Store letterId in local storage
    navigate("/hierarchy-viewletter", { state: { fileUrl } });
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  console.log("Selected Category:", selectedCategory);
  console.log("Filtered Items:", filteredItems);

  return (
    <>
      <HEHeader />
      <Container className="he-letter-container">
        <Row className="he-letter-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="he-letter-select"
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
        <Row className="he-letter-table-row">
          <table className="he-letter-table">
            <thead>
              <tr className="he-letter-list-header-tr">
                <th className="he-letter-list-header-th">Title</th>
                <th className="he-letter-list-header-th">DispatchId</th>
                <th className="he-letter-list-header-th">Description</th>
                <th className="he-letter-list-header-th">Category</th>
                <th className="he-letter-list-header-th">Time and Date</th>
                <th className="he-letter-list-header-th">Status</th>
                <th className="he-letter-list-header-th">File</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id} className="he-letter-list-row">
                  <td className="he-letter-list-td" data-label="Title">
                    {item.title}
                  </td>
                  <td className="he-letter-list-td" data-label="DispatchId">
                    {item.dispatchId}
                  </td>
                  <td
                    className="he-letter-list-td he-letter-description-cell"
                    data-label="Description"
                  >
                    {item.description}
                  </td>
                  <td className="he-letter-list-td" data-label="Category">
                    {item.category}
                  </td>
                  <td className="he-letter-list-td" data-label="Time and Date">
                    {formatDate(item.uploadedDate)}
                  </td>
                  <td className="he-letter-list-td" data-label="Status">
                    <button className="he-letter-status-button" disabled>
                      {item.status || "Pending"}
                    </button>
                  </td>
                  <td className="he-letter-list-td" data-label="File">
                    <button
                      className="he-letter-view-button"
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

export default HeLetterList;
