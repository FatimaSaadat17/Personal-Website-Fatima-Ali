import { portfolioData } from '../data/portfolioData';

const API_BASE = 'https://backend-deploy-three-blond.vercel.app/api';

const LOCAL_STORAGE_KEY = 'floppy_disk_greetings_v1';

/**
 * Check if backend is reachable
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      return { online: true, ...data };
    }
  } catch (err) {
    // Backend offline
  }
  return { online: false };
}

/**
 * Fetch all greetings (tries backend first, falls back to localStorage)
 */
export async function fetchGreetings() {
  try {
    const res = await fetch(`${API_BASE}/greetings`, { method: 'GET', cache: 'no-cache' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return { greetings: json.data, source: 'backend' };
      }
    }
  } catch (err) {
    // Backend unreachable, fallback to localStorage
  }

  // LocalStorage fallback
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { greetings: parsed, source: 'local' };
      }
    }
  } catch (err) {
    console.warn('LocalStorage read error:', err);
  }

  // Default initial greetings
  const initial = portfolioData.initialGreetings || [];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {}

  return { greetings: initial, source: 'local' };
}

/**
 * Send a new greeting (tries backend first, falls back to localStorage)
 */
export async function sendGreeting({ name, email, message, stamp }) {
  const payload = {
    name: name.trim(),
    email: (email || '').trim(),
    message: message.trim(),
    stamp: stamp || '💌',
  };

  try {
    const res = await fetch(`${API_BASE}/greetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        return { success: true, greeting: json.data, source: 'backend' };
      }
    }
  } catch (err) {
    // Backend offline, fallback to local storage
  }

  // Fallback to local storage
  const newGreeting = {
    id: 'local-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    ...payload,
    timestamp: new Date().toISOString()
  };

  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list = existingStr ? JSON.parse(existingStr) : (portfolioData.initialGreetings || []);
    list.unshift(newGreeting);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }

  return { success: true, greeting: newGreeting, source: 'local' };
}
