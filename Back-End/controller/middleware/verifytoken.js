const JwtService = require("../../routes/JwtService");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token missing or invalid." });
  }

  try {
    const user = await JwtService.verify(token);
    req.user = user; // Attach the user to the request
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ error: "Token verification failed." });
  }
};

module.exports = verifyToken;
