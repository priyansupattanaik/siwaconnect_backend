const express = require("express");
const db = require("../config/db"); // Import database connection
const router = express.Router();

// Endpoint to submit a suggestion
router.post("/api/suggestions", async (req, res) => {
  const { name, mobile, suggestion } = req.body;

  // Validate input
  if (!name || !mobile || !suggestion) {
    return res
      .status(400)
      .json({ message: "Name, mobile number, and suggestion are required." });
  }

  try {
    // Insert suggestion into the database
    const query =
      "INSERT INTO suggestions (name, mobile, suggestion) VALUES (?, ?, ?)";
    db.execute(query, [name, mobile, suggestion], (err, results) => {
      if (err) {
        console.error("Error saving suggestion:", err);
        return res.status(500).json({ message: "Failed to save suggestion" });
      }
      return res
        .status(200)
        .json({ message: "Suggestion submitted successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all suggestions (optional, for admin purposes)
router.get("/api/suggestions", (req, res) => {
  const query = "SELECT * FROM suggestions ORDER BY timestamp DESC";

  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching suggestions:", err);
      return res.status(500).json({ message: "Failed to fetch suggestions" });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
