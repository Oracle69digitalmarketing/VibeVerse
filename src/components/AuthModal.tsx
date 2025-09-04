import React from 'react';
import { X, Music, Loader2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (provider: string) => void;
  onSpotifyLogin: () => void;
  loading: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, onSpotifyLogin, loading }) => {
  const handleSpotifyLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Spotify login clicked');
    onSpotifyLogin();
  };

  const handleGoogleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Google login clicked');
    onLogin('google');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to VibeVerse</h2>
          <p className="text-white/70">Sign in to start your musical journey</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSpotifyLogin}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-semibold">Connecting...</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Music className="w-4 h-4 text-green-500" />
                </div>
                <span className="font-semibold">Continue with Spotify</span>
              </>
            )}
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-semibold">Connecting...</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-500 font-bold text-sm">G</span>
                </div>
                <span className="font-semibold">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-xs">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;