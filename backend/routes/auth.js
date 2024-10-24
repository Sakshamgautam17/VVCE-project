const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");
const { adminUser } = require("../controllers/authController");

// POST /api/auth/login
router.post("/login", loginUser);
router.post("/admin-login", adminUser);

module.exports = router;
