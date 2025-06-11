import React, { useEffect, useState } from 'react';
import { RadioStation } from '../types';
import { getRadioStations } from '../lib/supabase';
import StationCard from '../components/RadioStation/StationCard';
import Header from '../components/Layout/Header';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const { data, error } = await getRadioStations();
      if (error) {
        setError('Failed to load radio stations');
        // Fallback to mock data
        loadMockStations();
      } else if (data) {
        setStations(data);
      } else {
        // No data from Supabase, use mock data
        loadMockStations();
      }
    } catch (err) {
      console.error('Error loading stations:', err);
      loadMockStations();
    } finally {
      setLoading(false);
    }
  };

  const loadMockStations = () => {
    const mockStations: RadioStation[] = [
      {
        id: '1',
        name: 'Myanmar Radio',
        description: 'Classic Burmese music and news',
        image_url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?w=200&h=200&fit=crop',
        stream_url: 'https://stream-relay-geo.ntslive.net/stream',
        category: 'music',
        is_active: true,
        current_track: 'Traditional Myanmar Folk Song',
        listeners_count: 1247,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Golden FM',
        description: 'Traditional and modern Myanmar hits',
        image_url: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?w=200&h=200&fit=crop',
        stream_url: 'https://stream-relay-geo.ntslive.net/stream2',
        category: 'music',
        is_active: true,
        current_track: 'Modern Burmese Pop',
        listeners_count: 892,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Yangon FM',
        description: 'News, talk shows, and entertainment',
        image_url: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?w=200&h=200&fit=crop',
        stream_url: 'https://stream-relay-geo.ntslive.net/stream3',
        category: 'talk',
        is_active: true,
        current_track: 'Morning News Update',
        listeners_count: 2156,
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Buddha FM',
        description: 'Spiritual and meditation content',
        image_url: 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?w=200&h=200&fit=crop',
        stream_url: 'https://stream-relay-geo.ntslive.net/stream4',
        category: 'spiritual',
        is_active: true,
        current_track: 'Meditation Chants',
        listeners_count: 634,
        created_at: new Date().toISOString()
      }
    ];
    setStations(mockStations);
  };

  const playStation = (station: RadioStation) => {
    // Implement the play functionality here
    console.log('Playing station:', station);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <Header title="Myanmar Radio" />
      
      <main className="px-6 py-6 pb-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            မင်္ဂလာပါ! Welcome
          </h2>
          <p className="text-slate-400">
            Discover the best Burmese radio stations
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700/30 rounded-2xl">
            <p className="text-yellow-400 text-sm">{error}</p>
            <p className="text-yellow-300 text-xs mt-1">Using demo stations</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="bg-slate-800/40 rounded-2xl p-4 animate-pulse"
                style={{
                  boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.4), -2px -2px 8px rgba(148, 163, 184, 0.1)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-700 rounded-2xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                  </div>
                  <div className="w-12 h-12 bg-slate-700 rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stations.map((station) => (
              <div key={station.id} onClick={() => { playStation(station); navigate(`/player`); }} className="cursor-pointer">
                <StationCard station={station} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;