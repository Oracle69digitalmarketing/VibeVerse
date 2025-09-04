import React, { useState } from 'react';
import { Plus, Heart, Calendar, Camera, Music, Edit3, Trash2, Sun, Trophy, Clock, Leaf, Zap } from 'lucide-react';

interface Memory {
  id: number;
  title: string;
  song: string;
  artist: string;
  date: string;
  note: string;
  emotion: string;
  hasPhoto: boolean;
}

const MemoryTracks: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 1,
      title: "First Dance",
      song: "Perfect",
      artist: "Ed Sheeran",
      date: "2023-06-15",
      note: "Our wedding day. This song played during our first dance and I'll never forget how magical that moment felt.",
      emotion: "love",
      hasPhoto: true
    },
    {
      id: 2,
      title: "Road Trip Adventure",
      song: "Life is a Highway",
      artist: "Tom Cochrane",
      date: "2023-07-22",
      note: "Driving through the mountains with my best friends. Windows down, music loud, feeling infinite.",
      emotion: "joy",
      hasPhoto: true
    },
    {
      id: 3,
      title: "Graduation Day",
      song: "Good as Hell",
      artist: "Lizzo",
      date: "2023-05-20",
      note: "Walking across that stage with this song in my head. Four years of hard work finally paid off!",
      emotion: "pride",
      hasPhoto: false
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    song: '',
    artist: '',
    note: '',
    emotion: 'joy'
  });

  const emotionColors = {
    love: 'from-pink-500 to-rose-500',
    joy: 'from-yellow-500 to-orange-500',
    pride: 'from-purple-500 to-indigo-500',
    nostalgia: 'from-blue-500 to-cyan-500',
    peace: 'from-green-500 to-emerald-500',
    excitement: 'from-red-500 to-pink-500'
  };

  const emotionIcons = {
    love: Heart,
    joy: Sun,
    pride: Trophy,
    nostalgia: Clock,
    peace: Leaf,
    excitement: Zap
  };

  const addMemory = () => {
    if (newMemory.title && newMemory.song && newMemory.artist) {
      const memory: Memory = {
        id: Date.now(),
        ...newMemory,
        date: new Date().toISOString().split('T')[0],
        hasPhoto: Math.random() > 0.5
      };
      
      setMemories(prev => [memory, ...prev]);
      setNewMemory({ title: '', song: '', artist: '', note: '', emotion: 'joy' });
      setShowAddModal(false);
    }
  };

  const deleteMemory = (id: number) => {
    setMemories(prev => prev.filter(memory => memory.id !== id));
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Memory Tracks</h1>
        <p className="text-white/70">Your personal soundtrack of memories</p>
      </div>

      {/* Add Memory Button */}
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Memory</span>
        </button>
      </div>

      {/* Memory Cards */}
      <div className="max-w-md mx-auto space-y-4">
        {memories.map((memory) => {
          const EmotionIcon = emotionIcons[memory.emotion as keyof typeof emotionIcons] || Heart;
          
          return (
            <div
              key={memory.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              {/* Memory Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${emotionColors[memory.emotion as keyof typeof emotionColors]} rounded-xl flex items-center justify-center`}>
                    <EmotionIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{memory.title}</h3>
                    <p className="text-white/60 text-sm flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(memory.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Edit3 className="w-4 h-4 text-white/60" />
                  </button>
                  <button 
                    onClick={() => deleteMemory(memory.id)}
                    className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Song Info */}
              <div className="bg-black/20 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{memory.song}</div>
                    <div className="text-white/60 text-sm">{memory.artist}</div>
                  </div>
                </div>
              </div>

              {/* Memory Note */}
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                {memory.note}
              </p>

              {/* Photo Indicator */}
              {memory.hasPhoto && (
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <Camera className="w-4 h-4" />
                  <span>Photo attached</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Add Memory</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Memory Title</label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., First Concert"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Song</label>
                  <input
                    type="text"
                    value={newMemory.song}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, song: e.target.value }))}
                    placeholder="Song title"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Artist</label>
                  <input
                    type="text"
                    value={newMemory.artist}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, artist: e.target.value }))}
                    placeholder="Artist name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Emotion</label>
                <select
                  value={newMemory.emotion}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, emotion: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="joy">Joy</option>
                  <option value="love">Love</option>
                  <option value="pride">Pride</option>
                  <option value="nostalgia">Nostalgia</option>
                  <option value="peace">Peace</option>
                  <option value="excitement">Excitement</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Memory Note</label>
                <textarea
                  value={newMemory.note}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Describe this memory..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addMemory}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                Save Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryTracks;