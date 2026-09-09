import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { CheckCircle2, Layers, Cpu, Code2, Wrench } from 'lucide-react';

export default function SkillsSection() {
  const { skills } = portfolioData;

  const categoryIcons = {
    'AI & Machine Learning': Cpu,
    'Programming Languages': Code2,
    'Web & Full-Stack': Layers,
    'Current Skill Tracks': Wrench
  };

  return (
    <div className="section-body skills-body">
      <div className="section-intro-bar">
        <div>
          <h2 className="section-title">Technical Skillset & Proficiencies</h2>
          <p className="section-desc">Tools, machine learning architectures, frameworks, and core foundations.</p>
        </div>
      </div>

      <div className="skills-grid">
        {skills.categories.map((cat, idx) => {
          const IconComp = categoryIcons[cat.name] || Layers;
          return (
            <div key={idx} className="skill-category-card" style={{ '--cat-color': cat.color }}>
              <div className="skill-cat-header">
                <div className="skill-cat-icon">
                  <IconComp size={18} />
                </div>
                <h3 className="skill-cat-title">{cat.name}</h3>
              </div>

              <div className="skill-items-list">
                {cat.skills.map((sk, sIdx) => (
                  <div key={sIdx} className="skill-item-row">
                    <div className="skill-item-info">
                      <span className="skill-dot" />
                      <span className="skill-name">{sk.name}</span>
                    </div>
                    <span className="skill-level-badge">{sk.level}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
