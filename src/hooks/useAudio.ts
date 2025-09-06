import { useState, useRef, useEffect, useCallback } from 'react';

export interface AudioTrack {
  id: string;
  name: string;
  artist: string;
  url: string;
  duration: number;
}

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [loading, setLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Create different synthesized music for each track
  const createSynthesizedMusic = useCallback((track: AudioTrack) => {
    console.log('🎹 Creating synthesized music for:', track.name);
    
    const audioContext = initAudioContext();
    const trackDuration = track.duration;
    
    // Different musical patterns based on track ID
    const getMusicalPattern = (trackId: string) => {
      const patterns = {
        'chill_1': { scale: [261.63, 293.66, 329.63, 392.00, 440.00], tempo: 800, wave: 'sine' },
        'chill_2': { scale: [220.00, 246.94, 277.18, 329.63, 369.99], tempo: 1000, wave: 'triangle' },
        'hype_1': { scale: [130.81, 146.83, 164.81, 196.00, 220.00], tempo: 400, wave: 'sawtooth' },
        'hype_2': { scale: [174.61, 196.00, 220.00, 261.63, 293.66], tempo: 300, wave: 'square' },
        'romantic_1': { scale: [293.66, 329.63, 369.99, 440.00, 493.88], tempo: 1200, wave: 'sine' },
        'morning_1': { scale: [349.23, 392.00, 440.00, 523.25, 587.33], tempo: 600, wave: 'triangle' },
        'night_1': { scale: [146.83, 164.81, 185.00, 220.00, 246.94], tempo: 1500, wave: 'sine' },
        'reflective_1': { scale: [196.00, 220.00, 246.94, 293.66, 329.63], tempo: 2000, wave: 'triangle' }
      };
      return patterns[trackId as keyof typeof patterns] || patterns['chill_1'];
    };

    const pattern = getMusicalPattern(track.id);
    let noteIndex = 0;
    let startTime = audioContext.currentTime;
    
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(trackDuration);
    setCurrentTrack(track);

    const playNote = () => {
      if (!audioContextRef.current) return;
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(
        pattern.scale[noteIndex % pattern.scale.length], 
        audioContextRef.current.currentTime
      );
      oscillator.type = pattern.wave as OscillatorType;
      
      gainNode.gain.setValueAtTime(volume * 0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.8);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.8);
      
      noteIndex++;
    };

    // Play notes at intervals
    const noteInterval = setInterval(playNote, pattern.tempo);
    
    // Update time every 100ms
    const updateTime = () => {
      const elapsed = audioContext.currentTime - startTime;
      setCurrentTime(elapsed);
      
      if (elapsed >= trackDuration) {
        clearInterval(noteInterval);
        clearInterval(timeUpdateIntervalRef.current!);
        setIsPlaying(false);
        setCurrentTime(0);
        console.log('🎵 Synthesized music finished');
      }
    };

    timeUpdateIntervalRef.current = setInterval(updateTime, 100);
    
    // Store intervals for cleanup
    return () => {
      clearInterval(noteInterval);
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [volume, initAudioContext]);

  const playTrack = useCallback(async (track: AudioTrack) => {
    console.log('🎵 Playing track:', track.name, 'URL:', track.url);
    setLoading(true);
    
    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }

    try {
      // Try to play real audio first
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = track.url;
      audioRef.current.volume = volume;
      audioRef.current.crossOrigin = "anonymous";
      
      // Set up event listeners
      const handleLoadedMetadata = () => {
        console.log('✅ Real audio loaded:', track.name, 'Duration:', audioRef.current!.duration);
        setDuration(audioRef.current!.duration);
        setCurrentTrack(track);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current!.currentTime);
      };
      
      const handleEnded = () => {
        console.log('🎵 Real audio ended');
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      const handleError = (e: Event) => {
        console.log('❌ Real audio failed, using synthesized music');
        createSynthesizedMusic(track);
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
      
      // Try to load and play
      audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
      setLoading(false);
      console.log('🎶 Real audio playing:', track.name);
      
    } catch (error) {
      console.log('🔄 Real audio failed, creating synthesized music');
      setLoading(false);
      createSynthesizedMusic(track);
    }
  }, [volume, createSynthesizedMusic]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('⏸️ Playback paused');
    }
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        console.log('▶️ Playback resumed');
      }).catch(() => {
        console.log('🔄 Resume failed, recreating synthesized music');
        createSynthesizedMusic(currentTrack);
      });
    }
  }, [currentTrack, createSynthesizedMusic]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }
    setIsPlaying(false);
    setCurrentTime(0);
    console.log('⏹️ Playback stopped');
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      console.log('⏭️ Seeked to:', time);
    }
  }, []);

  const setVolumeLevel = useCallback((newVolume: number) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    console.log('🔊 Volume set to:', Math.round(vol * 100) + '%');
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, [initAudioContext]);

  const playBeatSound = useCallback((frequency = 440, duration = 0.1) => {
    try {
      const audioContext = initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error('Error playing beat sound:', error);
    }
  }, [initAudioContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    currentTrack,
    loading,
    playTrack,
    pause,
    resume,
    stop,
    seek,
    setVolume: setVolumeLevel,
    playNotificationSound,
    playBeatSound
  };
};