import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HEHeader from "../HeHeader/HEHeader";

const FilterLetters = () => {
  const { filter } = useParams();
  const [letters, setLetters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    filter === "all" ? "" : filter
  );
  const navigate = useNavigate();

  // Predefined categories
  const categories = [
    { name: "A" },
    { name: "G" },
    { name: "Q" },
    { name: "Publication" },
    { name: "PRI" },
  ];

  useEffect(() => {
    console.log("Fetching letters...");
    fetch("http://localhost:4002/api/letter")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched letters:", data);
        setLetters(data);
      })
      .catch((error) => console.log("Error fetching letters:", error));
  }, []);

  useEffect(() => {
    console.log("Filter parameter updated:", filter);
    setSelectedCategory(filter === "all" ? "" : filter);
  }, [filter]);

  const filteredLetters = letters.filter(
    (letter) =>
      (filter === "all" ||
        letter.category === selectedCategory ||
        letter.status === selectedCategory) &&
      (selectedCategory === "" || letter.category === selectedCategory)
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const dateObj = new Date(timestamp);
    return isNaN(dateObj.getTime())
      ? ""
      : `${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()}`;
  };

  const handleViewClick = (fileUrl) => {
    navigate("/hierarchy-viewletter", { state: { fileUrl } });
  };

  return (
    <div>
      <HEHeader />
      <h2>{filter === "all" ? "All Letters" : `${filter} Letters`}</h2>

      {filter === "all" && (
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>DispatchId</th>
            <th>Description</th>
            <th>Category</th>
            <th>Time and Date</th>
            <th>Status</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {filteredLetters.length === 0 && (
            <tr>
              <td colSpan="7">No letters found.</td>
            </tr>
          )}
          {filteredLetters.map((letter) => (
            <tr key={letter._id}>
              <td data-label="Title">{letter.title}</td>
              <td data-label="DispatchId">{letter.dispatchId}</td>
              <td data-label="Description">{letter.description}</td>
              <td data-label="Category">{letter.category}</td>
              <td data-label="Time and Date">
                {formatDate(letter.uploadedDate)}
              </td>
              <td data-label="Status">
                <button disabled>{letter.status || "Pending"}</button>
              </td>
              <td data-label="File">
                <button onClick={() => handleViewClick(letter.letters)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilterLetters;
