import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHeader from "../AdminHeader/AdminHeader";
import API_BASE_URL from "../../../context/APIBASEURL";

const AdminLetterHome = () => {
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
    // Fetch letters
    fetch(`${API_BASE_URL}/letter`)
      .then((res) => res.json())
      .then((data) => setLetters(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
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
    if (!timestamp) return ""; // handle case where timestamp is null or undefined
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj.getTime())) {
      return ""; // handle invalid date
    } else {
      return `${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()}`;
    }
  };

  const handleViewClick = (fileUrl) => {
    navigate("/admin-viewletter", { state: { fileUrl } });
  };

  return (
    <div>
      <AdminHeader />
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

export default AdminLetterHome;
