const express = require("express");
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../controller/middleware/auth");
const verifyToken = require("../controller/middleware/verifytoken");
const letterController = require("../controller/letterController");
const loginController = require("../controller/loginController");
const registerController = require("../controller/registerController");
const remarkController = require("../controller/remarkController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/letters");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Letter routes
router.post("/letter", upload.single("letters"), letterController.store);
router.get("/letter", letterController.index);
router.delete("/letter/:id", letterController.delete);
router.put("/letter/:id", letterController.update);

// Login routes
router.post("/login", loginController.login);

// Register routes
router.put("/user", authenticateToken, registerController.update);
router.get("/user", verifyToken, registerController.getUserByToken);
router.post("/register", registerController.store);
router.get("/register", registerController.index);
router.get("/register/:email", registerController.getUserByEmail);

// Remark routes
router.post("/remark", remarkController.store);
router.get("/remark/:letterId", remarkController.index);
router.delete("/remark/:id", verifyToken, remarkController.delete);
router.put("/remark/:id", verifyToken, remarkController.update);

module.exports = router;
