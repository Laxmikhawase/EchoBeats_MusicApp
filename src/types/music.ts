export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  artwork?: string;
  streamUrl: string;
  genre?: string;
  playCount?: number;
  favoriteCount?: number;
  releaseDate?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  artwork?: string;
  createdAt: string;
  isPublic: boolean;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  followerCount?: number;
  trackCount?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  tracks: Track[];
  releaseDate?: string;
  genre?: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}