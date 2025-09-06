import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';

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
  currentTime: number;
  duration: number;
  volume: number;
  loading: boolean;
  analyser: AnalyserNode | null;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  loading,
  analyser,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange
}) => {
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const trackDuration = duration || track.duration;
    if (trackDuration > 0) {
      setProgress((currentTime / trackDuration) * 100);
    }
  }, [currentTime, duration, track.duration]);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `hsl(${barHeight + 100}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${barHeight}, 100%, 50%)`);
        canvasCtx.fillStyle = gradient;

        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    };

    draw();
  }, [analyser]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const trackDuration = duration || track.duration;
    const newTime = (newProgress / 100) * trackDuration;
    onSeek(newTime);
    setProgress(newProgress);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    onVolumeChange(newVolume);
  };

  const handleShuffleClick = () => {
    setShuffle(!shuffle);
  };

  const handleRepeatClick = () => {
    setRepeat(!repeat);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
      {/* Track Info */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          {track.image ? (
            <img 
              src={track.image} 
              alt={track.album}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                const musicIcon = document.createElement('div');
                musicIcon.innerHTML = '♪';
                musicIcon.className = 'text-white text-2xl';
                target.parentElement?.appendChild(musicIcon);
              }}
            />
          ) : (
            <div className="text-white text-2xl">♪</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{track.name} {loading && <span className="text-xs text-white/50">(loading...)</span>}</h3>
          <p className="text-white/60 text-sm truncate">{track.artist}</p>
          <p className="text-white/40 text-xs truncate">{track.album}</p>
          <p className="text-white/40 text-xs">
            {isPlaying ? '🔊 Playing' : '⏸️ Paused'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-white/60 text-xs mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || track.duration)}</span>
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
      <canvas ref={canvasRef} width="300" height="100" className="mt-4"></canvas>
    </div>
  );
};

export default SpotifyPlayer;