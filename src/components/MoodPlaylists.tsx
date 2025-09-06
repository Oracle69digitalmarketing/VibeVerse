import React, { useState } from 'react';
import { Play, TrendingUp, Clock, Users, Sparkles, Sun, Trophy, Leaf, Zap, Heart, Brain, Music, Pause, Coffee, Moon } from 'lucide-react';
import SpotifyPlayer from './SpotifyPlayer';
import { useAudio } from '../hooks/useAudio';
import { getTracksByMood, MusicTrack } from '../data/musicTracks';

const MoodPlaylists: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<MusicTrack[]>([]);
  
  const { 
    playTrack, 
    pause, 
    resume, 
    playNotificationSound, 
    currentTime, 
    duration, 
    volume, 
    seek, 
    setVolume 
  } = useAudio();

  const moods = [
    { 
      id: 'chill', 
      name: 'Chill Vibes', 
      icon: Coffee, 
      color: 'from-blue-400 to-cyan-400',
      description: 'Relaxed and mellow tracks for unwinding'
    },
    { 
      id: 'hype', 
      name: 'Hype Energy', 
      icon: Zap, 
      color: 'from-orange-400 to-red-400',
      description: 'High-energy beats to pump you up'
    },
    { 
      id: 'reflective', 
      name: 'Reflective', 
      icon: Brain, 
      color: 'from-purple-400 to-indigo-400',
      description: 'Thoughtful music for deep contemplation'
    },
    { 
      id: 'romantic', 
      name: 'Romantic', 
      icon: Heart, 
      color: 'from-pink-400 to-rose-400',
      description: 'Love songs and intimate melodies'
    },
    { 
      id: 'morning', 
      name: 'Morning Boost', 
      icon: Sun, 
      color: 'from-yellow-400 to-orange-400',
      description: 'Uplifting tracks to start your day'
    },
    { 
      id: 'night', 
      name: 'Night Vibes', 
      icon: Moon, 
      color: 'from-indigo-400 to-purple-400',
      description: 'Smooth late-night listening'
    },
  ];

  const generatePlaylist = async (moodId: string) => {
    setIsGenerating(true);
    setSelectedMood(moodId);
    
    // Simulate AI generation with real tracks
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get real tracks for the selected mood
    const tracks = getTracksByMood(moodId);
    setGeneratedTracks(tracks);
    
    setIsGenerating(false);
    playNotificationSound();
  };

  const handlePlayTrack = async (track: any) => {
    console.log('MoodPlaylists: Playing track:', track.name);
    setCurrentTrack(track);
    
    try {
      await playTrack({
        id: track.id,
        name: track.name,
        artist: track.artist,
        url: track.url,
        duration: track.duration
      });
      setIsPlaying(true);
      console.log('✅ Track started playing successfully');
    } catch (error) {
      console.error('Error playing track:', error);
      // Don't show alert, let the fallback handle it
      setIsPlaying(true);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      if (currentTrack) {
        resume();
        setIsPlaying(true);
      }
    }
  };

  const nextTrack = () => {
    const currentIndex = generatedTracks.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % generatedTracks.length;
    setCurrentTrack(generatedTracks[nextIndex]);
  };

  const previousTrack = () => {
    const currentIndex = generatedTracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex === 0 ? generatedTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(generatedTracks[prevIndex]);
  };

  const currentTime = new Date().getHours();
  const suggestedMood = currentTime < 12 ? 'morning' : currentTime < 18 ? 'hype' : 'night';

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Mood Playlists</h1>
        <p className="text-white/70">AI-curated music for every emotion</p>
      </div>

      {/* AI Suggestion */}
      <div className="max-w-md mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-4 border border-purple-400/30">
        <div className="flex items-center space-x-3 mb-3">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <span className="text-white font-semibold">AI Suggestion</span>
        </div>
        <p className="text-white/80 text-sm mb-3">
          Based on the time ({currentTime}:00) and your listening history, we recommend:
        </p>
        <button
          onClick={() => generatePlaylist(suggestedMood)}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          Generate {moods.find(m => m.id === suggestedMood)?.name} Playlist
        </button>
      </div>

      {/* Mood Grid */}
      <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          
          return (
            <button
              key={mood.id}
              onClick={() => generatePlaylist(mood.id)}
              disabled={isGenerating}
              className={`p-4 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'bg-white/20 border-white/40 scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${mood.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{mood.name}</h3>
              <p className="text-white/60 text-xs">{mood.description}</p>
            </button>
          );
        })}
      </div>

      {/* Generated Playlist */}
      {selectedMood && (
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">
              {moods.find(m => m.id === selectedMood)?.name} Playlist
            </h3>
            <Clock className="w-5 h-5 text-white/60" />
          </div>

          {isGenerating ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-white/10 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-white/10 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
              <div className="text-center text-white/60 text-sm mt-4">
                <Sparkles className="w-4 h-4 inline mr-2 animate-spin" />
                AI is curating your perfect playlist...
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedTracks.map((track, index) => (
                <div key={track.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{track.name}</div>
                    <div className="text-white/60 text-xs">{track.artist} • {Math.floor(track.duration / 60)}:{(track.duration % 60).toFixed(0).padStart(2, '0')}</div>
                  </div>
                  <button 
                    onClick={() => handlePlayTrack(track)}
                    className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105">
                  Save to Spotify
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Playing Track */}
      {currentTrack && (
        <div className="max-w-md mx-auto">
          <SpotifyPlayer
            track={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            onPlayPause={togglePlayback}
            onNext={nextTrack}
            onPrevious={previousTrack}
            onSeek={seek}
            onVolumeChange={setVolume}
          />
        </div>
      )}

      {/* Recent Playlists */}
      <div className="max-w-md mx-auto">
        <h3 className="text-white font-semibold mb-4">Recent Playlists</h3>
        <div className="space-y-3">
          {['Workout Hype', 'Study Focus', 'Evening Chill'].map((playlist, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{playlist}</div>
                <div className="text-white/60 text-sm">15 tracks • 1h 2m</div>
              </div>
              <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Play className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodPlaylists;