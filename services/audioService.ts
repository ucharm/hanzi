
let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (typeof window !== 'undefined' && !audioCtx) {
    // @ts-ignore - Handle older webkit prefix if necessary
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
};

export type SoundType = 'click' | 'correct' | 'wrong' | 'victory' | 'start';

export const playSound = (type: SoundType) => {
  // Ensure context is initialized
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const ctx = audioCtx;
  const t = ctx.currentTime;

  switch (type) {
    case 'click':
      // Short high-pitched "pop"
      const oscClick = ctx.createOscillator();
      const gainClick = ctx.createGain();
      oscClick.type = 'sine';
      oscClick.frequency.setValueAtTime(600, t);
      oscClick.frequency.exponentialRampToValueAtTime(1000, t + 0.08);
      gainClick.gain.setValueAtTime(0.05, t);
      gainClick.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      oscClick.connect(gainClick);
      gainClick.connect(ctx.destination);
      oscClick.start(t);
      oscClick.stop(t + 0.08);
      break;

    case 'correct':
      // Cheerful ascending major triad (C5, E5, G5, C6)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle'; // Brighter sound
        // Lowpass filter to soften the triangle wave slightly
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 2000;

        osc.frequency.setValueAtTime(freq, t);
        
        // Staggered start times
        const startTime = t + i * 0.08;
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
      break;

    case 'wrong':
      // Low descending "thud" or "wobble"
      const oscWrong = ctx.createOscillator();
      const gainWrong = ctx.createGain();
      oscWrong.type = 'sawtooth';
      oscWrong.frequency.setValueAtTime(150, t);
      oscWrong.frequency.linearRampToValueAtTime(100, t + 0.3);
      
      gainWrong.gain.setValueAtTime(0.05, t);
      gainWrong.gain.linearRampToValueAtTime(0, t + 0.3);
      
      oscWrong.connect(gainWrong);
      gainWrong.connect(ctx.destination);
      oscWrong.start(t);
      oscWrong.stop(t + 0.3);
      break;

    case 'victory':
      // Fast arpeggio/fanfare
      const scale = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      scale.forEach((freq, i) => {
        const oscV = ctx.createOscillator();
        const gainV = ctx.createGain();
        oscV.type = 'square';
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1200;

        const startTime = t + i * 0.08;

        oscV.frequency.setValueAtTime(freq, startTime);
        
        gainV.gain.setValueAtTime(0, startTime);
        gainV.gain.linearRampToValueAtTime(0.04, startTime + 0.05);
        gainV.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        
        oscV.connect(filter);
        filter.connect(gainV);
        gainV.connect(ctx.destination);
        
        oscV.start(startTime);
        oscV.stop(startTime + 0.4);
      });
      break;
      
    case 'start':
      // Whoosh up sound
      const oscStart = ctx.createOscillator();
      const gainStart = ctx.createGain();
      oscStart.type = 'sine';
      oscStart.frequency.setValueAtTime(200, t);
      oscStart.frequency.exponentialRampToValueAtTime(800, t + 0.3);
      
      gainStart.gain.setValueAtTime(0, t);
      gainStart.gain.linearRampToValueAtTime(0.08, t + 0.1);
      gainStart.gain.linearRampToValueAtTime(0, t + 0.3);
      
      oscStart.connect(gainStart);
      gainStart.connect(ctx.destination);
      oscStart.start(t);
      oscStart.stop(t + 0.3);
      break;
  }
};
