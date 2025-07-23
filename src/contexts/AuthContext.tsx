import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getCurrentUser, getUserProfile } from '../lib/supabase';
import { User, AuthState } from '../types';

interface AuthContextType {
  authState: AuthState;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  continueAsGuest: () => void;
  updateProfile: (updates: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isGuest: false
  });

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const { data: profile } = await getUserProfile(user.id);
          setAuthState({
            user: profile,
            isLoading: false,
            isAuthenticated: true,
            isGuest: false
          });
        } else {
          // Check for guest mode
          const isGuest = localStorage.getItem('isGuest') === 'true';
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            isGuest
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          isGuest: false
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await getUserProfile(session.user.id);
          setAuthState({
            user: profile,
            isLoading: false,
            isAuthenticated: true,
            isGuest: false
          });
          localStorage.removeItem('isGuest');
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            isGuest: localStorage.getItem('isGuest') === 'true'
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (data.user && !error) {
      // Create user profile
      await supabase.from('users').insert([
        {
          id: data.user.id,
          email: data.user.email,
          username: userData.username,
          full_name: userData.full_name,
          status: userData.status || 'Music lover',
          country: userData.country || 'Myanmar 🇲🇲',
          is_premium: false,
          is_guest: false
        }
      ]);
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/radio-m-web/auth/callback`
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isGuest');
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
  };

  const continueAsGuest = () => {
    localStorage.setItem('isGuest', 'true');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isGuest: true
    });
  };

  const updateProfile = async (updates: any) => {
    if (!authState.user) return { error: 'No user logged in' };
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', authState.user.id)
      .select()
      .single();

    if (data && !error) {
      setAuthState(prev => ({
        ...prev,
        user: data
      }));
    }

    return { data, error };
  };

  return (
    <AuthContext.Provider value={{
      authState,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      continueAsGuest,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};