import { useState, useRef } from 'react';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordingUrl(url);
        setHasRecording(true);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
        
        console.log('Recording saved, duration:', recordingTime.toFixed(1), 'seconds');
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Update recording time
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 0.1);
      }, 100);

      console.log('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      console.log('Recording stopped');
    }
  };

  const playRecording = () => {
    if (recordingUrl && !isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(recordingUrl);
      audioRef.current.volume = 0.8;
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      
      audioRef.current.onerror = (error) => {
        console.error('Error playing recording:', error);
        setIsPlaying(false);
      };
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        console.log('Playing recording');
      }).catch(error => {
        console.error('Error playing recording:', error);
      });
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const clearRecording = () => {
    stopPlayback();
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }
    setRecordingUrl(null);
    setHasRecording(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  return {
    isRecording,
    hasRecording,
    isPlaying,
    recordingTime,
    recordingUrl,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    clearRecording
  };
};