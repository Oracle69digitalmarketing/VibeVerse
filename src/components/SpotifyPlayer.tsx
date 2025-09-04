import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  image: string;
}

interface SpotifyPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious
}) => {
  const { 
    currentTime, 
    duration, 
    volume, 
    setVolume, 
    seek,
    playNotificationSound 
  } = useAudio();
  
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = (newProgress / 100) * track.duration;
    seek(newTime);
    setProgress(newProgress);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);
  };

  const handleShuffleClick = () => {
    setShuffle(!shuffle);
    playNotificationSound();
  };

  const handleRepeatClick = () => {
    setRepeat(!repeat);
    playNotificationSound();
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <img 
            src={track.image} 
            alt={track.album}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-8 h-8 text-white">♪</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{track.name}</h3>
          <p className="text-white/60 text-sm truncate">{track.artist}</p>
          <p className="text-white/40 text-xs truncate">{track.album}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-white/60 text-xs mb-2">
          <span>{formatTime(currentTime || (progress / 100) * track.duration)}</span>
          <span>{formatTime(track.duration)}</span>
        </div>
        <div 
          className="w-full bg-white/20 rounded-full h-1 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShuffleClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              shuffle ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={onPrevious}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <SkipBack className="w-4 h-4 text-white" />
          </button>
        </div>

        <button
          onClick={onPlayPause}
          className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-110 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNext}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <SkipForward className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleRepeatClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              repeat ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-white/10">
        <Volume2 className="w-4 h-4 text-white/60" />
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
          />
        </div>
        <span className="text-white/60 text-xs w-8">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};

export default SpotifyPlayer;