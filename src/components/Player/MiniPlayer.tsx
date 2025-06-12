import React from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { Pause, Play, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MiniPlayer: React.FC = () => {
  const { playerState, pauseAudio, resumeAudio } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFavourited, setIsFavourited] = React.useState(false);

  // Media Session API integration for notification bar player
  React.useEffect(() => {
    if ('mediaSession' in navigator && playerState.currentStation) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: playerState.currentStation.current_track || playerState.currentStation.name,
        artist: playerState.currentStation.name,
        album: 'Myanmar Radio',
        artwork: [
          { src: playerState.currentStation.image_url, sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.setActionHandler('play', resumeAudio);
      navigator.mediaSession.setActionHandler('pause', pauseAudio);
      // No next/previous for radio
    }
    // Optionally clear metadata when unmounting or station changes
    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
      }
    };
  }, [playerState.currentStation, playerState.isPlaying]);

  if (!playerState.currentStation) return null;
  // Hide MiniPlayer on Player page
  if (location.pathname.startsWith('/player')) return null;

  const isPlaying = playerState.isPlaying;
  const station = playerState.currentStation;

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavourited((prev) => !prev);
    // TODO: Call backend to add/remove favourite
  };

  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 px-0 flex justify-center pointer-events-none w-full max-w-full">
      <div
        className="pointer-events-auto w-full max-w-2xl mx-auto bg-gradient-to-br from-[#1a0022] via-[#3a006d] to-[#a020f0] rounded-2xl flex items-center gap-4 shadow-lg border border-purple-900/40 cursor-pointer px-4 py-3"
        style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.2), -2px -2px 8px rgba(148,163,184,0.08)' }}
        onClick={() => navigate('/player')}
      >
        <img
          src={station.image_url}
          alt={station.name}
          className="w-14 h-14 rounded-xl object-cover border-2 border-white/40 shadow-md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-base leading-tight">{station.name}</h3>
          <p className="text-xs text-white/80 truncate">{station.current_track || station.description}</p>
        </div>
        <button
          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all mr-1 flex items-center justify-center"
          onClick={e => { e.stopPropagation(); isPlaying ? pauseAudio() : resumeAudio(); }}
        >
          {isPlaying ? <Pause size={22} className="text-white" /> : <Play size={22} className="text-white" />}
        </button>
        <button
          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center"
          onClick={handleFavourite}
        >
          <Heart size={20} className={isFavourited ? 'text-pink-400 fill-pink-400' : 'text-white'} fill={isFavourited ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
