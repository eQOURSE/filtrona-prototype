/**
 * Sound effects for gamified quiz modes.
 * Uses Web Audio API to synthesize short tones — no asset files needed.
 * All sounds are < 300ms and low volume (gain 0.08).
 */

let audioCtx: AudioContext | null = null;
let _muted = false;

// Hydrate mute preference from localStorage
if (typeof window !== "undefined") {
  try {
    _muted = localStorage.getItem("filtrona-quiz-sound") === "muted";
  } catch {
    /* no-op */
  }
}

export function isMuted(): boolean {
  return _muted;
}

export function toggleMute(): boolean {
  _muted = !_muted;
  try {
    localStorage.setItem("filtrona-quiz-sound", _muted ? "muted" : "on");
  } catch {
    /* no-op */
  }
  return _muted;
}

function getCtx(): AudioContext | null {
  if (_muted) return null;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playTone(
  freq: number,
  duration: number,
  startOffset: number,
  gain: number,
  type: OscillatorType = "sine"
) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  // Fade out at the end
  g.gain.setValueAtTime(gain, ctx.currentTime + startOffset);
  g.gain.linearRampToValueAtTime(
    0,
    ctx.currentTime + startOffset + duration
  );
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration);
}

/** Rising 2-note chime on correct answer */
export function playCorrect() {
  try {
    playTone(880, 0.12, 0, 0.08, "sine");
    playTone(1320, 0.15, 0.1, 0.08, "sine");
  } catch {
    /* no-op */
  }
}

/** Descending tone on wrong answer */
export function playWrong() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.25);
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    /* no-op */
  }
}

/** 3-note arpeggio on streak milestone */
export function playStreakUp() {
  try {
    playTone(660, 0.1, 0, 0.08, "triangle");
    playTone(880, 0.1, 0.08, 0.08, "triangle");
    playTone(1100, 0.15, 0.16, 0.08, "triangle");
  } catch {
    /* no-op */
  }
}

/** Long descending pad on game over */
export function playGameOver() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(330, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.5);
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    /* no-op */
  }
}
