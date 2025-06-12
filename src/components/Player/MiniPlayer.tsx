import React from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { Pause, Play, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MiniPlayer: React.FC = () => {
  const { playerState, pauseAudio, resumeAudio } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();

  if (!playerState.currentStation) return null;

  // Hide MiniPlayer on Player page
  if (location.pathname.startsWith('/player')) return null;

  const isPlaying = playerState.isPlaying;
  const station = playerState.currentStation;
  // TODO: Replace with real favourite state from backend or context
  const [isFavourited, setIsFavourited] = React.useState(false);

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavourited((prev) => !prev);
    // TODO: Call backend to add/remove favourite
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-0 flex justify-center pointer-events-none w-full max-w-full">
      <div
        className="pointer-events-auto w-full max-w-2xl mx-auto bg-gradient-to-br from-black/90 via-black/80 to-black/90 rounded-2xl flex items-center gap-4 shadow-lg border border-slate-700/40 cursor-pointer px-3 py-2"
        style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.4), -2px -2px 8px rgba(148,163,184,0.1)' }}
        onClick={() => navigate('/player')}
      >
        <img
          src={station.image_url}
          alt={station.name}
          className="w-12 h-12 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-sm">{station.name}</h3>
          <p className="text-xs text-slate-400 truncate">{station.current_track || station.description}</p>
        </div>
        <button
          className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 transition-all mr-1"
          onClick={e => { e.stopPropagation(); isPlaying ? pauseAudio() : resumeAudio(); }}
        >
          {isPlaying ? <Pause size={18} className="text-blue-400" /> : <Play size={18} className="text-slate-300" />}
        </button>
        <button
          className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 transition-all"
          onClick={handleFavourite}
        >
          <Heart size={18} className={isFavourited ? 'text-pink-400 fill-pink-400' : 'text-slate-300'} fill={isFavourited ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
