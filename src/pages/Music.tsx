import React from 'react';
import Header from '../components/Layout/Header';
import { Crown, Music } from 'lucide-react';
import NeumorphicButton from '../components/UI/NeumorphicButton';

const MusicPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <Header title="Premium Music" />
      
      <main className="px-6 py-6 pb-24">
        <div className="text-center py-16">
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
            }}
          >
            <Crown size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Premium Music
          </h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Access thousands of Burmese songs with a premium subscription
          </p>

          <div 
            className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mb-8"
            style={{
              boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4), -2px -2px 8px rgba(148, 163, 184, 0.1)'
            }}
          >
            <Music size={48} className="text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Premium Features
            </h3>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>• Unlimited song streaming</li>
              <li>• High-quality audio</li>
              <li>• Offline downloads</li>
              <li>• No advertisements</li>
              <li>• Exclusive content</li>
            </ul>
          </div>

          <NeumorphicButton
            variant="primary"
            size="lg"
            className="w-full max-w-xs mx-auto"
          >
            Upgrade to Premium
          </NeumorphicButton>
        </div>
      </main>
    </div>
  );
};

export default MusicPage;