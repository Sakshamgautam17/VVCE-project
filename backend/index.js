// index.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const cors = require("cors");

// Enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/uploads", express.static("uploads"));
app.use("/api/uploads", uploadRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
