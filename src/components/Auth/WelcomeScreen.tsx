import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Music, Radio } from 'lucide-react';
import NeumorphicButton from '../UI/NeumorphicButton';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://qjdrfskuxgaohczizdyq.supabase.co/storage/v1/object/public/micelleneous-images//splashscreen.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/80"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Logo */}
        <div 
          className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
          style={{
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
          }}
        >
          <Radio size={32} className="text-white" />
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold text-white mb-4">
          မင်္ဂလာပါ!
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Myanmar Radio
        </h2>
        <p className="text-slate-300 mb-12 max-w-sm">
          Stream the best Burmese radio stations and discover premium music collection
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-12 w-full max-w-sm">
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-800/80 flex items-center justify-center"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
              }}
            >
              <Play size={20} className="text-blue-400" />
            </div>
            <p className="text-xs text-slate-300">Live Radio</p>
          </div>
          
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-800/80 flex items-center justify-center"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
              }}
            >
              <Music size={20} className="text-purple-400" />
            </div>
            <p className="text-xs text-slate-300">Premium Music</p>
          </div>
          
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-800/80 flex items-center justify-center"
              style={{
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
              }}
            >
              <Radio size={20} className="text-green-400" />
            </div>
            <p className="text-xs text-slate-300">HD Quality</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          <NeumorphicButton
            onClick={() => navigate('/auth/login')}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Get Started
          </NeumorphicButton>
          
          <NeumorphicButton
            onClick={() => navigate('/auth/signup')}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Create Account
          </NeumorphicButton>
          
          <button
            onClick={() => navigate('/auth/guest')}
            className="w-full py-3 text-slate-400 hover:text-white transition-colors duration-300"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;