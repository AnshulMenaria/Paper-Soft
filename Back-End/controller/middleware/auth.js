// controller/middleware/authenticateToken.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/index');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Invalid access token:', err);
      return res.status(403).json({ error: 'Invalid access token.' });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
  