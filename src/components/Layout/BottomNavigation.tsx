import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, Music } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Heart, label: 'Favourites', path: '/favourites' },
    { icon: Music, label: 'Music', path: '/music', premium: true }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-br from-black/90 via-black/80 to-black/90 rounded-t-3xl shadow-2xl border-t-4 border-white/10 px-6 py-2 flex justify-around items-center gap-2 w-full max-w-full backdrop-blur-lg"
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        borderTopLeftRadius: '1.5rem',
        borderTopRightRadius: '1.5rem',
        borderTop: '4px solid rgba(255,255,255,0.08)'
      }}
    >
      {navItems.map(({ icon: Icon, label, path, premium }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center p-3 rounded-full transition-all duration-300
              ${isActive 
                ? 'bg-white/10 shadow-inner shadow-blue-900/30 scale-110' 
                : 'bg-black/0 hover:bg-white/5 shadow-lg shadow-slate-900/30'
              }
              ${premium ? 'relative' : ''}
            `}
            style={{
              boxShadow: isActive 
                ? '0 2px 8px rgba(30,58,138,0.10), 0 0px 0px rgba(148,163,184,0.0)' 
                : '0 2px 8px rgba(0,0,0,0.10), 0 0px 0px rgba(148,163,184,0.0)'
            }}
          >
            <Icon 
              size={22} 
              className={`mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`} 
            />
            <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>{label}</span>
            {premium && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border border-slate-800"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;