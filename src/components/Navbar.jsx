import React from 'react';
import { Sparkles, Terminal, HardDrive } from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'about', label: 'About me <3', color: '#c6ddaa' },
    { id: 'projects', label: 'Projects', color: '#aad9dd' },
    { id: 'skills', label: 'Skills', color: '#f3cf73' },
    { id: 'greetings', label: 'Send a Greeting!', color: '#da91a3' }
  ];

  return (
    <header className="portfolio-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-badge">
            <HardDrive size={18} className="brand-icon" />
            <span className="brand-label">FATIMA SAADAT ALI</span>
          </div>
          <span className="brand-subtitle">CS @ UoBD // 3.5" DISK ARCHIVE</span>
        </div>

        <nav className="navbar-links">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`nav-link-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                '--tab-color': tab.color
              }}
            >
              <span className="nav-dot" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
