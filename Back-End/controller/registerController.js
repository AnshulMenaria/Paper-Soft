const registerModel = require("../models/registerModel");
const bcrypt = require("bcryptjs");

const registerController = {
  async index(req, res, next) {
    try {
      const users = await registerModel.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Server error.", serverError: error });
    }
  },

  async store(req, res, next) {
    const { name, email, password, category, subCategory } = req.body;

    if (!name || !password || !category) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const existingUser = await registerModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await registerModel.create({
        name,
        email,
        password: hashedPassword,
        category,
        subCategory,
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({
        error: "Server error.",
        serverError: error,
      });
    }
  },

  async getUserByToken(req, res) {
    try {
      const user = await registerModel
        .findById(req.user._id)
        .select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Server error.", serverError: error });
    }
  },

  async getUserByEmail(req, res, next) {
    try {
      const user = await registerModel
        .findOne({ email: req.params.email })
        .select("-password");
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Server error.", serverError: error });
    }
  },

  async update(req, res) {
    try {
      const { name, email, password } = req.body;
      const userId = req.user._id;

      let user = await registerModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      if (name) user.name = name;

      if (email) {
        const existingUserWithEmail = await registerModel.findOne({ email });
        if (
          existingUserWithEmail &&
          existingUserWithEmail._id.toString() !== userId
        ) {
          return res.status(400).json({ error: "Email is already in use." });
        }
        user.email = email;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }

      await user.save();

      res
        .status(200)
        .json({ success: true, msg: "User data updated successfully." });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Server error.", serverError: error });
    }
  },
};

module.exports = registerController;
