import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserX, Music, Radio } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NeumorphicButton from '../UI/NeumorphicButton';

const GuestScreen: React.FC = () => {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();

  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://qjdrfskuxgaohczizdyq.supabase.co/storage/v1/object/public/micelleneous-images//girl%20lisenting%20to%20music.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/70 to-slate-900/85"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate('/auth/welcome')}
            className="p-2 rounded-2xl bg-slate-800/40 shadow-lg shadow-slate-900/30"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
            }}
          >
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          
          <h1 className="text-xl font-bold text-white">Guest Mode</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm text-center">
            <div 
              className="bg-slate-800/30 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/30 mb-8"
              style={{
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
              }}
            >
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-700/40 flex items-center justify-center"
                style={{
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
                }}
              >
                <UserX size={32} className="text-slate-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">Guest Mode</h2>
              <p className="text-slate-400 mb-6">
                Continue without an account to explore our radio stations
              </p>

              {/* Features Available */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-left">
                  <Radio size={16} className="text-green-400" />
                  <span className="text-sm text-slate-300">Stream live radio stations</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Music size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-500 line-through">Premium music access</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <UserX size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-500 line-through">Profile & comments</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-6">
                Create an account anytime to unlock all features
              </p>
            </div>

            <div className="space-y-4">
              <NeumorphicButton
                onClick={handleContinueAsGuest}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Continue as Guest
              </NeumorphicButton>
              
              <NeumorphicButton
                onClick={() => navigate('/auth/signup')}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Create Account Instead
              </NeumorphicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestScreen;