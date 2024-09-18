const remarkModel = require("../models/remarkModel");

const remarkController = {
  async index(req, res, next) {
    try {
      const { letterId } = req.params;
      console.log("Received letterId:", letterId); // Log the letterId for debugging
      const remarks = await remarkModel.find({ letterId });
      res.status(200).json(remarks);
    } catch (error) {
      console.error("Error fetching remarks:", error);
      res.status(500).json({ error: "Server error.", serverError: error });
    }
  },

  async store(req, res, next) {
    try {
      const { designation, remark, letterId } = req.body;
      const newRemark = await remarkModel.create({ designation, remark, letterId });
      res.status(201).json(newRemark);
    } catch (error) {
      console.error("Error storing remark:", error); // Log the detailed error for debugging
      if (error.code === 11000) {
        res.status(400).json({ error: "Duplicate key error", details: error });
      } else {
        res.status(500).json({ error: "Server error.", serverError: error });
      }
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const rem = await remarkModel.findOneAndDelete({ _id: id });
      if (!rem) {
        return res.status(404).json({ error: "Remark not found" });
      }
      res.status(200).json(rem);
    } catch (error) {
      console.error("Error deleting remark:", error);
      res.status(500).json({ error: "Server error.", serverError: error });
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { remark } = req.body;
      const rem = await remarkModel.findOneAndUpdate(
        { _id: id },
        { remark },
        { new: true }
      );
      if (!rem) {
        return res.status(404).json({ error: "Remark not found" });
      }
      res.status(200).json(rem);
    } catch (error) {
      console.error("Error updating remark:", error);
      res.status(500).json({ error: "Server error.", serverError: error });
    }
  },
};

module.exports = remarkController;
