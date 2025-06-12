import React from 'react';
import { RadioStation } from '../../types';
import { usePlayer } from '../../contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';

interface StationCardProps {
  station: RadioStation;
}

const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const { playerState, playStation } = usePlayer();
  const navigate = useNavigate();

  const isCurrentStation = playerState.currentStation?.id === station.id;

  const handleCardClick = () => {
    playStation(station); // Auto play on click
    navigate(`/player`);
  };

  return (
    <div
      className="relative bg-gradient-to-br from-black/90 via-black/80 to-black/90 rounded-2xl border border-slate-700/30 transition-all duration-300 hover:bg-black/80 cursor-pointer flex flex-col justify-end overflow-hidden min-h-[220px] min-w-0 shadow-lg group"
      style={{ boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4), -2px -2px 8px rgba(148, 163, 184, 0.1)' }}
      onClick={handleCardClick}
    >
      {/* Station Image */}
      <img
        src={station.image_url || 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?w=100&h=100&fit=crop'}
        alt={station.name}
        className="absolute inset-0 w-full h-full object-cover rounded-2xl z-0 group-hover:scale-105 transition-transform duration-300"
      />
      {/* Overlay for gradient and content readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      {/* Top right arrow icon */}
      <div className="absolute top-3 right-3 z-20">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/70 group-hover:text-white transition-colors duration-200">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-10 10M17 17V7H7" />
        </svg>
      </div>
      {/* Card Content */}
      <div className="relative z-20 p-4 pt-20 flex flex-col justify-end h-full">
        <h3 className="font-semibold text-white text-lg truncate mb-1 drop-shadow-md">{station.name}</h3>
        <p className="text-xs text-slate-200/80 truncate drop-shadow mb-1">{station.description}</p>
      </div>
    </div>
  );
};

export default StationCard;