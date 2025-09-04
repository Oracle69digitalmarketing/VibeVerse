import React from 'react';
import { Home, Gamepad2, Music, Heart, Mic } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'playlists', label: 'Moods', icon: Music },
    { id: 'memories', label: 'Memories', icon: Heart },
    { id: 'remix', label: 'Remix', icon: Mic },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log('Navigation clicked:', tab.id);
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'text-purple-400 bg-purple-500/20 transform scale-110'
                  : 'text-white/60 hover:text-white/80 hover:bg-white/10'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;