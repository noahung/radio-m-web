import React, { useState, useEffect, useRef } from 'react';
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
import { supabase } from '../lib/supabase';

const countryList = [
  { name: 'Myanmar', emoji: '🇲🇲' },
  { name: 'United States', emoji: '🇺🇸' },
  { name: 'Japan', emoji: '🇯🇵' },
  // ...add more countries as needed
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { authState, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<{
    username: string;
    status: string;
    country: string;
    avatar_url: string | null;
  }>({
    username: '',
    status: '',
    country: '',
    avatar_url: null
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('users')
        .select('username, status, country, avatar_url')
        .eq('id', authState.user!.id)
        .single();
      if (data) {
        setProfile({
          username: data.username || '',
          status: data.status || '',
          country: data.country || '',
          avatar_url: data.avatar_url || null
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [authState]);

  const handleSave = async () => {
    setIsEditing(false);
    if (!authState.user) return;
    await supabase
      .from('users')
      .update({
        username: profile.username,
        status: profile.status,
        country: profile.country,
        avatar_url: profile.avatar_url
      })
      .eq('id', authState.user.id);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth/welcome');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !authState.user) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `profile-pictures/${authState.user.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('profile-pictures').upload(filePath, file, { upsert: true });
    if (!uploadError) {
      const { data } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
      setProfile((prev) => ({ ...prev, avatar_url: data.publicUrl || null }));
    }
    setUploading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }

  if (!authState.isAuthenticated || authState.user?.is_guest) {
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
            <div className="w-10"></div>
          </div>
        </header>
        <main className="px-6 py-6 pb-24">
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700/30 rounded-xl text-yellow-300 text-center font-semibold">
            You are browsing as a guest. <button onClick={() => navigate('/auth/login')} className="underline text-yellow-200">Sign in</button> or <button onClick={() => navigate('/auth/signup')} className="underline text-yellow-200">Create Account</button> for full access.
          </div>
          <div className="text-center mb-8">
            <div
              className="relative w-32 h-32 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
              style={{
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(148, 163, 184, 0.1)'
              }}
            >
              <span className="text-3xl font-bold text-white">G</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-slate-400 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 text-white focus:outline-none"
              value="Guest User"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-400 mb-1">Status</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 text-white focus:outline-none"
              value="Browsing as guest"
              disabled
            />
          </div>
          <div className="mb-8">
            <label className="block text-slate-400 mb-1">Country</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 text-white focus:outline-none"
              value="-"
              disabled
            />
          </div>
          <NeumorphicButton
            onClick={() => navigate('/auth/login')}
            icon={LogOut}
            className="w-full mb-4 bg-blue-700 text-white font-bold"
          >Sign In</NeumorphicButton>
          <NeumorphicButton
            onClick={() => alert('Notifications feature coming soon!')}
            icon={Bell}
            className="w-full mb-4"
            disabled
          >Notifications</NeumorphicButton>
          <NeumorphicButton
            onClick={() => window.open('https://www.paypal.com/donate/?hosted_button_id=7VHQJMHHB85KN', '_blank')}
            icon={Heart}
            className="w-full mb-4"
          >Donate</NeumorphicButton>
        </main>
      </div>
    );
  }

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
              <button
                className="absolute bottom-2 right-2 bg-slate-900/80 p-2 rounded-full shadow"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera size={20} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </button>
            )}
          </div>
        </div>
        {/* Username */}
        <div className="mb-4">
          <label className="block text-slate-400 mb-1">Username</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 text-white focus:outline-none"
            value={profile.username}
            disabled={!isEditing}
            onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
          />
        </div>
        {/* Status */}
        <div className="mb-4">
          <label className="block text-slate-400 mb-1">Status</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 text-white focus:outline-none"
            value={profile.status}
            disabled={!isEditing}
            onChange={e => setProfile(p => ({ ...p, status: e.target.value }))}
          />
        </div>
        {/* Country */}
        <div className="mb-8">
          <label className="block text-slate-400 mb-1">Country</label>
          {isEditing ? (
            <select
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 text-white focus:outline-none"
              value={profile.country}
              onChange={e => setProfile(p => ({ ...p, country: e.target.value }))}
            >
              <option value="">Select Country</option>
              {countryList.map(c => (
                <option key={c.name} value={`${c.name} ${c.emoji}`}>{c.name} {c.emoji}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 text-white focus:outline-none"
              value={profile.country}
              disabled
            />
          )}
        </div>
        <NeumorphicButton
          onClick={() => alert('Notifications feature coming soon!')}
          icon={Bell}
          className="w-full mb-4"
        >Notifications</NeumorphicButton>
        <NeumorphicButton
          onClick={() => window.open('https://www.paypal.com/donate/?hosted_button_id=7VHQJMHHB85KN', '_blank')}
          icon={Heart}
          className="w-full mb-4"
        >Donate</NeumorphicButton>
        <NeumorphicButton
          onClick={handleLogout}
          icon={LogOut}
          className="w-full"
        >Log Out</NeumorphicButton>
      </main>
    </div>
  );
};

export default Profile;