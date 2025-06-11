import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showProfile = true }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        
        {showProfile && (
          <button
            onClick={() => navigate('/profile')}
            className="p-2 rounded-2xl bg-slate-800/40 shadow-lg shadow-slate-900/30 hover:bg-slate-700/40 transition-all duration-300"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
            }}
          >
            <User size={20} className="text-slate-400" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;