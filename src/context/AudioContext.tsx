import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface AudioContextType {
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  volume: number;
  toggleMusic: () => void;
  toggleSoundEffects: () => void;
  setVolume: (volume: number) => void;
  playSound: (sound: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEffectsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('volume');
    return saved !== null ? JSON.parse(saved) : 0.5;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    audioRef.current = new Audio('/Tic Tac Infinity.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    soundRefs.current = {
      click: new Audio('/click.mp3'),
      win: new Audio('/win.mp3'),
      draw: new Audio('/draw.mp3'),
      achievement: new Audio('/achievement.mp3'),
    };
    
    Object.values(soundRefs.current).forEach(sound => {
      sound.volume = volume;
    });
    
    if (musicEnabled) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          document.addEventListener('click', () => {
            audioRef.current?.play();
          }, { once: true });
        });
      }
    }
    
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (musicEnabled) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicEnabled]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    Object.values(soundRefs.current).forEach(sound => {
      sound.volume = volume;
    });
  }, [volume]);

  const toggleMusic = () => {
    const newState = !musicEnabled;
    setMusicEnabled(newState);
    localStorage.setItem('musicEnabled', JSON.stringify(newState));
  };

  const toggleSoundEffects = () => {
    const newState = !soundEffectsEnabled;
    setSoundEffectsEnabled(newState);
    localStorage.setItem('soundEffectsEnabled', JSON.stringify(newState));
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('volume', JSON.stringify(newVolume));
  };

  const playSound = (sound: string) => {
    if (!soundEffectsEnabled) return;
    const soundObj = soundRefs.current[sound];
    if (soundObj) {
      soundObj.currentTime = 0;
      soundObj.play().catch(() => {});
    }
  };

  return (
    <AudioContext.Provider value={{
      musicEnabled,
      soundEffectsEnabled,
      volume,
      toggleMusic,
      toggleSoundEffects,
      setVolume,
      playSound,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
