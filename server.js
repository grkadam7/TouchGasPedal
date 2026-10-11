import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Initialize models
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PRIMARY_MODEL = process.env.MODEL_NAME || 'gemma-4-26b-a4b-it';
const FALLBACK_MODEL = 'gemini-2.5-flash';

// System instruction for route generation
const SYSTEM_PROMPT = `You are TouchGasPedal AI — an expert local driving route curator who helps people discover amazing drives.

Your job is to suggest personalized driving routes based on the user's mood, available time, and starting location.
Your suggestions should encourage real-world exploration, getting away from screens, and enjoying the open road.
Include interesting stops, scenic viewpoints, food spots, and fun mini-challenges that make the drive an adventure.

IMPORTANT RULES:
- Suggest REAL places, roads, and landmarks near the user's location
- Keep routes practical and safe
- Mini-challenges should be things you do OUTSIDE the car at stops (not while driving)
- Respond with ONLY valid JSON, no markdown, no code fences, no extra text`;

// Helper to generate with fallback
async function generateRouteWithGemma(prompt) {
  const tryModel = async (modelName) => {
    const m = genAI.getGenerativeModel({ model: modelName });
    const result = await m.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    });
    return result.response.text();
  };

  try {
    return await tryModel(PRIMARY_MODEL);
  } catch (err) {
    console.warn(`Primary model (${PRIMARY_MODEL}) failed:`, err.message, `- Falling back to ${FALLBACK_MODEL}`);
    return await tryModel(FALLBACK_MODEL);
  }
}

// Route suggestion endpoint
app.post('/api/suggest-drive', async (req, res) => {
  try {
    const { mood, duration, location } = req.body;

    if (!mood || !duration || !location) {
      return res.status(400).json({
        error: 'Missing required fields: mood, duration, location'
      });
    }

    const userPrompt = `Suggest a driving route for me.

**My Mood:** ${mood}
**Available Time:** ${duration}
**Starting Location:** ${location}

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "routeName": "A creative, catchy name for this route",
  "tagline": "A short, exciting one-liner about this drive",
  "description": "2-3 sentences describing the overall vibe and experience of this drive",
  "vibes": ["3-5 mood tags"],
  "estimatedDuration": "e.g. 1.5 hours",
  "estimatedDistance": "e.g. 45 km",
  "difficulty": "Easy or Moderate or Challenging",
  "bestTimeOfDay": "e.g. Golden hour, 5-7 PM",
  "route": {
    "summary": "Brief overview of the route path, naming key roads",
    "startPoint": "Starting location name",
    "endPoint": "Where the route ends (can be same as start for loops)"
  },
  "stops": [
    {
      "order": 1,
      "name": "Stop name",
      "description": "Why this stop is worth it (1-2 sentences)",
      "duration": "Suggested time to spend e.g. 15 min",
      "type": "viewpoint or food or nature or landmark or photo-op or activity",
      "tip": "A specific insider tip for this stop"
    }
  ],
  "miniChallenges": [
    {
      "emoji": "relevant emoji",
      "title": "Challenge title",
      "description": "What to do at a stop (never while driving!)",
      "points": 10
    }
  ],
  "safetyTip": "One important driving safety reminder for this route",
  "playlistMood": "Suggested music genre or vibe for the drive",
  "funFact": "An interesting or surprising fact about the area or route"
}`;

    const responseText = await generateRouteWithGemma(userPrompt);

    // Parse and validate JSON robustly
    let routeData;
    try {
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('No valid JSON braces found');
      }
      const jsonString = responseText.substring(firstBrace, lastBrace + 1);
      routeData = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('Failed to parse Gemma response:', responseText);
      return res.status(500).json({
        error: 'AI returned an invalid response. Please try again!'
      });
    }

    res.json({ success: true, route: routeData });

  } catch (err) {
    console.error('Error generating route:', err.message);

    if (err.message?.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid API key. Check your GEMINI_API_KEY in .env'
      });
    }

    res.status(500).json({
      error: 'Something went wrong generating your route. Please try again!'
    });
  }
});

// Fallback: serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ⛽ TouchGasPedal is running!`);
  console.log(`  🚗 Open http://localhost:${PORT} in your browser\n`);
});
