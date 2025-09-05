// Real royalty-free music tracks from various sources
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
  // Chill/Lo-fi tracks
  {
    id: 'chill_1',
    name: 'Peaceful Piano',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 180,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Peaceful%20Piano.mp3',
    genre: 'ambient',
    mood: 'chill',
    image: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'chill_2',
    name: 'Carefree',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 195,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3',
    genre: 'acoustic',
    mood: 'chill',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'chill_3',
    name: 'Wallpaper',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 210,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wallpaper.mp3',
    genre: 'ambient',
    mood: 'chill',
    image: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  
  // Upbeat/Hype tracks
  {
    id: 'hype_1',
    name: 'Funky Suspense',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 165,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Funky%20Suspense.mp3',
    genre: 'funk',
    mood: 'hype',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'hype_2',
    name: 'Groovy Hip Hop',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 142,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Groovy%20Hip%20Hop.mp3',
    genre: 'hip-hop',
    mood: 'hype',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'hype_3',
    name: 'Electrodoodle',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 178,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Electrodoodle.mp3',
    genre: 'electronic',
    mood: 'hype',
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },

  // Romantic tracks
  {
    id: 'romantic_1',
    name: 'Romantic',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 201,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Romantic.mp3',
    genre: 'classical',
    mood: 'romantic',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'romantic_2',
    name: 'Heartwarming',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 156,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heartwarming.mp3',
    genre: 'acoustic',
    mood: 'romantic',
    image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },

  // Morning/Uplifting tracks
  {
    id: 'morning_1',
    name: 'Happy Alley',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 134,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Happy%20Alley.mp3',
    genre: 'pop',
    mood: 'morning',
    image: 'https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'morning_2',
    name: 'Ukulele Beach',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 167,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ukulele%20Beach.mp3',
    genre: 'acoustic',
    mood: 'morning',
    image: 'https://images.pexels.com/photos/1430818/pexels-photo-1430818.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },

  // Night/Ambient tracks
  {
    id: 'night_1',
    name: 'Moonlight Sonata',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 189,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Moonlight%20Sonata.mp3',
    genre: 'classical',
    mood: 'night',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'night_2',
    name: 'Ambient Nights',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 223,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ambient%20Nights.mp3',
    genre: 'ambient',
    mood: 'night',
    image: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },

  // Reflective tracks
  {
    id: 'reflective_1',
    name: 'Meditation',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 198,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation.mp3',
    genre: 'ambient',
    mood: 'reflective',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'reflective_2',
    name: 'Contemplation',
    artist: 'Kevin MacLeod',
    album: 'Royalty Free Music',
    duration: 176,
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Contemplation.mp3',
    genre: 'classical',
    mood: 'reflective',
    image: 'https://images.pexels.com/photos/1051449/pexels-photo-1051449.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
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