import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
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
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: `${provider}_${Date.now()}`,
      name: provider === 'spotify' ? 'Music Lover' : 'VibeVerse User',
      email: `user@${provider}.com`,
      provider
    };

    setUser(mockUser);
    localStorage.setItem('vibeverse_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibeverse_user');
  };

  return {
    user,
    loading,
    login,
    logout
  };
};