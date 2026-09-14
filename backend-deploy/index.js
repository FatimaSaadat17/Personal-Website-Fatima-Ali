import express from 'express';
import cors from 'cors';

const app = express();

// CORS - origins allowed to call this API
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  // >>> ADD ANY OTHER DEPLOYED FRONTEND URLS HERE <<<
  'https://personal-website-fatima-ali.vercel.app',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ------------------------------------------------------------------
// Persistence: Upstash KV (REST API) — durable across Vercel's
// stateless serverless functions.
//
// Required env vars (set in Vercel project / .env for local dev):
//   UPSTASH_REDIS_REST_URL   e.g. https://xxxx.upstash.io
//   UPSTASH_REDIS_REST_TOKEN e.g. AYbXxxxx
//
// Fallback: if env vars are missing, we serve from an in-memory seed
// (single deployment). Prefer Upstash so greetings persist.
// ------------------------------------------------------------------
const KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const KV_KEY = 'floppy_disk_greetings_v1';

const SEED_GREETINGS = [
  {
    id: 'g-1',
    name: 'Finn the Human',
    email: 'finn@treefort.local',
    message: 'Mathematical! Love the floppy disk design, Fatima!',
    stamp: '⭐',
    timestamp: new Date().toISOString()
  },
  {
    id: 'g-2',
    name: 'Marceline',
    email: 'marcy@cave.net',
    message: 'Pretty cool aesthetic. The ASCII portrait rocks.',
    stamp: '🎸',
    timestamp: new Date().toISOString()
  }
];

async function kvRequest(method, path = '', rawBody = null) {
  const res = await fetch(`${KV_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json'
    },
    // Upstash REST expects the raw value as the request body (no extra JSON.stringify)
    body: rawBody
  });
  if (!res.ok) {
    throw new Error(`Upstash error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function loadGreetings() {
  if (!KV_URL || !KV_TOKEN) {
    // No KV configured — serve seed data (non-persistent)
    return SEED_GREETINGS;
  }
  // Upstash REST: GET /get/<key> -> { result: "<json string>" | null }
  const data = await kvRequest('GET', `/get/${KV_KEY}`);
  let parsed = null;
  try {
    parsed = data.result ? JSON.parse(data.result) : null;
  } catch (e) {
    parsed = null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    // First run: seed the key via POST /set/<key> with body value
    await kvRequest('POST', `/set/${KV_KEY}`, JSON.stringify(SEED_GREETINGS));
    return SEED_GREETINGS;
  }
  return parsed;
}

async function saveGreetings(greetings) {
  if (!KV_URL || !KV_TOKEN) return false;
  // Upstash REST: POST /set/<key> with body value (returns { result: "OK" })
  await kvRequest('POST', `/set/${KV_KEY}`, JSON.stringify(greetings));
  return true;
}

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Floppy Disk Portfolio Greetings API',
    message: 'Backend is running. Use /api/health for detailed health check.',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Floppy Disk Portfolio Greetings API',
    storage: (KV_URL && KV_TOKEN) ? 'upstash-kv' : 'in-memory (no Upstash env vars set)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/greetings', async (req, res) => {
  try {
    const greetings = await loadGreetings();
    res.json({ success: true, count: greetings.length, data: greetings });
  } catch (err) {
    console.error('GET /api/greetings error:', err);
    res.status(500).json({ success: false, error: 'Could not load greetings.' });
  }
});

app.post('/api/greetings', async (req, res) => {
  const { name, email, message, stamp } = req.body;

  if (!name || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name and message are required fields.'
    });
  }

  const newGreeting = {
    id: 'g-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    name: name.trim().slice(0, 80),
    email: (email || '').trim().slice(0, 100),
    message: message.trim().slice(0, 1000),
    stamp: stamp || '💌',
    timestamp: new Date().toISOString()
  };

  try {
    const greetings = await loadGreetings();
    greetings.unshift(newGreeting);
    await saveGreetings(greetings);

    res.status(201).json({
      success: true,
      message: 'Greeting received and saved to floppy disk sector!',
      data: newGreeting
    });
  } catch (err) {
    console.error('POST /api/greetings error:', err);
    res.status(500).json({ success: false, error: 'Could not save greeting.' });
  }
});

app.delete('/api/greetings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const greetings = await loadGreetings();
    const initialLength = greetings.length;
    const filtered = greetings.filter(g => g.id !== id);

    if (filtered.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Greeting not found.' });
    }

    await saveGreetings(filtered);
    res.json({ success: true, message: 'Greeting removed successfully.' });
  } catch (err) {
    console.error('DELETE /api/greetings/:id error:', err);
    res.status(500).json({ success: false, error: 'Could not delete greeting.' });
  }
});

