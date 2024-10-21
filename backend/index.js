// index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("HIII!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
