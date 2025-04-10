require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

console.log("Using RapidAPI Key:", process.env.RAPIDAPI_KEY);

// 🏈 NFL player-to-team map
const playerTeamMap = {
  mahomes: 33,
  kelce: 33,
  kittle: 91,
  bosa: 91,
  jefferson: 37,
  chase: 35,
  allen: 34,
  hurts: 39,
  prescott: 38
};

const SPORT_ID = 1; // NFL

app.get('/api/search-player', async (req, res) => {
  // ✅ Bulletproof query extraction
  const rawQuery = req.query.q;

  if (typeof rawQuery !== 'string' || !rawQuery.trim()) {
    return res.status(400).json({ error: "Missing or invalid query parameter 'q'" });
  }

  const searchName = rawQuery.trim().toLowerCase();

  // 🔍 Find matching key from playerTeamMap
  const matchedEntry = Object.entries(playerTeamMap).find(([key]) =>
    searchName.includes(key)
  );

  if (!matchedEntry) {
    return res.status(404).json({ error: `No known team for player '${searchName}'` });
  }

  const [matchedKey, teamId] = matchedEntry;

  try {
    const playersRes = await axios.get(`https://therundown-therundown-v1.p.rapidapi.com/v2/teams/${teamId}/players`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'therundown-therundown-v1.p.rapidapi.com'
      }
    });

    const players = playersRes.data.players;

    if (!Array.isArray(players)) {
      return res.status(500).json({ error: "No players found for this team." });
    }

    const matches = players.filter(player =>
      player.name.toLowerCase().includes(searchName)
    );

    if (matches.length === 0) {
      return res.status(404).json({ error: `Player '${searchName}' not found on team.` });
    }

    let stats = {};
    try {
      const statsRes = await axios.get(`https://therundown-therundown-v1.p.rapidapi.com/v2/teams/${teamId}/players/stats`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'therundown-therundown-v1.p.rapidapi.com'
        }
      });

      stats = statsRes.data.players?.find(p =>
        p.participant_id === matches[0].participant_id
      )?.statistics || {};

    } catch (err) {
      console.warn(`Stats not found for player '${searchName}'`);
    }

    res.json({
      results: [
        {
          id: matches[0].participant_id,
          name: matches[0].name,
          team_id: teamId,
          stats
        }
      ]
    });

  } catch (error) {
    console.error("Search failed:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
