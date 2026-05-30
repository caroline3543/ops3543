// src/hooks/useSounds.js
import { useLocalStorage } from './useLocalStorage';
import { useCallback, useRef } from 'react';

const NOTE_FREQUENCIES = {
  taskComplete:   { type: 'sine',     freq: 523.25, duration: 0.3, gain: 0.08 },  // C5 soft
  coinEarned:     { type: 'sine',     freq: 659.25, duration: 0.25, gain: 0.06 }, // E5 gentle
  allDone:        { type: 'sine',     freq: 783.99, duration: 0.5,  gain: 0.07 }, // G5 warm
  ministerEnd:    { type: 'sine',     freq: 392.00, duration: 0.8,  gain: 0.06 }, // G4 bell
  tabSwitch:      { type: 'sine',     freq: 440.00, duration: 0.12, gain: 0.04 }, // A4 tiny
};

export function useSounds() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('soundEnabled', true);
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback((soundKey) => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      const note = NOTE_FREQUENCIES[soundKey];
      if (!note) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = note.type;
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(note.gain, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.duration);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + note.duration);
    } catch (e) {
      // Audio not available
    }
  }, [soundEnabled, getCtx]);

  // Chord — two notes together for allDone
  const playChord = useCallback(() => {
    if (!soundEnabled) return;
    ['allDone', 'coinEarned'].forEach((key, i) => {
      setTimeout(() => play(key), i * 80);
    });
  }, [soundEnabled, play]);

  return { play, playChord, soundEnabled, setSoundEnabled };
}
