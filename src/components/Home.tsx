import React from 'react';
import { Play, TrendingUp, Clock, Users } from 'lucide-react';

const Home: React.FC = () => {
  const stats = [
    { label: 'Songs Played', value: '1,247', icon: Play, color: 'from-purple-500 to-pink-500' },
    { label: 'Beat Accuracy', value: '94%', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
    { label: 'Hours Listened', value: '156', icon: Clock, color: 'from-green-500 to-emerald-500' },
    { label: 'Friends', value: '23', icon: Users, color: 'from-orange-500 to-red-500' },
  ];

  const recentActivity = [
    { type: 'game', title: 'Perfect Score!', subtitle: 'Blinding Lights - The Weeknd', time: '2 min ago' },
    { type: 'playlist', title: 'Chill Vibes Created', subtitle: '12 tracks added', time: '1 hour ago' },
    { type: 'memory', title: 'Memory Added', subtitle: 'Summer Road Trip', time: '3 hours ago' },
    { type: 'remix', title: 'Beat Created', subtitle: 'Lo-fi Afternoon', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
          Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VibeVerse</span>
        </h1>
        <p className="text-white/70 text-lg max-w-md mx-auto">
          Transform your music into an interactive emotional journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto space-y-3">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 flex items-center justify-between hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Start Rhythm Game</div>
              <div className="text-white/80 text-sm">Play with your favorite tracks</div>
            </div>
          </div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </button>

        <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-4 flex items-center justify-between hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Generate Mood Playlist</div>
              <div className="text-white/80 text-sm">AI-curated for your vibe</div>
            </div>
          </div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{activity.title}</div>
                  <div className="text-white/60 text-sm">{activity.subtitle}</div>
                </div>
                <div className="text-white/40 text-xs">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;