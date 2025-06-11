import React from 'react';
import { Play, Pause } from 'lucide-react';
import { RadioStation } from '../../types';
import { usePlayer } from '../../contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';

interface StationCardProps {
  station: RadioStation;
}

const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const { playerState, playStation, pauseAudio, resumeAudio } = usePlayer();
  const navigate = useNavigate();

  const isCurrentStation = playerState.currentStation?.id === station.id;
  const isPlaying = isCurrentStation && playerState.isPlaying;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentStation) {
      if (isPlaying) {
        pauseAudio();
      } else {
        resumeAudio();
      }
    } else {
      playStation(station);
    }
  };

  const handleCardClick = () => {
    playStation(station);
    navigate(`/player`);
  };

  return (
    <div 
      className="bg-gradient-to-br from-black/90 via-black/80 to-black/90 rounded-2xl p-0 border border-slate-700/30 transition-all duration-300 hover:bg-black/80 cursor-pointer flex flex-col items-center justify-between aspect-square min-h-[180px] min-w-0 relative"
      style={{
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4), -2px -2px 8px rgba(148, 163, 184, 0.1)'
      }}
      onClick={handleCardClick}
    >
      <div className="relative w-full flex-1 flex items-center justify-center pt-4">
        <img
          src={station.image_url || 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?w=100&h=100&fit=crop'}
          alt={station.name}
          className="w-20 h-20 rounded-xl object-cover shadow-md"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 rounded-2xl"></div>
      </div>
      <div className="flex-1 w-full flex flex-col items-center justify-center px-3 pb-3">
        <h3 className="font-semibold text-white text-center truncate w-full mt-2">{station.name}</h3>
        <p className="text-xs text-slate-400 text-center truncate w-full">{station.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>
      <button
        className={`absolute top-2 right-2 p-2 rounded-xl transition-all duration-300
          ${isPlaying 
            ? 'bg-blue-900/40 shadow-inner shadow-blue-900/30' 
            : 'bg-slate-700/40 shadow-lg shadow-slate-900/30 hover:bg-slate-600/40'
          }
        `}
        style={{
          boxShadow: isPlaying
            ? 'inset 4px 4px 8px rgba(30, 58, 138, 0.3), inset -4px -4px 8px rgba(148, 163, 184, 0.1)'
            : '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
        }}
        onClick={handlePlayPause}
      >
        {isPlaying ? (
          <Pause size={20} className="text-blue-400" />
        ) : (
          <Play size={20} className="text-slate-300" />
        )}
      </button>
    </div>
  );
};

export default StationCard;