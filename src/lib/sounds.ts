// Sound effects using Web Audio API
const audioCtx = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
};

let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = audioCtx();
  return ctx;
}

export function playMoveSound(isX: boolean) {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.value = isX ? 600 : 450;
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.15);
  } catch {}
}

export function playWinSound() {
  try {
    const c = getCtx();
    const notes = [523, 587, 659, 784, 880, 1047]; // C5, D5, E5, G5, A5, C6
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = i < 4 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      const startTime = c.currentTime + i * 0.25;
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  } catch {}
}

export function playDrawSound() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'triangle';
    osc.frequency.value = 300;
    osc.frequency.linearRampToValueAtTime(200, c.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.5);
  } catch {}
}

export function playUndoSound() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.value = 400;
    osc.frequency.linearRampToValueAtTime(300, c.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.1);
  } catch {}
}
