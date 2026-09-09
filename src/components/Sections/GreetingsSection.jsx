import React, { useState, useEffect, useRef } from 'react';
import { sendGreeting, fetchGreetings, checkBackendHealth } from '../../services/greetingService';
import { Send, CheckCircle, Clock, Server, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export default function GreetingsSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    stamp: '💌'
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [greetingsList, setGreetingsList] = useState([]);
  const [backendInfo, setBackendInfo] = useState({ checking: true, online: false });
  const streamRef = useRef(null);

  const stamps = ['💌', '⭐', '🎸', '🥞', '🤖', '💻', '🌸', '✨'];

  useEffect(() => {
    loadData();
    verifyBackend();
  }, []);

  // Auto-scroll to bottom when greetings list changes (new entry added)
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [greetingsList]);

  async function verifyBackend() {
    setBackendInfo(prev => ({ ...prev, checking: true }));
    const health = await checkBackendHealth();
    setBackendInfo({ checking: false, online: health.online });
  }

  async function loadData() {
    const res = await fetchGreetings();
    setGreetingsList(res.greetings);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setStatus({ loading: false, success: false, error: 'Please enter your name and message!' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const result = await sendGreeting(formData);
      if (result.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', message: '', stamp: '💌' });
        // Reload list
        loadData();
        setTimeout(() => {
          setStatus(prev => ({ ...prev, success: false }));
        }, 4000);
      } else {
        setStatus({ loading: false, success: false, error: 'Failed to write greeting.' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Error sending message.' });
    }
  }

  return (
    <div className="section-body greetings-body">
      <div className="section-intro-bar">
        <div>
          <h2 className="section-title">Send a Greeting!</h2>
          <p className="section-desc">Drop a friendly note, collaboration request, or feedback into this floppy disk sector.</p>
        </div>
      </div>

      <div className="greetings-layout-grid">
        {/* Form Column */}
        <div className="greeting-form-card">
          <h3 className="card-subtitle"><MessageSquare size={16} /> COMPOSE GREETING</h3>

          <form onSubmit={handleSubmit} className="greeting-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Your Name / Handle *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Pork (yes that guy)"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address (Optional)</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. john_pork@outlook.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pick a Stamp</label>
              <div className="stamps-row">
                {stamps.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setFormData({ ...formData, stamp: s })}
                    className={`stamp-btn ${formData.stamp === s ? 'selected' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message *</label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your greeting here..."
                required
                className="form-textarea"
              />
            </div>

            {status.error && (
              <div className="form-msg error">
                <AlertCircle size={15} /> {status.error}
              </div>
            )}

            {status.success && (
              <div className="form-msg success">
                <CheckCircle size={15} /> Greeting saved to disk sector successfully!
              </div>
            )}

            <button type="submit" disabled={status.loading} className="submit-greeting-btn">
              <Send size={15} />
              <span>{status.loading ? 'WRITING TO SECTOR...' : 'WRITE TO FLOPPY DISK'}</span>
            </button>
          </form>
        </div>

        {/* Guestbook List Column */}
        <div className="greetings-feed-card">
          <div className="feed-header">
            <h3 className="card-subtitle"><Sparkles size={16} /> GUESTBOOK ARCHIVE</h3>
            <span className="feed-count">{greetingsList.length} Entries</span>
          </div>

          <div className="greetings-stream" ref={streamRef}>
            {greetingsList.map((g, idx) => (
              <div key={g.id || idx} className="greeting-entry-card">
                <div className="greeting-top">
                  <div className="greeting-author-wrap">
                    <span className="greeting-stamp">{g.stamp || '💌'}</span>
                    <strong className="greeting-author">{g.name}</strong>
                  </div>
                  <span className="greeting-time">
                    <Clock size={11} /> {new Date(g.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="greeting-msg">{g.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}