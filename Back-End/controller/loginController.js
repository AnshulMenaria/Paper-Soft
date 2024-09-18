  const registerModel = require("../models/registerModel");
  const bcrypt = require("bcryptjs");
  const { REFRESH_SECRET } = require("../config/index");
  const JwtService = require("../routes/JwtService");

  // Login controller
  const loginController = {
    async login(req, res) {
      const { email, password } = req.body;

      try {
        // Find the user by email
        const user = await registerModel.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ success: false, msg: "Invalid email or password" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, msg: "Invalid email or password" });
        }

        // Passwords match, generate tokens
        const accessToken = JwtService.sign({ _id: user._id }, "1h"); // Expires in 1 hour
        const refreshToken = JwtService.sign(
          { _id: user._id },
          "1y",
          REFRESH_SECRET
        );
  
        res.status(200).json({
          success: true,
          msg: "Login successful",
          user: {
            _id: user._id,
            email: user.email,
            category: user.category,
            subCategory: user.subCategory,
          },
          accessToken,
          refreshToken,
        });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, msg: "Server error", error });
      }
    },
  };

  module.exports = loginController;
