// Working audio tracks with real URLs that should play
export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  genre: string;
  mood: string;
  image: string;
}

export const musicTracks: MusicTrack[] = [
  // Using actual working audio URLs from various free sources
  {
    id: 'chill_1',
    name: 'Peaceful Moments',
    artist: 'Ambient Artist',
    album: 'Chill Collection',
    duration: 30,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    genre: 'ambient',
    mood: 'chill',
    image: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'chill_2',
    name: 'Morning Coffee',
    artist: 'Lo-Fi Beats',
    album: 'Daily Vibes',
    duration: 25,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
    genre: 'lofi',
    mood: 'chill',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'hype_1',
    name: 'Energy Boost',
    artist: 'Electronic Vibes',
    album: 'High Energy',
    duration: 20,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
    genre: 'electronic',
    mood: 'hype',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'hype_2',
    name: 'Pump It Up',
    artist: 'Beat Master',
    album: 'Workout Mix',
    duration: 18,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-02.wav',
    genre: 'hip-hop',
    mood: 'hype',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'romantic_1',
    name: 'Love Song',
    artist: 'Romantic Melodies',
    album: 'Heart Strings',
    duration: 35,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
    genre: 'acoustic',
    mood: 'romantic',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'morning_1',
    name: 'Sunrise',
    artist: 'Morning Glory',
    album: 'New Day',
    duration: 22,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-06.wav',
    genre: 'pop',
    mood: 'morning',
    image: 'https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'night_1',
    name: 'Midnight Dreams',
    artist: 'Night Owl',
    album: 'After Hours',
    duration: 40,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-07.wav',
    genre: 'ambient',
    mood: 'night',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'reflective_1',
    name: 'Deep Thoughts',
    artist: 'Contemplation',
    album: 'Inner Peace',
    duration: 45,
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-08.wav',
    genre: 'ambient',
    mood: 'reflective',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  }
];

// Helper function to get tracks by mood
export const getTracksByMood = (mood: string): MusicTrack[] => {
  return musicTracks.filter(track => track.mood === mood);
};

// Helper function to get random tracks
export const getRandomTracks = (count: number = 5): MusicTrack[] => {
  const shuffled = [...musicTracks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get track by ID
export const getTrackById = (id: string): MusicTrack | undefined => {
  return musicTracks.find(track => track.id === id);
};