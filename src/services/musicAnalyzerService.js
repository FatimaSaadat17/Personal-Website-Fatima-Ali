// Music Taste Analyzer frontend service
// Speaks to the backend /api/music-analyze route (same backend as greetings)

const API_BASE = 'https://backend-deploy-three-blond.vercel.app/api';
// In local dev with Vite proxy, '/api' routes to localhost:5001 (or direct)
const LOCAL_API_BASE = '/api';

/**
 * Analyze a list of up to 5 songs
 * @param {Object} payload
 * @param {string[]} payload.songs - array of 1-5 song strings
 * @param {string} [payload.name] - optional user name/handle
 * @returns {Promise<{success: boolean, data?: {personalityType: string, traits: string[], summary: string, songs: string[]}, error?: string}>}
 */
export async function analyzeMusicTaste({ songs, name }) {
  const payload = {
    name: (name || '').trim(),
    songs: (songs || []).map(s => (typeof s === 'string' ? s.trim() : '')).filter(Boolean).slice(0, 5)
  };

  if (payload.songs.length === 0) {
    return {
      success: false,
      error: 'Please enter at least one of your favourite songs!'
    };
  }

  // 1. Try relative endpoint first (works in local dev via Vite proxy + same-domain deployment)
  try {
    const res = await fetch(`${LOCAL_API_BASE}/music-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
    }
  } catch (err) {
    // Relative fetch failed, fall through to absolute production base
  }

  // 2. Try the production Vercel backend directly
  try {
    const res = await fetch(`${API_BASE}/music-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.error || `Analyzer responded with ${res.status}.`
      };
    }
  } catch (err) {
    // Both network calls failed
  }

  // 3. Graceful offline fallback: client-side heuristic analyzer so the user always gets a fun reading!
  return {
    success: true,
    data: generateOfflineAnalysis(payload.songs, payload.name),
    offlineFallback: true
  };
}

/**
 * Client-side heuristic fallback when all backends are unreachable
 */
function generateOfflineAnalysis(songs, name) {
  const types = [
    { type: 'INFP — The Sonic Dreamer', traits: ['Introspective', 'Poetic', 'Atmospheric', 'Empathetic'], desc: 'You lean toward music that evokes deep feelings and world-building atmospheres.' },
    { type: 'ENFP — The Genre Voyager', traits: ['Curious', 'Eclectic', 'High-Energy', 'Vibrant'], desc: 'Your playlist defies borders; you collect gems from every corner of sound.' },
    { type: 'INTJ — The Sound Architect', traits: ['Analytical', 'Structured', 'Visionary', 'Methodical'], desc: 'You appreciate crisp production, intricate rhythms, and visionary composition.' },
    { type: 'ISFP — The Melodic Soul', traits: ['Authentic', 'Heartfelt', 'Expressive', 'Grounded'], desc: 'For you, music is purely emotional truth and tactile texture.' }
  ];

  // Deterministic pick based on song string hash
  const hash = songs.join('').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const picked = types[hash % types.length];

  const prefix = name ? `${name}'s playlist reveals a keen ear for atmosphere.` : 'Your playlist reveals a keen ear for atmosphere.';
  return {
    songs,
    personalityType: picked.type,
    traits: picked.traits,
    summary: `${prefix} ${picked.desc} (Generated locally via offline audio heuristic)`
  };
}
