import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./Pages/Footer";
import "./Styles/FilteredLetters.css"; // Import the CSS file

const FilteredLetters = () => {
  const { category } = useParams();
  const [letters, setLetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch letters based on category
    fetch("http://localhost:4002/api/letter")
      .then((res) => res.json())
      .then((data) => {
        const filteredLetters = category
          ? data.filter((letter) => letter.category === category)
          : data;
        setLetters(filteredLetters);
      })
      .catch((error) => console.log(error));
  }, [category]);

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
      {/* <HEHeader /> */}
      <h2>{category ? `${category} Letters` : "All Letters"}</h2>
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
          {letters.map((letter) => (
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
      <Footer />
    </div>
  );
};

export default FilteredLetters;
