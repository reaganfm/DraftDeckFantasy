require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

console.log("Using RapidAPI Key:", process.env.RAPIDAPI_KEY);

let allPlayersMapping = [];

// Attempt to load the player mapping from a local file
const mappingPath = path.join(__dirname, 'playersMapping.json');
if (fs.existsSync(mappingPath)) {
  try {
    const data = fs.readFileSync(mappingPath, 'utf-8');
    allPlayersMapping = JSON.parse(data);
    console.log(`Loaded ${allPlayersMapping.length} NFL players from local mapping.`);
  } catch (err) {
    console.error("Error reading local mapping file:", err.message);
  }
} else {
  console.warn("Local players mapping file not found. Make sure to build it manually.");
}

app.get('/api/search-player', async (req, res) => {
  const rawQuery = req.query.q;
  if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
    return res.status(400).json({ error: "Missing or invalid query parameter 'q'" });
  }
  const searchName = rawQuery.trim().toLowerCase();

  // Use the local mapping for searching players
  const matchingPlayers = allPlayersMapping.filter(player => {
    const fullName = `${player.first_name || ''} ${player.last_name || ''}`.toLowerCase();
    const displayName = (player.name || '').toLowerCase();
    return fullName.includes(searchName) || displayName.includes(searchName);
  });

  if (matchingPlayers.length === 0) {
    return res.status(404).json({ error: `No NFL player found for query '${searchName}'` });
  }

  // Pick the first matching player
  const match = matchingPlayers[0];
  console.log("Matched player:", match);

  let stats = [];
  try {
    const statsRes = await axios.get(
      `https://therundown-therundown-v1.p.rapidapi.com/v2/teams/${match.team_id}/players/stats`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'therundown-therundown-v1.p.rapidapi.com'
        }
      }
    );
    console.log("Stats API response:", JSON.stringify(statsRes.data, null, 2));
    const statsData = statsRes.data.players || statsRes.data;
    const playerIdentifier = match.player_id || match.participant_id;
    const filteredStats = statsData.filter(record => record.player_id === playerIdentifier);
    if (filteredStats.length > 0) {
      const latestSeasonYear = Math.max(...filteredStats.map(record => record.season_year));
      let relevantStats = filteredStats.filter(record => record.season_year === latestSeasonYear);
      if (relevantStats.some(stat => stat.season_type_name === "Regular Season")) {
        relevantStats = relevantStats.filter(stat => stat.season_type_name === "Regular Season");
      }
      stats = relevantStats;
    } else {
      console.warn("No stats records found for player identifier", playerIdentifier);
    }
  } catch (err) {
    console.warn(`Stats fetch error for player '${searchName}':`, err.response?.data || err.message);
  }

  res.json({
    results: [
      {
        name: match.name || `${match.first_name} ${match.last_name}`,
        team_id: match.team_id,
        stats: stats
      }
    ]
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
