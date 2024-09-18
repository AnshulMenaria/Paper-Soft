const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const registerSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const registerModel = mongoose.model("Register", registerSchema);
module.exports = registerModel;
