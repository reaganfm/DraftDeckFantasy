require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

console.log("Using RapidAPI Key:", process.env.RAPIDAPI_KEY);

// ✅ Verified NFL team IDs
const nflTeamMap = {
  "Kansas City Chiefs": 66,
  "San Francisco 49ers": 78,
  "Minnesota Vikings": 71,
  "Cincinnati Bengals": 57,
  "Buffalo Bills": 54,
  "Philadelphia Eagles": 76,
  "Dallas Cowboys": 59
};

// 🔒 Map player search terms to correct team ID
const playerTeamMap = {
  mahomes: nflTeamMap["Kansas City Chiefs"],
  kelce: nflTeamMap["Kansas City Chiefs"],
  kittle: nflTeamMap["San Francisco 49ers"],
  bosa: nflTeamMap["San Francisco 49ers"],
  jefferson: nflTeamMap["Minnesota Vikings"],
  chase: nflTeamMap["Cincinnati Bengals"],
  allen: nflTeamMap["Buffalo Bills"],
  hurts: nflTeamMap["Philadelphia Eagles"],
  prescott: nflTeamMap["Dallas Cowboys"]
};

app.get('/api/search-player', async (req, res) => {
  const rawQuery = req.query.q;

  if (typeof rawQuery !== 'string' || !rawQuery.trim()) {
    return res.status(400).json({ error: "Missing or invalid query parameter 'q'" });
  }

  const searchName = rawQuery.trim().toLowerCase();

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

    console.log("🔎 Players from team", teamId, "→", players.map(p =>
      p.name || `${p.first_name || ''} ${p.last_name || ''}` || "NO_NAME"
    ));

    const matches = players.filter(player => {
      const fullName = `${player.first_name || ''} ${player.last_name || ''}`.toLowerCase();
      const displayName = (player.name || '').toLowerCase();
      return fullName.includes(searchName) || displayName.includes(searchName);
    });

    if (matches.length === 0) {
      return res.status(404).json({ error: `Player '${searchName}' not found on team.` });
    }

    const match = matches[0];

    let stats = {};
    try {
      const statsRes = await axios.get(`https://therundown-therundown-v1.p.rapidapi.com/v2/teams/${teamId}/players/stats`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'therundown-therundown-v1.p.rapidapi.com'
        }
      });

      stats = statsRes.data.players?.find(p =>
        p.participant_id === match.participant_id
      )?.statistics || {};
    } catch (err) {
      console.warn(`⚠️ Stats not found for player '${searchName}'`);
    }

    res.json({
      results: [
        {
          id: match.participant_id,
          name: match.name || `${match.first_name} ${match.last_name}`,
          team_id: teamId,
          stats
        }
      ]
    });

  } catch (error) {
    console.error("❌ Search failed:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
