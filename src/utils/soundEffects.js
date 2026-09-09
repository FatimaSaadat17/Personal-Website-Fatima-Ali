// Synthesized retro floppy disk sound effects using Web Audio API

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a subtle tactile mechanical tick on hover
 */
export function playHoverTick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

/**
 * Play an authentic floppy disk insertion/eject click when a disk props up
 */
export function playDiskInsertSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Layer 1: Metal shutter slide click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(800, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

    gain1.gain.setValueAtTime(0.04, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start();
    osc1.stop(ctx.currentTime + 0.08);

    // Layer 2: Mechanical latch click (50ms delay)
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(220, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.06);

        gain2.gain.setValueAtTime(0.06, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start();
        osc2.stop(ctx.currentTime + 0.06);
      } catch (err) {}
    }, 45);
  } catch (e) {}
}
