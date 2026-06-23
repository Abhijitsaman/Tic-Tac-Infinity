import { useCallback } from 'react';
import { useAudio } from '../context/AudioContext';

export const useSound = () => {
  const { playSound: playSoundContext, soundEffectsEnabled, volume } = useAudio();

  const playSound = useCallback((sound: string) => {
    if (!soundEffectsEnabled) return;
    playSoundContext(sound);
  }, [soundEffectsEnabled, playSoundContext]);

  return { playSound };
};
