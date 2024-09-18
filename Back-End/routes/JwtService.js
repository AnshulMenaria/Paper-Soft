// routes/JwtService.js

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/index");

class JwtService {
  static sign(payload, expiresIn = "1month", secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verify(token, secret = JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}

module.exports = JwtService;
