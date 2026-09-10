import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { ExternalLink, Terminal, BookOpen, GraduationCap, MapPin, Cpu } from 'lucide-react';

export default function AboutSection() {
  const { profile } = portfolioData;

  return (
    <div className="section-body about-body">
      {/* Top ASCII Art Graphic Frame (matches Figma node 4:75) */}
      <div className="ascii-frame-container">
        <div className="ascii-frame-header">
          <span className="ascii-title">PORTRAIT_RAW_ASCII.IMG</span>
          <span className="ascii-dims">1440 x 720 [SECTOR 0x04]</span>
        </div>
        <div className="ascii-art-wrapper">
          <img 
            src="/figma_node_4_75.png" 
            alt="Fatima Saadat Ali ASCII Art Portrait" 
            className="ascii-portrait-image"
          />
          <div className="ascii-scanline-overlay" />
        </div>
      </div>

      {/* Profile Bio Details */}
      <div className="about-details-grid">
        <div className="bio-card">
          <div className="bio-header">
            <h2 className="bio-name">{profile.name}</h2>
            <div className="bio-meta-tags">
              <span className="meta-tag"><GraduationCap size={14} /> {profile.university}</span>
              <span className="meta-tag"><MapPin size={14} /> {profile.location}</span>
              <span className="meta-tag highlight"><Cpu size={14} /> {profile.year}</span>
            </div>
          </div>

          <p className="bio-tagline">{profile.tagline}</p>

          <div className="bio-paragraphs">
            {profile.bio.map((para, i) => (
              <p key={i} className="bio-text">{para}</p>
            ))}
          </div>

          <div className="stats-strip">
            {profile.stats.map((st, i) => (
              <div key={i} className="stat-pill">
                <span className="stat-label">{st.label}:</span>
                <span className="stat-val">{st.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Highlights / Focus Card */}
        <div className="focus-card">
          <h3 className="card-subtitle"><Terminal size={16} /> 💛 CONTACTS AND SOCIALS </h3>
          
          <div className="focus-item">
            <div className="focus-indicator" style={{ background: '#97D2D9' }} />
            <div>
              <strong>GitHub</strong>
              <a href="https://github.com/FatimaSaadat17">https://github.com/FatimaSaadat17</a>
            </div>
          </div>

          <div className="focus-item">
            <div className="focus-indicator" style={{ background: '#EFC96A' }} />
            <div>
              <strong>LinkedIn</strong>
              <a href="https://linkedin.com">https://linkedin.com</a>
            </div>
          </div>

          <div className="focus-item">
            <div className="focus-indicator" style={{ background: '#D98296' }} />
            <div>
              <strong>Email</strong>
              <p>fsaadat917@proton.me   fsaadat917@gmail.com   fsa463@student.bham.ac.uk</p>
            </div>
          </div>

          <div className="focus-item">
            <div className="focus-indicator" style={{ background: '#9f82d9' }} />
            <div>
              <strong>Hyperfixations</strong>
              <p>3D Printing, Journaling with Hobonichis and Buying useless trinkets I'll definetly never end up using ;0 </p>
            </div>
          </div>

          
          <div className="focus-item">
            <div className="focus-indicator" style={{ background: '#637d69' }} />
            <div>
              <strong>Work Experience</strong>
              <ul>
                  <li>AI Engineer at NectarSearch.ae</li>
                  <li>Co-lead at UoBD Computing Club</li>
                  <li>Outreach Officer at ACM UoBD</li>
                  <li>Founding Engineer at Murtabit</li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
