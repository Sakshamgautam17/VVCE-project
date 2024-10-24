const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const Student = require("../models/studentModel");

// Handle Student List CSV Upload
const uploadStudentList = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const results = [];
  const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);

  // Parse CSV File
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (data) => {
      results.push({
        name: data.name,
        email: data.email,
        rollNumber: data.rollNumber,
      });
    })
    .on("end", async () => {
      try {
        // Insert data into MongoDB
        await Student.insertMany(results);
        return res
          .status(200)
          .json({
            message: "Student list uploaded and data saved to MongoDB",
            data: results,
          });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error saving to MongoDB", error: error.message });
      }
    });
};

module.exports = {
  uploadStudentList,
};
