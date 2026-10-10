// Web Audio API harmonic outdoor chime generator
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playStartChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [329.63, 392.0, 523.25]; // E4, G4, C5 (warm major triad)

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.12);

    gain.gain.setValueAtTime(0, now + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 1.3);
  });
}

export function playCompleteChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Natural 528Hz "Miracle" harmonic + 432Hz deep bell
  const freqs = [261.63, 329.63, 392.0, 528.0];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.15);

    gain.gain.setValueAtTime(0, now + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.18, now + i * 0.15 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 2.0);
  });
}

export function playGentleClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, now);

  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}
