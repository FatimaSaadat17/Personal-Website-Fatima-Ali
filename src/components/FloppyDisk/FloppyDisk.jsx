import React from 'react';
import { playHoverTick, playDiskInsertSound } from '../../utils/soundEffects';
import './FloppyDisk.css';

export default function FloppyDisk({
  id,
  title,
  color,
  serialNumber = 'S/N 123456789',
  isActive,
  onSelect,
  children,
  zIndex = 1,
  index = 0,
  stackPosition = 'stacked' // 'above', 'active', 'below'
}) {
  const handleClick = (e) => {
    if (!isActive) {
      playDiskInsertSound();
      onSelect(id);
    }
  };

  const handleMouseEnter = () => {
    if (!isActive) {
      playHoverTick();
    }
  };

  return (
    <article
      id={`disk-${id}`}
      className={`floppy-disk-card ${isActive ? 'is-active' : 'is-stacked'} pos-${stackPosition}`}
      style={{
        '--disk-bg': color,
        '--disk-z': zIndex,
        '--disk-idx': index
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      aria-expanded={isActive}
      role="region"
      aria-label={`Floppy Disk: ${title}`}
    >
      {/* 3.5" Floppy Disk Shell */}
      <div className="floppy-shell-body">
        {/* Top-left authentic 45-degree chamfer cut */}
        <div className="floppy-chamfer-notch" />

        {/* Top Hardware Section: Left Tab, Sliding Metal Shutter, Spindle Hub, Right Grip */}
        <header className="floppy-top-hardware">
          {/* Left Vertical Tab / Section Title */}
          <div className="floppy-left-tab">
            <div className="tab-status-dot" />
            <h2 className="floppy-tab-title">{title}</h2>
            {!isActive && <span className="tab-open-badge">CLICK TO PROP UP ▾</span>}
          </div>

          {/* Metal Sliding Shutter */}
          <div className="floppy-metal-slider">
            <div className="metal-shutter-plate">
              <div className="shutter-pin-hole" />
              <div className="shutter-media-aperture">
                <div className="magnetic-disk-spindle">
                  <div className="spindle-hub-center" />
                  <div className="spindle-notch" />
                </div>
              </div>
              <div className="shutter-arrow-label">▲ INSERT</div>
            </div>
          </div>

          {/* Right Tactile Finger Grips */}
          <div className="floppy-right-grips">
            <div className="grip-bar" />
            <div className="grip-bar" />
            <div className="grip-bar" />
            <div className="grip-bar" />
            <div className="grip-bar" />
          </div>
        </header>

        {/* Center Disk Content Canvas / Label Window */}
        <div className="floppy-main-window">
          <div className="floppy-window-inner">
            {children}
          </div>
        </div>

        {/* Floppy Disk Footer Label Sticker */}
        <footer className="floppy-footer-label">
          <div className="write-protect-window left" />
          <div className="floppy-sticker-strip">
            <div className="sticker-meta-left">
              <span className="sticker-title">3.5" DISK FORMAT</span>
              <span className="sticker-specs">HD • 1.44 MB • SECTOR {index + 1}</span>
            </div>
            <span className="sticker-serial-number">{serialNumber}</span>
          </div>
          <div className="write-protect-window right" />
        </footer>
      </div>
    </article>
  );
}
