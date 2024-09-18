const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const remarkSchema = new Schema({
  designation: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
    required: true,
  },
  letterId: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true
  }

);

const remarkModel = mongoose.model("Remark", remarkSchema);
module.exports = remarkModel;
