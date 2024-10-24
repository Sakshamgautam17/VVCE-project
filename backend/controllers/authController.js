const User = require("../models/User"); // Ensure you have the User model
const Admin = require("../models/Admin"); // Ensure you have the User model

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, return an error
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password (remove hashing for now)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successful login
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
// Admin User
const adminUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const admin = await Admin.findOne({ email });

    // If admin not found, return an error
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password (remove hashing for now)
    if (password !== admin.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successful login
    return res.status(200).json({ message: "Login successful", admin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  loginUser,
  adminUser,
};
