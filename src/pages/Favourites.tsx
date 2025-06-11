import React from 'react';
import Header from '../components/Layout/Header';
import { Heart } from 'lucide-react';

const Favourites: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <Header title="Favourites" />
      
      <main className="px-6 py-6 pb-24">
        <div className="text-center py-16">
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-slate-800/40 flex items-center justify-center"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
            }}
          >
            <Heart size={32} className="text-slate-500" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">
            No Favourites Yet
          </h2>
          <p className="text-slate-400">
            Heart your favorite stations to see them here
          </p>
        </div>
      </main>
    </div>
  );
};

export default Favourites;