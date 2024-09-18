const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

// User controller
const userController = {
  // Get all users
  async index(req, res, next) {
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Server error.", serverError: error });
    }
  },

  // Get user by email
  async getUserByEmail(req, res, next) {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await userModel.findOne({ email: email });
      console.log(user);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error.", serverError: error });
    }
    res.status(200).json(user);
  },

  // Update user by email
  async update(req, res, next) {
    try {
      const { email } = req.params;
      const { newEmail, newName, newPassword } = req.body;

      let user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Check if newEmail is provided and it's different from the current email
      if (newEmail && newEmail !== user.email) {
        const existingUser = await userModel.findOne({ email: newEmail });
        if (existingUser) {
          return res.status(400).json({ error: "Email already in use." });
        }
        user.email = newEmail;
      }

      // Update name if provided
      if (newName) {
        user.name = newName;
      }

      // Update password if provided
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }

      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        error: "Server error.",
        serverError: error,
      });
    }
  },
};

module.exports = userController;
