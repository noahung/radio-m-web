/*
  # Initial Myanmar Radio Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `username` (text, unique)
      - `full_name` (text)
      - `status` (text, default: 'Music lover')
      - `country` (text, default: 'Myanmar 🇲🇲')
      - `avatar_url` (text, nullable)
      - `is_premium` (boolean, default: false)
      - `is_guest` (boolean, default: false)
      - `created_at` (timestamp)

    - `radio_stations`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `stream_url` (text)
      - `category` (text)
      - `current_track` (text, nullable)
      - `listeners_count` (integer, default: 0)
      - `is_active` (boolean, default: true)
      - `created_at` (timestamp)

    - `comments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `station_id` (uuid, references radio_stations)
      - `content` (text)
      - `created_at` (timestamp)

    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `station_id` (uuid, references radio_stations)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to radio stations
    - Add policies for authenticated users to read/write comments
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  status text DEFAULT 'Music lover',
  country text DEFAULT 'Myanmar 🇲🇲',
  avatar_url text,
  is_premium boolean DEFAULT false,
  is_guest boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create radio_stations table
CREATE TABLE IF NOT EXISTS radio_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  stream_url text NOT NULL,
  category text NOT NULL,
  current_track text,
  listeners_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  station_id uuid REFERENCES radio_stations(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  station_id uuid REFERENCES radio_stations(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, station_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Radio stations policies (public read access)
CREATE POLICY "Anyone can read active radio stations"
  ON radio_stations
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Comments policies
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO anon, authenticated;

CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can read own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample radio stations
INSERT INTO radio_stations (name, description, image_url, stream_url, category, current_track, listeners_count) VALUES
  ('Myanmar Radio', 'Classic Burmese music and news', 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?w=200&h=200&fit=crop', 'https://stream-relay-geo.ntslive.net/stream', 'music', 'Traditional Myanmar Folk Song', 1247),
  ('Golden FM', 'Traditional and modern Myanmar hits', 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?w=200&h=200&fit=crop', 'https://stream-relay-geo.ntslive.net/stream2', 'music', 'Modern Burmese Pop', 892),
  ('Yangon FM', 'News, talk shows, and entertainment', 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?w=200&h=200&fit=crop', 'https://stream-relay-geo.ntslive.net/stream3', 'talk', 'Morning News Update', 2156),
  ('Buddha FM', 'Spiritual and meditation content', 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?w=200&h=200&fit=crop', 'https://stream-relay-geo.ntslive.net/stream4', 'spiritual', 'Meditation Chants', 634);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_station_id ON comments(station_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_radio_stations_category ON radio_stations(category);
CREATE INDEX IF NOT EXISTS idx_radio_stations_is_active ON radio_stations(is_active);