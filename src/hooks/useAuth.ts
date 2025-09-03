import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  avatar?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('vibeverse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (provider: string) => {
    setLoading(true);
    
    try {
      // Simulate authentication with more realistic flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: `${provider}_${Date.now()}`,
        name: provider === 'spotify' ? 'Music Lover' : 'VibeVerse User',
        email: `user@${provider}.com`,
        provider,
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`
      };

      setUser(mockUser);
      localStorage.setItem('vibeverse_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithSpotify = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would redirect to Spotify OAuth
      // For demo purposes, we'll simulate the flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const spotifyUser: User = {
        id: `spotify_${Date.now()}`,
        name: 'Spotify User',
        email: 'user@spotify.com',
        provider: 'spotify',
        avatar: `https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`
      };

      setUser(spotifyUser);
      localStorage.setItem('vibeverse_user', JSON.stringify(spotifyUser));
    } catch (error) {
      console.error('Spotify login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibeverse_user');
  };

  return {
    user,
    loading,
    login,
    loginWithSpotify,
    logout
  };
};