const dotenv = require("dotenv");

dotenv.config();

module.exports = { APP_PORT, BASE_URL, JWT_SECRET, REFRESH_TOKEN,ACCESS_TOKEN_SECRET } = process.env;
