// routes/auth.js
const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");

// Registration route
router.post("/register", registerUser);

module.exports = router;
