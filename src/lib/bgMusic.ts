let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let playing = false;
let nodes: OscillatorNode[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;

const NOTES = [
  261.63, 293.66, 329.63, 392.00, 440.00, // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99,           // C5 D5 E5 G5
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function playPad(ctx: AudioContext, dest: AudioNode, freq: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + duration * 0.3);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  osc.connect(gain).connect(dest);
  osc.start();
  osc.stop(ctx.currentTime + duration);
  nodes.push(osc);
  osc.onended = () => {
    nodes = nodes.filter(n => n !== osc);
  };
}

function startLoop() {
  if (!audioCtx || !masterGain) return;
  // Play 2-3 overlapping pads every 3s
  const play = () => {
    if (!audioCtx || !masterGain) return;
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const freq = pickRandom(NOTES);
      const dur = 4 + Math.random() * 4; // 4-8s
      playPad(audioCtx, masterGain, freq, dur);
    }
  };
  play();
  intervalId = setInterval(play, 3000);
}

export function startBgMusic() {
  if (playing) return;
  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);
  playing = true;
  startLoop();
}

export function stopBgMusic() {
  if (!playing) return;
  playing = false;
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
  nodes.forEach(o => { try { o.stop(); } catch {} });
  nodes = [];
  if (masterGain) { masterGain.disconnect(); masterGain = null; }
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
}

export function isBgMusicPlaying() {
  return playing;
}
