const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const RESULTS_FILE = path.join(__dirname, "../data/exam_results.json");

// Ensure results file exists
async function ensureResultsFile() {
  try {
    await fs.access(RESULTS_FILE);
  } catch {
    await fs.writeFile(RESULTS_FILE, "[]");
  }
}

// Save exam results
router.post("/save-results", async (req, res) => {
  try {
    await ensureResultsFile();

    const newResult = {
      ...req.body,
      timestamp: new Date().toISOString(),
    };

    // Read existing results
    const data = await fs.readFile(RESULTS_FILE, "utf8");
    const results = JSON.parse(data);

    // Add new result
    results.push(newResult);

    // Save updated results
    await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));

    res.json({ status: "success", message: "Results saved successfully" });
  } catch (error) {
    console.error("Error saving results:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get all results
router.get("/results", async (req, res) => {
  try {
    await ensureResultsFile();
    const data = await fs.readFile(RESULTS_FILE, "utf8");
    const results = JSON.parse(data);
    res.json(results);
  } catch (error) {
    console.error("Error reading results:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Get results for a specific email
router.get("/results/:email", async (req, res) => {
  try {
    await ensureResultsFile();
    const data = await fs.readFile(RESULTS_FILE, "utf8");
    const results = JSON.parse(data);
    const userResults = results.filter(
      (result) => result.email === req.params.email
    );
    res.json(userResults);
  } catch (error) {
    console.error("Error reading results:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