// ------------------------------------------------------------------
// Music Taste Analyzer — Multi-tier AI Engine (Vercel Serverless)
// ------------------------------------------------------------------
// Tier 1: Hermes Docker Agent API (local or tunneled)
// Tier 2: Direct Google Gemini API (remote — works on Vercel)
// No canned fallback — both tiers must generate fresh, original analysis.
// ------------------------------------------------------------------

const SYSTEM_MUSIC_PROMPT = `
You are the Music Taste Analyzer: a culturally hyper-literate, brutally perceptive, funny music critic who analyzes someone's personality ONLY through their 5 favorite songs.

Your job is NOT to give generic Spotify-personality-card clichés.
Your job is to notice the specific musical choices this person made and turn those choices into an uncannily accurate, witty personality read.

IMPORTANT:
The 5 songs are the evidence. Treat them like a psychological dataset.

Before producing the JSON, internally analyze:
- Artists and whether their choices cluster around certain artists/scenes
- Genres, subgenres, and genre combinations
- Era/year and nostalgia patterns
- Lyrics/themes: romance, heartbreak, loneliness, confidence, anger, escapism, nostalgia, etc.
- Production/style: dreamy, aggressive, polished, lo-fi, theatrical, maximalist, minimalist, danceable, melancholic, etc.
- Whether the choices are mainstream, niche, nostalgic, obscure, trendy, or deliberately eclectic
- Contrasts between the songs
- What their combination suggests that each song individually would NOT suggest
- Any obvious "aux cord" implications
- Whether they seem to choose music for emotional identification, aesthetics, social signaling, nostalgia, catharsis, dancing, or some combination

Then infer the listener's personality from the PATTERN across the songs.

GROUNDING RULES:
1. Every major claim should be traceable to at least one of the 5 songs.
2. Prefer specific observations over generic personality labels.
3. Mention actual artists, songs, genres, eras, or musical contrasts when relevant.
4. If the songs are eclectic, make the eclecticism itself part of the analysis.
5. Do NOT invent biographical facts about the listener.
6. Do NOT assume their age, gender, relationship status, job, nationality, or life experiences.
7. Do NOT use the same generic personality traits for every user.
8. Avoid empty phrases like "deep thinker", "emotionally complex", "old soul", "main character", or "you feel things deeply" unless the specific song selection makes the joke unusually accurate.
9. Humor should come from recognizing their ACTUAL music taste, not from randomly insulting them.
10. The analysis should feel like: "holy shit, how did you get that from these songs?" rather than "this could describe anyone."

PERSONALITY TYPE:
Create ONE memorable, highly specific title based on the actual music selection.

Good:
"The Person Who Says 'I Don't Listen to Pop' Then Knows Every Word"
"The 2014 Tumblr Dashboard That Somehow Became a Person"
"The Aux Cord Historian"
"The Indie Sleaze Archaeologist"
"The Emotionally Stable Person Who Keeps Selecting Emotionally Devastating Songs"

Bad:
"The Deep Thinker"
"The Romantic"
"The Music Lover"
"The Introvert"

TRAITS:
Return EXACTLY 4 traits.

Each trait must:
- Be short and punchy
- Be humorous or sharply observational
- Be grounded in the songs
- Reveal something distinct

Avoid repeating the same idea four times.

Good examples:
"Treats 2010s heartbreak like a historical period"
"Will defend this artist in court"
"Uses nostalgia as a recreational drug"
"Has never skipped the sad song on purpose"

PERCENTAGES:
Return 3 or 4 custom metrics.

These are NOT scientific measurements.
They are comedic measurements invented specifically for this listener.

Each metric:
- Must relate to the actual songs
- Must have an original label
- Must have an integer value from 1-100
- All values MUST total exactly 100
- Do not use generic metrics every time

Examples:
"2010s Nostalgia": 38
"Indie Credibility": 27
"Emotional Damage": 22
"Aux Control Issues": 13

Or, depending on the songs:
"Club-At-2AM Energy"
"Pop Music Denial"
"Sad-Girl Cinema"
"Genre Whiplash"
"Unnecessary Musical Obscurity"
"Mainstream Shame"
"Teenage Tumblr Residue"

SUMMARY:
Write 2-4 sentences.

This is the most important part.

The summary should:
- Directly reference the listener's actual song/artist choices
- Identify the strongest pattern across the playlist
- Make at least one specific observation that would NOT apply to a random playlist
- Include a witty roast
- Feel affectionate rather than hostile
- Sound like a perceptive friend who has just looked at their playlist and immediately understands them

Use specific language such as:
"Putting X next to Y tells me..."
"The fact that you chose X AND Y..."
"You really looked at these five songs and decided..."
"Your choice of X suggests..."
"The genre whiplash between X and Y is doing a lot of psychological work..."

Do NOT merely restate the traits or percentages.

CRITICAL:
If the five songs do not support a particular interpretation, DO NOT force it.
It is better to make a clever observation about musical taste than to invent a personality trait.

OUTPUT:
Return VALID JSON ONLY.
No markdown.
No commentary.
No explanation outside the JSON.

Use exactly this schema:

{
  "personalityType": "...",
  "traits": [
    "...",
    "...",
    "...",
    "..."
  ],
  "percentages": [
    {
      "label": "...",
      "value": 40
    },
    {
      "label": "...",
      "value": 30
    },
    {
      "label": "...",
      "value": 20
    },
    {
      "label": "...",
      "value": 10
    }
  ],
  "summary": "..."
}

FINAL QUALITY CHECK BEFORE OUTPUT:
- Are all 5 songs actually reflected in the analysis?
- Did you identify a pattern between songs rather than analyzing them independently?
- Are the jokes specific to THIS playlist?
- Could this exact response plausibly be given to 100 different users? If yes, rewrite it.
- Are the percentages exactly 100?
- Are there exactly 4 traits?
- Is the JSON valid?
`;

