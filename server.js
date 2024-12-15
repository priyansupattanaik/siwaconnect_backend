const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);

// route to suggestion
app.post("/api/suggestions", async (req, res) => {
  const { mobile, name, suggestion } = req.body;

  if (!mobile || !name || !suggestion) {
    return res
      .status(400)
      .json({ message: "Mobile, name, and suggestion are required" });
  }

  console.log("Received suggestion:", { mobile, name, suggestion });

  try {
    const [user] = await db.execute("SELECT * FROM users WHERE mobile = ?", [
      mobile,
    ]);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please log in again" });
    }

    // Insert the suggestion into the database for the user
    const query =
      "INSERT INTO suggestions (mobile, name, suggestion) VALUES (?, ?, ?)";
    await db.execute(query, [mobile, name, suggestion]);

    return res
      .status(200)
      .json({ message: "Suggestion submitted successfully" });
  } catch (err) {
    console.error("Error saving suggestion:", err);
    return res.status(500).json({ message: "Error saving suggestion" });
  }
});

app.get("/api/suggestions", async (req, res) => {
  try {
    const [results] = await db.execute(
      "SELECT * FROM suggestions ORDER BY timestamp DESC"
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
});

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
