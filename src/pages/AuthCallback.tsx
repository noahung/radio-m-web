import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finishOAuth = async () => {
      await handleOAuthCallback();
      navigate('/');
    };
    finishOAuth();
  }, [navigate]);

  return <div className="flex justify-center items-center min-h-screen text-white">Signing you in...</div>;
};

export default AuthCallback;
