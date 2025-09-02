import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy, Target } from 'lucide-react';

const RhythmGames: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameTime, setGameTime] = useState(0);
  const [beats, setBeats] = useState<Array<{ id: number; position: number; hit: boolean }>>([]);
  const [currentSong] = useState({
    title: "Blinding Lights",
    artist: "The Weeknd",
    bpm: 171
  });

  const gameRef = useRef<HTMLDivElement>(null);
  const beatIdRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let beatInterval: NodeJS.Timeout;

    if (isPlaying) {
      // Game timer
      interval = setInterval(() => {
        setGameTime(prev => prev + 0.1);
      }, 100);

      // Beat generation based on BPM
      const beatDelay = (60 / currentSong.bpm) * 1000;
      beatInterval = setInterval(() => {
        setBeats(prev => [
          ...prev,
          { id: beatIdRef.current++, position: 0, hit: false }
        ]);
      }, beatDelay);
    }

    return () => {
      clearInterval(interval);
      clearInterval(beatInterval);
    };
  }, [isPlaying, currentSong.bpm]);

  useEffect(() => {
    // Move beats down the screen
    const moveInterval = setInterval(() => {
      setBeats(prev => 
        prev
          .map(beat => ({ ...beat, position: beat.position + 2 }))
          .filter(beat => beat.position < 100)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, []);

  const handleBeatHit = () => {
    const hitZone = beats.find(beat => 
      beat.position >= 80 && beat.position <= 95 && !beat.hit
    );

    if (hitZone) {
      const timing = Math.abs(87.5 - hitZone.position);
      const points = Math.max(100 - timing * 10, 10);
      
      setScore(prev => prev + Math.round(points));
      setCombo(prev => prev + 1);
      setBeats(prev => 
        prev.map(beat => 
          beat.id === hitZone.id ? { ...beat, hit: true } : beat
        )
      );

      // Update accuracy
      setAccuracy(prev => Math.min(100, prev + (points - 50) / 10));
    } else {
      setCombo(0);
      setAccuracy(prev => Math.max(0, prev - 5));
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setCombo(0);
    setAccuracy(100);
    setGameTime(0);
    setBeats([]);
    beatIdRef.current = 0;
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Rhythm Games</h1>
        <p className="text-white/70">Tap to the beat and feel the music</p>
      </div>

      {/* Current Song */}
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">{currentSong.title}</h3>
            <p className="text-white/60">{currentSong.artist}</p>
            <p className="text-white/40 text-sm">{currentSong.bpm} BPM</p>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-white/60 text-sm">Score</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-orange-400">{combo}x</div>
          <div className="text-white/60 text-sm">Combo</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-green-400">{accuracy.toFixed(0)}%</div>
          <div className="text-white/60 text-sm">Accuracy</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-md mx-auto">
        <div 
          ref={gameRef}
          className="relative h-96 bg-black/30 rounded-2xl border-2 border-white/20 overflow-hidden"
        >
          {/* Beat Track */}
          <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center">
            <div className="w-1 bg-white/20"></div>
          </div>

          {/* Hit Zone */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-purple-400 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-400" />
          </div>

          {/* Beats */}
          {beats.map(beat => (
            <div
              key={beat.id}
              className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full transition-all duration-100 ${
                beat.hit 
                  ? 'bg-green-500 scale-150 opacity-0' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
              }`}
              style={{ 
                top: `${beat.position}%`,
                boxShadow: beat.hit ? 'none' : '0 0 20px rgba(168, 85, 247, 0.5)'
              }}
            />
          ))}

          {/* Game Over Overlay */}
          {!isPlaying && gameTime > 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-white/70 mb-4">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-110 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
          
          <button
            onClick={resetGame}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tap Button */}
        <button
          onClick={handleBeatHit}
          className="w-full mt-6 py-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400 rounded-2xl text-white font-bold text-xl hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 transition-all transform active:scale-95"
        >
          TAP TO THE BEAT
        </button>
      </div>

      {/* Instructions */}
      <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-2">How to Play</h3>
        <ul className="text-white/70 text-sm space-y-1">
          <li>• Tap when the beat reaches the target zone</li>
          <li>• Perfect timing gives maximum points</li>
          <li>• Build combos for bonus multipliers</li>
          <li>• Keep your accuracy high for better scores</li>
        </ul>
      </div>
    </div>
  );
};

export default RhythmGames;