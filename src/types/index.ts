export interface RadioStation {
  id: string;
  name: string;
  description: string;
  image_url: string;
  stream_url: string;
  category: string;
  is_active: boolean;
  current_track?: string;
  listeners_count?: number;
  created_at: string;
  featured?: boolean; // Add this line
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  status: string;
  country: string;
  avatar_url?: string;
  is_premium: boolean;
  is_guest: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  station_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface PlayerState {
  isPlaying: boolean;
  currentStation: RadioStation | null;
  volume: number;
  sleepTimer: number | null;
  sleepTimerEndTime: Date | null;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
}