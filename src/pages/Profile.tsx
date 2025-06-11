import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Bell, 
  Heart, 
  LogOut, 
  Camera,
  Save
} from 'lucide-react';
import NeumorphicButton from '../components/UI/NeumorphicButton';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: 'Aung Kyaw',
    status: 'Music lover from Yangon',
    country: 'Myanmar 🇲🇲',
    avatar_url: null
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to Supabase
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
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
          
          <h1 className="text-xl font-bold text-white">Profile</h1>
          
          <NeumorphicButton
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            variant="primary"
            size="sm"
            icon={isEditing ? Save : Edit3}
          />
        </div>
      </header>

      <main className="px-6 py-6 pb-24">
        {/* Avatar Section */}
        <div className="text-center mb-8">
          <div 
            className="relative w-32 h-32 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
            style={{
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
            }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <span className="text-3xl font-bold text-white">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            )}
            
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 p-2 bg-blue-500 rounded-2xl shadow-lg">
                <Camera size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-60"
              style={{
                boxShadow: isEditing 
                  ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
                  : '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Status
            </label>
            <input
              type="text"
              value={profile.status}
              onChange={(e) => setProfile(prev => ({ ...prev, status: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-60"
              style={{
                boxShadow: isEditing 
                  ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
                  : '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Country
            </label>
            <input
              type="text"
              value={profile.country}
              onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-60"
              style={{
                boxShadow: isEditing 
                  ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)'
                  : '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(148, 163, 184, 0.1)'
              }}
            />
          </div>
        </div>

        {/* Menu Options */}
        {!isEditing && (
          <div className="space-y-4">
            <NeumorphicButton
              onClick={() => {}}
              variant="secondary"
              className="w-full justify-start"
              icon={Bell}
            >
              Notifications
            </NeumorphicButton>

            <NeumorphicButton
              onClick={() => {}}
              variant="secondary"
              className="w-full justify-start"
              icon={Heart}
            >
              Donate
            </NeumorphicButton>

            <NeumorphicButton
              onClick={handleLogout}
              variant="secondary"
              className="w-full justify-start text-red-400"
              icon={LogOut}
            >
              Log Out
            </NeumorphicButton>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;