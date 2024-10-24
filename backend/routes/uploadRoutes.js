const express = require("express");
const multer = require("multer");
const { uploadStudentList } = require("../controllers/uploadController");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to only allow CSVs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only CSV allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route to upload student list
router.post("/students", upload.single("file"), uploadStudentList);

module.exports = router;
