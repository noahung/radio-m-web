import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  });
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database helpers
export const getRadioStations = async () => {
  const { data, error } = await supabase
    .from('radio_stations')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getStationComments = async (stationId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users(id, username, avatar_url)
    `)
    .eq('station_id', stationId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const addComment = async (stationId: string, content: string, userId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        station_id: stationId,
        content,
        user_id: userId
      }
    ])
    .select(`
      *,
      user:users(id, username, avatar_url)
    `)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

// Real-time subscriptions
export const subscribeToComments = (stationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`comments:${stationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `station_id=eq.${stationId}`
      },
      callback
    )
    .subscribe();
};