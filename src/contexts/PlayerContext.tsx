import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { RadioStation, PlayerState } from '../types';

interface PlayerContextType {
  playerState: PlayerState;
  audioRef: React.RefObject<HTMLAudioElement>;
  playStation: (station: RadioStation) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  setVolume: (volume: number) => void;
  setSleepTimer: (minutes: number) => void;
  clearSleepTimer: () => void;
  getRemainingTime: () => number;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sleepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentStation: null,
    volume: 0.7,
    sleepTimer: null,
    sleepTimerEndTime: null
  });

  const playStation = (station: RadioStation) => {
    if (audioRef.current) {
      audioRef.current.src = station.stream_url;
      audioRef.current.play().catch(console.error);
      setPlayerState(prev => ({
        ...prev,
        currentStation: station,
        isPlaying: true
      }));
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const resumeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setPlayerState(prev => ({ ...prev, volume }));
    }
  };

  const setSleepTimer = (minutes: number) => {
    clearSleepTimer();
    const endTime = new Date(Date.now() + minutes * 60 * 1000);
    
    sleepTimerRef.current = setTimeout(() => {
      pauseAudio();
      setPlayerState(prev => ({ 
        ...prev, 
        sleepTimer: null,
        sleepTimerEndTime: null
      }));
    }, minutes * 60 * 1000);
    
    setPlayerState(prev => ({ 
      ...prev, 
      sleepTimer: minutes,
      sleepTimerEndTime: endTime
    }));
  };

  const clearSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (sleepIntervalRef.current) {
      clearInterval(sleepIntervalRef.current);
      sleepIntervalRef.current = null;
    }
    setPlayerState(prev => ({ 
      ...prev, 
      sleepTimer: null,
      sleepTimerEndTime: null
    }));
  };

  const getRemainingTime = () => {
    if (!playerState.sleepTimerEndTime) return 0;
    const remaining = Math.max(0, playerState.sleepTimerEndTime.getTime() - Date.now());
    return Math.ceil(remaining / 1000);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume;
    }
  }, []);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleCanPlay = () => {
      if (playerState.currentStation) {
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
      }
    };

    const handleError = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [playerState.currentStation]);

  return (
    <PlayerContext.Provider value={{
      playerState,
      audioRef,
      playStation,
      pauseAudio,
      resumeAudio,
      setVolume,
      setSleepTimer,
      clearSleepTimer,
      getRemainingTime
    }}>
      {children}
      <audio ref={audioRef} preload="none" />
    </PlayerContext.Provider>
  );
};