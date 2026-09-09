import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FloppyStack from './components/FloppyStack';
import { HardDrive, Sparkles, Terminal } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('about');

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    // Smooth scroll to floppy stack
    const el = document.getElementById(`disk-${tabId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="portfolio-app">
      {/* Top Sticky Navigation */}
      <Navbar activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Main Floppy Disk Accordion Stack */}
      <FloppyStack activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Footer */}
      <footer className="portfolio-footer">
        <div className="footer-bmo-badge">
          <Terminal size={13} />
          <span>3.5" DISK FORMAT • FATIMA SAADAT ALI</span>
        </div>
        <p>© {new Date().getFullYear()} Fatima Saadat Ali • University of Birmingham Dubai</p>
      </footer>
    </div>
  );
}
