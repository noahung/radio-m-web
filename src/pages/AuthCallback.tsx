import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('OAuth callback hash:', window.location.hash);
    const finishOAuth = async () => {
      try {
        // Ensure user profile is created in public.users
        await handleOAuthCallback();
        // Check session again and redirect
        const { data: { session } } = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
        if (session && session.user) {
          navigate('/home');
        } else {
          setError('Authentication failed: No session found.');
          setTimeout(() => navigate('/auth/login'), 3000);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : JSON.stringify(err));
        setTimeout(() => navigate('/auth/login'), 3000);
      }
    };
    finishOAuth();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <div className="text-slate-400">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-white">Completing sign in...</div>
    </div>
  );
};

export default AuthCallback;
