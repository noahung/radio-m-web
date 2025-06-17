import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import BottomNavigation from './components/Layout/BottomNavigation';
import LoadingSpinner from './components/UI/LoadingSpinner';
import MiniPlayer from './components/Player/MiniPlayer';

// Auth Components
import WelcomeScreen from './components/Auth/WelcomeScreen';
import LoginScreen from './components/Auth/LoginScreen';
import SignUpScreen from './components/Auth/SignUpScreen';
import ForgotPasswordScreen from './components/Auth/ForgotPasswordScreen';
import GuestScreen from './components/Auth/GuestScreen';
import WaitingListForm from './components/Auth/WaitingListForm';

// Main App Components
import Home from './pages/Home';
import Player from './pages/Player';
import Profile from './pages/Profile';
import Favourites from './pages/Favourites';
import MusicPage from './pages/Music';

const AuthenticatedApp: React.FC = () => {
  return (    <PlayerProvider>
      <div className="relative min-h-screen bg-slate-900">
        <Routes>
          <Route path="/" element={<Navigate to="/auth/welcome" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/player" element={<Player />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/waiting-list" element={<WaitingListForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/auth/welcome" element={<WelcomeScreen />} />
          <Route path="/auth/login" element={<LoginScreen />} />
          <Route path="/auth/signup" element={<SignUpScreen />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/auth/guest" element={<GuestScreen />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
          {/* Bottom Navigation - Show on main pages only */}
        <Routes>
          <Route path="/home" element={<BottomNavigation />} />
          <Route path="/favourites" element={<BottomNavigation />} />
          <Route path="/music" element={<BottomNavigation />} />
          {/* Show BottomNavigation on Player page as well */}
          <Route path="/player" element={<BottomNavigation />} />
          <Route path="/player/:id" element={<BottomNavigation />} />
        </Routes>
        <MiniPlayer />
      </div>
    </PlayerProvider>
  );
};

const AppContent: React.FC = () => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-slate-400">Loading Myanmar Radio...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated && !authState.isGuest) {
    return (
      <Routes>
        <Route path="/auth/welcome" element={<WelcomeScreen />} />
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/signup" element={<SignUpScreen />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/auth/guest" element={<GuestScreen />} />
        <Route path="*" element={<Navigate to="/auth/welcome" replace />} />
      </Routes>
    );
  }

  return <AuthenticatedApp />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;