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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      analyserRef.current = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current!);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);
    }
  }, []);

  const playTrack = useCallback(async (track: AudioTrack) => {
    setLoading(true);
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (!audioContextRef.current) {
        initAudioContext();
    }

    audioRef.current.src = track.url;
    audioRef.current.volume = volume;
    audioRef.current.crossOrigin = "anonymous";

    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current!.duration);
      setCurrentTrack(track);
      setLoading(false);
    });

    audioRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.current!.currentTime);
    });

    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audioRef.current.addEventListener('error', (e) => {
      console.error("Error playing audio:", e);
      setLoading(false);
    });

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      setLoading(false);
    }
  }, [volume]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolumeLevel = useCallback((newVolume: number) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
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
    analyser: analyserRef.current,
    playTrack,
    pause,
    resume,
    stop,
    seek,
    setVolume: setVolumeLevel,
  };
};