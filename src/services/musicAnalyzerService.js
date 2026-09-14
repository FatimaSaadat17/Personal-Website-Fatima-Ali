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
    {
      type: 'INFP — The Ethereal Dreamer',
      traits: ['Introspective', 'Poetic', 'Atmospheric', 'Overthinking'],
      percentages: [
        { label: 'Performative Melodrama', value: 45 },
        { label: 'Main Character Energy', value: 35 },
        { label: 'Nostalgia Factor', value: 20 }
      ],
      desc: 'Oh, wow, you definitely love staring out rain-streaked windows pretending you are the tragic protagonist in an indie movie.'
    },
    {
      type: 'ENFP — The Performative Aux Dictator',
      traits: ['Eclectic', 'Curious', 'High-Energy', 'Unfiltered'],
      percentages: [
        { label: 'Aux Hijacking Urge', value: 50 },
        { label: 'Chaotic Genre Jumping', value: 30 },
        { label: 'Dopamine Chasing', value: 20 }
      ],
      desc: 'You refuse to let anyone else touch the aux because you have convinced yourself only your curated vibe can save the room.'
    },
    {
      type: 'ISFP — The Unrecovered Emo Elite',
      traits: ['Side-swept bangs at heart', 'Weaponized nostalgia', 'Vulnerable', 'Dramatic'],
      percentages: [
        { label: 'Eyeliner Smudge Factor', value: 45 },
        { label: 'Undying 2006 Nostalgia', value: 35 },
        { label: 'Emotional Release', value: 20 }
      ],
      desc: 'Wow, you are so deeply emo! You treat minor inconveniences like an acoustic breakdown and probably still consider marching band drums a personal attack.'
    },
    {
      type: 'INTJ — The Pretentious Sound Architect',
      traits: ['Analytical', 'Visionary', 'Polyrhythm fan', 'Headphone snob'],
      percentages: [
        { label: 'Audio Snobbery', value: 40 },
        { label: 'Over-analyzing Mixing', value: 35 },
        { label: 'Earbud Disdain', value: 25 }
      ],
      desc: 'You do not just listen to music—you judge the panning, mixing, and frequency balance. You probably tell people they need lossless FLAC files.'
    },
    {
      type: 'INFJ — The 2AM Ceiling Stare Specialist',
      traits: ['Soulful', 'A24 aesthetic', 'Quiet intensity', 'Deep thinker'],
      percentages: [
        { label: 'A24 Sadness Lifestyle', value: 50 },
        { label: 'Late Night Overthinking', value: 30 },
        { label: 'Secret Romantic', value: 20 }
      ],
      desc: 'Oh, so sadness is a full-time aesthetic now? Your music selections are so moody that your houseplants are asking for therapy.'
    }
  ];

  // Deterministic pick based on song string hash
  const hash = songs.join('').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const picked = types[hash % types.length];

  const prefix = name ? `For ${name}: ` : '';
  return {
    songs,
    personalityType: picked.type,
    traits: picked.traits,
    percentages: picked.percentages,
    summary: `${prefix}${picked.desc}`
  };
}
