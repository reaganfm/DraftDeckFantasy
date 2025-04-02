require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('DraftDeck API is running!');
});

app.get('/api/players', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://therundown-therundown-v1.p.rapidapi.com/v2/events/36902502fd7a5ea0d1f9fe8b5b4465de',
        params: {
            participant_ids: '9598,8616,9615,9560,13003614,9184,9136,8442,8644,5026,9415,13001624,13005448,9654,33672,8688,8478,8493,8694,8910,8592,9218,9510,8595,7903,9427,8634,13001682,9600,7099,9483,8661,8613,8546,7153,7789,17274,9433,13006308,7580,5220,8341,9480,8691,13005847,7956,13005454,9992,8466,9469',
            participant_type: 'TYPE_PLAYER',
            market_ids: '39,49,51,52,53,55,56,57,58,60,286,287'
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'therundown-therundown-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error fetching player data from Rundown API' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
