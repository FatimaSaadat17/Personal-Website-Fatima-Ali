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
      // Backend returned an explicit error (e.g. 503 offline)
      if (!json.success && json.error) {
        return { success: false, error: json.error };
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
      if (!json.success && json.error) {
        return { success: false, error: json.error };
      }
    }
  } catch (err) {
    // Both network calls failed
  }

  // NO offline fallback — the analysis must be AI-generated.
  // Show an honest error instead of canned archetypes.
  return {
    success: false,
    error: 'Could not reach the AI music analyzer. Please check your connection and try again.'
  };
}
