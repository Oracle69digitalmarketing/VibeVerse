import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Download, Waveform, Sparkles, Volume2 } from 'lucide-react';

const RemixLab: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('lofi');
  const [generatedBeat, setGeneratedBeat] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const genres = [
    { id: 'lofi', name: 'Lo-fi', color: 'from-blue-400 to-cyan-400', description: 'Chill and relaxed' },
    { id: 'afrobeats', name: 'Afrobeats', color: 'from-orange-400 to-red-400', description: 'Rhythmic and vibrant' },
    { id: 'trap', name: 'Trap', color: 'from-purple-400 to-pink-400', description: 'Heavy bass and hi-hats' },
    { id: 'house', name: 'House', color: 'from-green-400 to-emerald-400', description: 'Electronic dance vibes' },
    { id: 'jazz', name: 'Jazz', color: 'from-yellow-400 to-orange-400', description: 'Smooth and sophisticated' },
    { id: 'ambient', name: 'Ambient', color: 'from-indigo-400 to-purple-400', description: 'Atmospheric and dreamy' },
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 0.1);
      }, 100);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setHasRecording(true);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const generateBeat = async () => {
    if (!hasRecording) return;
    
    setIsGenerating(true);
    
    // Simulate AI beat generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGeneratedBeat(`${selectedGenre}-remix-${Date.now()}`);
    setIsGenerating(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Remix Lab</h1>
        <p className="text-white/70">Create beats from your voice</p>
      </div>

      {/* Recording Section */}
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center">
            <Mic className="w-5 h-5 mr-2" />
            Voice Recording
          </h2>

          {/* Recording Visualizer */}
          <div className="relative h-32 bg-black/30 rounded-xl mb-6 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {isRecording ? (
                <div className="flex items-center space-x-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 60 + 20}px`,
                        animationDelay: `${i * 50}ms`
                      }}
                    />
                  ))}
                </div>
              ) : hasRecording ? (
                <div className="flex items-center space-x-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-full"
                      style={{ height: `${Math.random() * 40 + 10}px` }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-white/40 text-center">
                  <Waveform className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Your voice will appear here</p>
                </div>
              )}
            </div>
            
            {isRecording && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                {recordingTime.toFixed(1)}s
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-110 shadow-lg"
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-110 shadow-lg"
              >
                <Square className="w-8 h-8 text-white" />
              </button>
            )}

            {hasRecording && (
              <button
                onClick={togglePlayback}
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Genre Selection */}
      <div className="max-w-md mx-auto">
        <h2 className="text-white font-semibold text-lg mb-4">Choose Your Genre</h2>
        <div className="grid grid-cols-2 gap-3">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                selectedGenre === genre.id
                  ? 'bg-white/20 border-white/40 scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              <div className={`w-8 h-8 bg-gradient-to-r ${genre.color} rounded-lg mx-auto mb-2`}></div>
              <div className="text-white font-medium text-sm">{genre.name}</div>
              <div className="text-white/60 text-xs">{genre.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {hasRecording && (
        <div className="max-w-md mx-auto">
          <button
            onClick={generateBeat}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Generating Beat...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate {genres.find(g => g.id === selectedGenre)?.name} Beat</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Generated Beat */}
      {generatedBeat && (
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            Your Generated Beat
          </h3>

          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${genres.find(g => g.id === selectedGenre)?.color} rounded-xl flex items-center justify-center`}>
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">
                  {genres.find(g => g.id === selectedGenre)?.name} Remix
                </div>
                <div className="text-white/60 text-sm">Generated from your voice</div>
              </div>
            </div>
          </div>

          {/* Beat Visualizer */}
          <div className="h-20 bg-black/30 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
            <div className="flex items-center space-x-1">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.sin(i * 0.5) * 20 + 30}px`,
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={togglePlayback}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      {/* Recent Remixes */}
      <div className="max-w-md mx-auto">
        <h3 className="text-white font-semibold mb-4">Recent Remixes</h3>
        <div className="space-y-3">
          {['Lo-fi Morning Hum', 'Trap Vocal Chop', 'Ambient Whistle'].map((remix, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Waveform className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{remix}</div>
                <div className="text-white/60 text-sm">2 days ago • 1:23</div>
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

export default RemixLab;