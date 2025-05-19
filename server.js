// server.js
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// 1) Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2) GET endpoint: fetch saved favorites
app.get('/api/favorites', async (req, res) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3) POST endpoint: save a new favorite city
app.post('/api/favorites', async (req, res) => {
  const { city, lat, lon } = req.body;
  const { data, error } = await supabase
    .from('favorites')
    .insert({ city, latitude: lat, longitude: lon });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 4) (Optional) External‑data endpoint: e.g. pull and clean a weather API for your front end
app.get('/api/cleaned-forecast', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_KEY;
  const resp = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`
  );
  if (!resp.ok) return res.status(502).send('Upstream error');
  const json = await resp.json();
  // e.g. only return day1–day5
  res.json(json.daily.slice(1, 6));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
