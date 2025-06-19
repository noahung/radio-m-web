import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { Pause, Play, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MiniPlayer: React.FC = () => {
  const { playerState, pauseAudio, resumeAudio } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFavourited, setIsFavourited] = React.useState(false);  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX - offsetX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const newOffset = currentX - startX;
    if (newOffset > 0) {  // Only allow sliding right
      setOffsetX(newOffset);
    }
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    if (offsetX > 100) {  // If dragged far enough right
      pauseAudio();  // Stop the player
      setIsHidden(true);  // Hide the player
    } else {
      setOffsetX(0); // Spring back if not dragged far enough
    }
  };

  // Reset when a new station is selected
  useEffect(() => {
    setIsHidden(false);
    setOffsetX(0);
  }, [playerState.currentStation]);

  if (!playerState.currentStation) return null;
  // Show MiniPlayer only on Home, Favourites, and Music pages
  const showMiniPlayer = ["/home", "/favourites", "/music"].includes(location.pathname);
  if (!showMiniPlayer) return null;

  const isPlaying = playerState.isPlaying;
  const station = playerState.currentStation;

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavourited((prev) => !prev);
    // TODO: Call backend to add/remove favourite
  };

  return (    <div className="fixed bottom-24 left-0 right-0 z-40 px-0 flex justify-center pointer-events-none w-full max-w-full">
      <div 
        ref={playerRef}
        className="bg-slate-800/95 backdrop-blur-md w-full mx-4 rounded-2xl pointer-events-auto relative overflow-hidden"
        style={{
          transform: isHidden ? 'translateX(120%)' : `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative">
          {/* Sliding text indicator with gradient animation */}
          <div className="absolute top-0 left-0 w-full text-xs text-gray-400 text-center py-1 overflow-hidden">
            <div className="relative">
              <span className="inline-block animate-slide-gradient">
                Slide to hide
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </span>
            </div>
          </div>
          
          {/* Existing player content with adjusted padding for the sliding text */}
          <div className="flex items-center p-4 pt-6" onClick={() => navigate(`/player/${station.id}`)}>            <img
              src={station.image_url}
              alt={station.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white/40 shadow-md"
            />
            <div className="flex-1 min-w-0 ml-3">
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
      </div>
    </div>
  );
};

export default MiniPlayer;
