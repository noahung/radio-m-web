import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback, supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('OAuth callback hash:', window.location.hash);
    const finishOAuth = async () => {
      try {
        // Process the URL hash to set the session
        if (window.location.hash) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1) // remove the # character
          );
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken) {
            console.log('Found access token, setting session');
            // Set the session manually if needed
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
          }
        }
        
        // Ensure user profile is created in public.users
        console.log('Calling handleOAuthCallback');
        await handleOAuthCallback();
        
        // Check session again and redirect
        console.log('Checking session after callback');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session after callback:', session);
        
        if (session && session.user) {
          console.log('User authenticated, navigating to home');
          navigate('/home');
        } else {
          console.error('No session found after authentication');
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
