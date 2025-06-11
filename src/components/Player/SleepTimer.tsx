import React, { useState, useEffect } from 'react';
import { Timer, X } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import NeumorphicButton from '../UI/NeumorphicButton';

const SleepTimer: React.FC = () => {
  const { playerState, setSleepTimer, clearSleepTimer, getRemainingTime } = usePlayer();
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (playerState.sleepTimer) {
      const interval = setInterval(() => {
        const remaining = getRemainingTime();
        setRemainingTime(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playerState.sleepTimer, getRemainingTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimerSelect = (minutes: number) => {
    if (playerState.sleepTimer === minutes) {
      clearSleepTimer();
    } else {
      setSleepTimer(minutes);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Timer size={20} className="text-blue-400" />
        Sleep Timer
        {playerState.sleepTimer && (
          <button
            onClick={clearSleepTimer}
            className="ml-auto p-1 rounded-full hover:bg-slate-700/40 transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        )}
      </h3>
      
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[15, 30, 60, 90].map((minutes) => (
          <NeumorphicButton
            key={minutes}
            onClick={() => handleTimerSelect(minutes)}
            variant={playerState.sleepTimer === minutes ? 'pressed' : 'secondary'}
            size="sm"
            className="text-center"
          >
            {minutes}m
          </NeumorphicButton>
        ))}
      </div>
      
      {playerState.sleepTimer && remainingTime > 0 && (
        <div 
          className="p-3 bg-blue-900/20 border border-blue-800/30 rounded-2xl text-center"
          style={{
            boxShadow: 'inset 2px 2px 4px rgba(30, 58, 138, 0.3), inset -2px -2px 4px rgba(148, 163, 184, 0.1)'
          }}
        >
          <p className="text-blue-400 text-sm font-medium">
            Sleep timer: {formatTime(remainingTime)}
          </p>
          <p className="text-blue-300 text-xs mt-1">
            Music will stop automatically
          </p>
        </div>
      )}
    </div>
  );
};

export default SleepTimer;