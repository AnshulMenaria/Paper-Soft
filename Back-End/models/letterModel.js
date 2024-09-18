const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { BASE_URL } = require("../config");

const letterSchema = new Schema(
  {
    title: { type: String },
    dispatchId: { type: String },
    description: { type: String },
    category: { type: String },
    status: { type: String, default: "Pending" },

    letters: {
      type: String,
      get: (letters) => {
        return `${BASE_URL}${letters}`;
      },
    },
    uploadedDate: { type: Date, default: Date.now }, // Date field with default value set to current date/time
    uploadedTime: {
      type: String,
      default: () => new Date().toLocaleTimeString(),
    }, // Example of time string, adjust format as needed
  },
  {
    toJSON: { getters: true },
  }
);

const Letter = mongoose.model("Letter", letterSchema);

module.exports = Letter;
