const Letter = require("../models/letterModel");

const letterController = {
  async store(req, res, next) {
    let cat;
    try {
      const { title, dispatchId, description, category } = req.body;
      console.log(req.body);
      cat = await Letter.create({
        title,
        dispatchId,
        description,
        category,
        letters: "upload/letters/" + req.file.filename,
      });
    } catch (error) {
      res.status(404).json({
        error: "Server Error",
        serverError: error,
      });
    }
    res.status(201).json(cat);
  },

  async index(req, res, next) {
    let categories;
    try {
      const { category } = req.query; // Get the category from query parameters
      const filter = category ? { category } : {}; // Apply filter if category is specified
      categories = await Letter.find(filter).sort({ uploadedDate: -1 }); // Sort by uploadedDate in descending order
    } catch (error) {
      res.status(404).json({
        error: "Server Error",
        serverError: error,
      });
    }
    res.status(200).json(categories);
  },

  async delete(req, res, next) {
    let cat;
    try {
      const { id } = req.params;
      console.log(req.params);
      cat = await Letter.findByIdAndDelete({ _id: id }); //fpr Create the Data in MongoDb
    } catch (error) {
      res.status(500).json({
        error: "Server Error",
        serverError: error,
      });
    }
    res.status(200).json(cat);
  },

  async update(req, res, next) {
    let cat;
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log(req.body);
      cat = await Letter.findByIdAndUpdate(
        { _id: id },
        { status },
        { new: true }
      );
    } catch (error) {
      res.status(500).json({
        error: "Server Error",
        serverError: error,
      });
    }
    res.status(200).json(cat);
  },
};

module.exports = letterController;
