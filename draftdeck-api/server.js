const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
app.use(cors());
app.use(express.json());

// 🔥 Get the actual root folder path (DraftDeckFantasy)
const rootPath = path.join(__dirname, "..");

// ✅ Serve static files like HTML, JS, CSS from the root
app.use(express.static(rootPath));

// ✅ API route for player search
app.get("/api/search-player", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  try {
    const dataPath = path.join(rootPath, "PlayersByAvailable.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const results = data.filter(player =>
      player.Name?.toLowerCase().includes(query) ||
      player.FirstName?.toLowerCase().includes(query) ||
      player.LastName?.toLowerCase().includes(query)
    );
    res.json({ results });
  } catch (err) {
    console.error("Error reading player data:", err);
    res.status(500).json({ error: "Failed to read player data" });
  }
});

// ✅ Home page fallback
app.get("/", (req, res) => {
  res.sendFile(path.join(rootPath, "home.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
