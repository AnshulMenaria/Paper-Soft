const express = require("express");
const app = express();
const { APP_PORT, DB_URL } = require("./config");
const routes = require("./routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const os = require("os");

// Database connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Image public visibility
app.use(express.static(__dirname + "/public"));
app.use("/upload", express.static("upload"));

// CORS configuration
app.use(cors()); // Allow all origins, customize if needed

app.use(bodyParser.json());
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen on port
app.listen(process.env.PORT || 4002, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (let k in interfaces) {
      for (let k2 in interfaces[k]) {
          const address = interfaces[k][k2];
          if (address.family === 'IPv4' && !address.internal) {
              addresses.push(address.address);
          }
      }
  }
  const port = process.env.PORT || 4002;
  console.log(` ⚙️ Server is running on port ${port}, \n Api URL: ${addresses.join(', ')}:${port}`);
});