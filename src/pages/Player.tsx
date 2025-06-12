import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Volume2, Users, Heart, Play, Pause } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { getMyanmarTime } from '../utils/time';
import CommentSection from '../components/Player/CommentSection';
import SleepTimer from '../components/Player/SleepTimer';

const Player: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { playerState, setVolume, pauseAudio, resumeAudio } = usePlayer();
  const [currentTime, setCurrentTime] = useState(getMyanmarTime());
  const [isCommentsCollapsed, setIsCommentsCollapsed] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getMyanmarTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!playerState.currentStation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center">
        <p className="text-slate-400">No station selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-2xl bg-slate-800/40 shadow-lg shadow-slate-900/30"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
            }}
          >
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          
          <div className="text-center">
            <p className="text-sm text-slate-400">Myanmar Time</p>
            <p className="text-lg font-mono text-white">{currentTime}</p>
          </div>
          
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 pb-0">
        {/* Station Info */}
        <div className="text-center mb-8">
          <div 
            className="w-48 h-48 mx-auto mb-6 rounded-3xl overflow-hidden relative bg-slate-800/40"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
            }}
          >
            <img
              src={playerState.currentStation.image_url}
              alt={playerState.currentStation.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"></div>
            
            {/* Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">LIVE</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {playerState.currentStation.name}
          </h1>
          <p className="text-slate-400 mb-2">
            {playerState.currentStation.description}
          </p>
          
          {playerState.currentStation.current_track && (
            <p className="text-blue-400 text-sm mb-4">
              Now Playing: {playerState.currentStation.current_track}
            </p>
          )}
          
          {playerState.currentStation.listeners_count && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Users size={16} className="text-slate-500" />
              <span className="text-slate-500 text-sm">
                {playerState.currentStation.listeners_count.toLocaleString()} listeners
              </span>
            </div>
          )}

          {/* Favourite Button */}
          <div className="flex justify-center mt-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 shadow-md text-sm font-medium
                ${isFavourited ? 'bg-pink-600/90 border-pink-700 text-white' : 'bg-slate-800/60 border-slate-700 text-pink-400 hover:bg-pink-600/80 hover:text-white'}`}
              style={{ boxShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}
              onClick={() => setIsFavourited(fav => !fav)}
            >
              <Heart size={18} fill={isFavourited ? 'currentColor' : 'none'} />
              {isFavourited ? 'Favourited' : 'Add to Favourites'}
            </button>
          </div>
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-slate-400 text-sm">Volume</span>
            <span className="text-slate-300 text-sm ml-auto">
              {Math.round(playerState.volume * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Play/Pause Button - 1/5 width */}
            <button
              className="flex-shrink-0 flex-grow-0 w-1/5 min-w-[48px] max-w-[64px] p-3 rounded-xl bg-blue-600/90 hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center"
              onClick={() => playerState.isPlaying ? pauseAudio() : resumeAudio()}
              style={{ marginRight: '8px' }}
            >
              {playerState.isPlaying ? (
                <Pause size={24} className="text-white" />
              ) : (
                <Play size={24} className="text-white" />
              )}
            </button>
            {/* Volume Bar - 4/5 width */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={playerState.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-4/5 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              style={{ minWidth: 0 }}
            />
          </div>
        </div>

        {/* Sleep Timer */}
        <SleepTimer />
      </main>

      {/* Comments Section */}
      <CommentSection
        stationId={playerState.currentStation.id}
        isCollapsed={isCommentsCollapsed}
        onToggle={() => setIsCommentsCollapsed(!isCommentsCollapsed)}
      />
    </div>
  );
};

export default Player;