import { useState, useRef, useEffect } from 'react';

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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.crossOrigin = "anonymous";
    
    // Audio event listeners
    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      setDuration(audio.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      console.log('Audio ended');
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    const handleCanPlay = () => {
      console.log('Audio can play');
    };
    
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      console.log('Audio load started');
    };

    const handleLoadedData = () => {
      console.log('Audio data loaded');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);

    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const playTrack = async (track: AudioTrack) => {
    if (!audioRef.current) return;
    
    console.log('🎵 Attempting to play track:', track.name, 'URL:', track.url);
    
    try {
      // If it's a new track, load it
      if (!currentTrack || currentTrack.id !== track.id) {
        console.log('📀 Loading new track:', track.name);
        audioRef.current.src = track.url;
        setCurrentTrack(track);
        setDuration(track.duration); // Set expected duration immediately
        
        // Load the audio
        audioRef.current.load();
        
        // Wait for the audio to be ready
        await new Promise((resolve, reject) => {
          const handleCanPlay = () => {
            console.log('✅ Audio ready to play:', track.name);
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            resolve(true);
          };
          
          const handleError = (e: Event) => {
            console.error('❌ Audio load error:', e);
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            reject(e);
          };
          
          audioRef.current?.addEventListener('canplay', handleCanPlay);
          audioRef.current?.addEventListener('error', handleError);
          
          // Timeout after 5 seconds
          setTimeout(() => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('error', handleError);
            console.log('⏰ Audio load timeout, proceeding anyway');
            resolve(true); // Proceed even if timeout
          }, 5000);
        });
      }
      
      console.log('▶️ Starting playback...');
      await audioRef.current.play();
      setIsPlaying(true);
      console.log('🎶 Now playing:', track.name);
      
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      
      // Try to play anyway - sometimes the error is misleading
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('🎶 Playback started despite error');
      } catch (secondError) {
        console.error('❌ Second attempt failed:', secondError);
        
        // Fallback to synthesized audio
        console.log('🔄 Falling back to synthesized audio');
        createSynthesizedTrack(track);
      }
    }
  };

  const createSynthesizedTrack = (track: AudioTrack) => {
    console.log('🎹 Creating synthesized version of:', track.name);
    
    // Create a more musical synthesized track
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = track.duration;
    
    // Create a simple melody
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C major scale
    let noteIndex = 0;
    
    const playNote = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequencies[noteIndex % frequencies.length], audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      noteIndex++;
    };
    
    // Play notes every 500ms
    const noteInterval = setInterval(playNote, 500);
    
    // Set playing state
    setIsPlaying(true);
    setCurrentTime(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        if (newTime >= duration) {
          clearInterval(progressInterval);
          clearInterval(noteInterval);
          setIsPlaying(false);
          setCurrentTime(0);
          return 0;
        }
        return newTime;
      });
    }, 100);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('⏸️ Playback paused');
    }
  };

  const resume = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        console.log('▶️ Playback resumed');
      }).catch(error => {
        console.error('❌ Error resuming audio:', error);
      });
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      console.log('⏹️ Playback stopped');
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      console.log('⏭️ Seeked to:', time);
    }
  };

  const setVolumeLevel = (newVolume: number) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    console.log('🔊 Volume set to:', Math.round(vol * 100) + '%');
  };

  // Play a notification sound for interactions
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  };

  // Generate a simple beat sound
  const playBeatSound = (frequency = 440, duration = 0.1) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    currentTrack,
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