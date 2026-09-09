import React, { useState } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { ExternalLink, Code2, Sparkles, FolderGit2, ArrowUpRight } from 'lucide-react';

export default function ProjectsSection() {
  const { projects } = portfolioData;
  const [activeFilter, setActiveFilter] = useState('ALL');

  const categories = ['ALL', 'Cheminformatics & AI', 'Quantitative Finance', 'Full Stack App', 'Game Dev'];

  const filtered = activeFilter === 'ALL'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="section-body projects-body">
      <div className="section-intro-bar">
        <div>
          <h2 className="section-title">Selected Projects & Research</h2>
          <p className="section-desc">Interactive research codebases, deep learning models, and software creations.</p>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filtered.map(proj => (
          <div key={proj.id} className="project-card" style={{ '--accent-color': proj.color }}>
            <div className="project-card-header">
              <div className="project-category-badge">
                <FolderGit2 size={13} />
                <span>{proj.category}</span>
              </div>
              {proj.badge && <span className="project-badge">{proj.badge}</span>}
            </div>

            <h3 className="project-title">{proj.title}</h3>
            <p className="project-desc">{proj.description}</p>

            <div className="project-tags">
              {proj.tags.map(tag => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>

            <div className="project-actions">
              {proj.links.code && (
                <a href={proj.links.code} target="_blank" rel="noreferrer" className="proj-link-btn">
                  <Code2 size={15} /> Source Code
                </a>
              )}
              {proj.links.demo && (
                <a href={proj.links.demo} target="_blank" rel="noreferrer" className="proj-link-btn primary">
                  Live Preview <ArrowUpRight size={14} />
                </a>
              )}
              {proj.links.paper && (
                <a href={proj.links.paper} target="_blank" rel="noreferrer" className="proj-link-btn primary">
                  Read Notes <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
