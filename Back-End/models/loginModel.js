const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const loginSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
},
{
  timestamps: true,
},);

const loginModel = mongoose.model("Login", loginSchema);
module.exports = loginModel;