function buildMusicPrompt(songs, name) {
  const list = songs.map((s, i) => `${i + 1}. ${s}`).join('\n');
  return name && name.trim()
    ? `Name: ${name.trim()}\nFavorite songs:\n${list}`
    : `Favorite songs:\n${list}`;
}

function parseModelJson(content) {
  if (!content) throw new Error('Empty model response');
  const cleaned = content.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Response is not JSON');
  return JSON.parse(cleaned.slice(start, end + 1));
}

// Tier 1: OpenAI-compatible Hermes Agent API
async function callHermesAgentApi({ songs, name }) {
  const apiBase = (process.env.MUSIC_ANALYZER_API_URL || 'http://localhost:8642').replace(/\/+$/, '');
  const apiKey = process.env.MUSIC_ANALYZER_API_KEY || process.env.API_SERVER_KEY || '';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${apiBase}/v1/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({
        model: 'hermes-agent',
        messages: [
          { role: 'system', content: SYSTEM_MUSIC_PROMPT },
          { role: 'user', content: buildMusicPrompt(songs, name) }
        ],
        stream: false
      })
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    return parseModelJson(data?.choices?.[0]?.message?.content);
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

// Tier 2: Direct Google Gemini API (gemini-flash-lite-latest)
async function callGeminiDirectApi({ songs, name }) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('No Google/Gemini API key configured');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const promptText = `${SYSTEM_MUSIC_PROMPT}\n\n${buildMusicPrompt(songs, name)}`;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Gemini status ${res.status}`);
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return parseModelJson(rawText);
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

app.post('/api/music-analyze', async (req, res) => {
  const { songs, name } = req.body || {};

  if (!Array.isArray(songs) || songs.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide at least one song.'
    });
  }

  const cleanedSongs = songs
    .map(s => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
    .slice(0, 5);

  if (cleanedSongs.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please enter at least one song title.'
    });
  }

  const cleanName = typeof name === 'string' ? name.slice(0, 60) : '';

  // Attempt 1: Hermes Docker Agent API (works locally or via tunnel)
  try {
    const analysis = await callHermesAgentApi({ songs: cleanedSongs, name: cleanName });
    if (analysis?.personalityType) {
      return res.json({
        success: true,
        source: 'hermes-agent',
        data: {
          songs: cleanedSongs,
          personalityType: analysis.personalityType,
          traits: Array.isArray(analysis.traits) ? analysis.traits.slice(0, 4) : [],
          percentages: Array.isArray(analysis.percentages) ? analysis.percentages : [],
          summary: analysis.summary || 'Your music taste is uniquely yours.'
        }
      });
    }
  } catch (err1) {
    // Hermes agent offline / unreachable — fall through to Gemini
  }

  // Attempt 2: Direct Google Gemini API (remote — works on Vercel with GEMINI_API_KEY)
  try {
    const analysis = await callGeminiDirectApi({ songs: cleanedSongs, name: cleanName });
    if (analysis?.personalityType) {
      return res.json({
        success: true,
        source: 'gemini-direct',
        data: {
          songs: cleanedSongs,
          personalityType: analysis.personalityType,
          traits: Array.isArray(analysis.traits) ? analysis.traits.slice(0, 4) : [],
          percentages: Array.isArray(analysis.percentages) ? analysis.percentages : [],
          summary: analysis.summary || 'Your music taste is uniquely yours.'
        }
      });
    }
  } catch (err2) {
    // Gemini key absent or call failed
  }

  // NO CANNED FALLBACK — return an honest error so the frontend can tell the user.
  // The whole point is that the analysis is AI-generated, not picked from a preset list.
  return res.status(503).json({
    success: false,
    error: 'AI music analyzer is currently offline. Please try again in a moment!'
  });
});

// ------------------------------------------------------------------
// Vercel serverless export (no app.listen — Vercel invokes the handler)
// ------------------------------------------------------------------
export default app;
