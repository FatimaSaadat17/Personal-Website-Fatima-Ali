import React, { useState } from 'react';
import { analyzeMusicTaste } from '../../services/musicAnalyzerService';
import {
  Music,
  Sparkles,
  Disc3,
  Flame,
  User,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Wand2
} from 'lucide-react';

const PRESET_TRACKS = [
  ['Nujabes - Feather', 'Radiohead - Weird Fishes', 'Tame Impala - Let It Happen', 'Daft Punk - Digital Love', 'Mac Miller - Good News'],
  ['Tyler, The Creator - EARFQUAKE', 'Frank Ocean - Nights', 'Kendrick Lamar - Alright', 'SZA - Snooze', 'Childish Gambino - Redbone'],
  ['Deftones - Rosemary', 'Slowdive - Alison', 'Cocteau Twins - Cherry-coloured Funk', 'My Bloody Valentine - When You Sleep', 'Whirr - Flashbacks'],
  ['Chopin - Nocturne Op.9 No.2', 'Debussy - Clair de Lune', 'Max Richter - On the Nature of Daylight', 'Ludovico Einaudi - Nuvole Bianche', 'Ravel - Pavane']
];

export default function MusicTasteAnalyzerSection() {
  const [name, setName] = useState('');
  const [songs, setSongs] = useState(['', '', '', '', '']);
  const [status, setStatus] = useState({ loading: false, error: null });
  const [result, setResult] = useState(null);

  const handleSongChange = (idx, value) => {
    const updated = [...songs];
    updated[idx] = value;
    setSongs(updated);
  };

  const handlePreset = (idx) => {
    const preset = PRESET_TRACKS[idx];
    if (preset) {
      setSongs([...preset]);
      setResult(null);
      setStatus({ loading: false, error: null });
    }
  };

  const handleReset = () => {
    setSongs(['', '', '', '', '']);
    setName('');
    setResult(null);
    setStatus({ loading: false, error: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filled = songs.map(s => s.trim()).filter(Boolean);

    if (filled.length === 0) {
      setStatus({ loading: false, error: 'Please enter at least one song title!' });
      return;
    }

    setStatus({ loading: true, error: null });
    setResult(null);

    try {
      const res = await analyzeMusicTaste({ songs: filled, name });
      if (res.success && res.data) {
        setResult(res.data);
        setStatus({ loading: false, error: null });
      } else {
        setStatus({
          loading: false,
          error: res.error || 'Failed to analyze tracks. Please try again.'
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        error: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const filledCount = songs.filter(s => s.trim().length > 0).length;

  return (
    <div className="section-body music-analyzer-body">
      <div className="section-intro-bar">
        <div>
          <h2 className="section-title">Music Taste Analyzer</h2>
          <p className="section-desc">
            Feed this floppy disk 5 of your favourite tracks. Our Hermes AI agent decodes your acoustic DNA to reveal your personality archetype, dominant traits, and sonic summary.
          </p>
        </div>
      </div>

      <div className="music-analyzer-grid">
        {/* Input Form Column */}
        <div className="music-form-card">
          <div className="music-card-header">
            <h3 className="card-subtitle">
              <Music size={16} /> INPUT AUDIO SECTORS (5 TRACKS)
            </h3>
            <span className="track-counter">{filledCount}/5 TRACKS</span>
          </div>

          {/* Quick Presets */}
          <div className="preset-row">
            <span className="preset-label"><Wand2 size={12} /> Presets:</span>
            <button type="button" onClick={() => handlePreset(0)} className="preset-chip">Lo-Fi / Indie</button>
            <button type="button" onClick={() => handlePreset(1)} className="preset-chip">Neo-Soul / Rap</button>
            <button type="button" onClick={() => handlePreset(2)} className="preset-chip">Shoegaze</button>
            <button type="button" onClick={() => handlePreset(3)} className="preset-chip">Classical</button>
          </div>

          <form onSubmit={handleSubmit} className="music-form">
            <div className="form-group">
              <label htmlFor="user-name" className="form-label">
                <User size={13} /> Your Name / Handle (Optional)
              </label>
              <input
                id="user-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sonic Voyager"
                className="form-input"
              />
            </div>

            <div className="songs-inputs-group">
              <label className="form-label">
                <Disc3 size={13} /> Favourite Tracks (Title & Artist) *
              </label>

              {songs.map((song, idx) => (
                <div key={idx} className="song-input-row">
                  <span className="song-index-badge">0{idx + 1}</span>
                  <input
                    type="text"
                    value={song}
                    onChange={e => handleSongChange(idx, e.target.value)}
                    placeholder={`Track #${idx + 1} (e.g. Song Title - Artist)`}
                    className="form-input song-input"
                  />
                </div>
              ))}
            </div>

            {status.error && (
              <div className="form-msg error">
                <AlertCircle size={15} /> {status.error}
              </div>
            )}

            <div className="music-form-actions">
              <button
                type="submit"
                disabled={status.loading || filledCount === 0}
                className="submit-analyze-btn"
              >
                <Sparkles size={16} />
                <span>{status.loading ? 'DECODING ACOUSTIC DNA...' : 'ANALYZE MY TASTE'}</span>
              </button>

              {(filledCount > 0 || result) && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={status.loading}
                  className="reset-btn"
                  title="Reset tracks"
                >
                  <RotateCcw size={15} /> Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Output / Results Column */}
        <div className="music-result-card">
          <div className="result-card-header">
            <h3 className="card-subtitle">
              <Sparkles size={16} /> PERSONALITY ARCHETYPE
            </h3>
            {result && <span className="ai-badge">HERMES AGENT DECODED</span>}
          </div>

          {status.loading && (
            <div className="music-loading-state">
              <div className="retro-spinner">
                <Disc3 size={40} className="spinning-disc" />
              </div>
              <p className="loading-text">Hermes is analyzing your soundscape harmonics...</p>
              <span className="loading-subtext">Evaluating tempo, lyrics themes, and emotional cadence</span>
            </div>
          )}

          {!status.loading && !result && (
            <div className="music-empty-state">
              <div className="empty-disc-icon">
                <Music size={44} />
              </div>
              <h4 className="empty-title">Awaiting Track Input</h4>
              <p className="empty-desc">
                Fill in 5 of your favourite songs on the left (or click one of the quick presets) and click <strong>ANALYZE MY TASTE</strong> to generate your musical personality reading.
              </p>
            </div>
          )}

          {!status.loading && result && (
            <div className="music-analysis-result">
              {/* Archetype Banner */}
              <div className="archetype-banner">
                <span className="archetype-kicker">ACOUSTIC PERSONALITY TYPE</span>
                <h3 className="archetype-title">{result.personalityType}</h3>
              </div>

              {/* 4 Personality Traits Chips */}
              <div className="traits-section">
                <span className="traits-label">
                  <Flame size={13} /> DOMINANT TRAITS
                </span>
                <div className="traits-grid">
                  {(result.traits || []).map((trait, i) => (
                    <div key={i} className="trait-chip">
                      <span className="trait-dot" />
                      <span className="trait-name">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sonic Personality Summary */}
              <div className="summary-section">
                <span className="summary-label">
                  <Sparkles size={13} /> SONIC PROFILE SUMMARY
                </span>
                <p className="summary-text">{result.summary}</p>
              </div>

              {/* Analyzed Tracklist Footnote */}
              <div className="analyzed-tracks-list">
                <span className="tracks-footnote-title">Tracks in this reading:</span>
                <ul>
                  {(result.songs || []).map((s, idx) => (
                    <li key={idx}>0{idx + 1}. {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
