import { Track, Artist } from '@/types/music';

const AUDIUS_API_BASE = 'https://discoveryprovider.audius.co';

export class AudiusAPI {
  // Hindi music search with specific keywords and artists
  static async getHindiTracks(limit: number = 20): Promise<Track[]> {
    const hindiQueries = [
      'bollywood', 'hindi songs', 'arijit singh', 'shreya ghoshal', 
      'armaan malik', 'rahat fateh ali khan', 'atif aslam', 'neha kakkar',
      'punjabi', 'hindi music', 'भारतीय संगीत'
    ];
    
    try {
      const allTracks: Track[] = [];
      
      for (const query of hindiQueries.slice(0, 3)) { // Limit API calls
        const tracks = await this.searchTracks(query, Math.ceil(limit / 3));
        allTracks.push(...tracks);
      }
      
      // Remove duplicates and return limited results
      const uniqueTracks = allTracks.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      );
      
      return uniqueTracks.slice(0, limit);
    } catch (error) {
      console.error('Error fetching Hindi tracks:', error);
      return [];
    }
  }

  static async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    try {
      const response = await fetch(
        `${AUDIUS_API_BASE}/v1/tracks/search?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      const data = await response.json();
      
      if (!data.data) return [];
      
      return data.data.map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.user.name,
        album: track.genre,
        duration: track.duration,
        artwork: track.artwork?.['480x480'] || track.artwork?.['150x150'],
        streamUrl: `${AUDIUS_API_BASE}/v1/tracks/${track.id}/stream`,
        genre: track.genre,
        playCount: track.play_count,
        favoriteCount: track.favorite_count,
        releaseDate: track.created_at,
      }));
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  static async getTrendingTracks(limit: number = 20): Promise<Track[]> {
    try {
      const response = await fetch(
        `${AUDIUS_API_BASE}/v1/tracks/trending?limit=${limit}`
      );
      const data = await response.json();
      
      if (!data.data) return [];
      
      return data.data.map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.user.name,
        album: track.genre,
        duration: track.duration,
        artwork: track.artwork?.['480x480'] || track.artwork?.['150x150'],
        streamUrl: `${AUDIUS_API_BASE}/v1/tracks/${track.id}/stream`,
        genre: track.genre,
        playCount: track.play_count,
        favoriteCount: track.favorite_count,
        releaseDate: track.created_at,
      }));
    } catch (error) {
      console.error('Error fetching trending tracks:', error);
      return [];
    }
  }

  static async getTracksByGenre(genre: string, limit: number = 20): Promise<Track[]> {
    try {
      const response = await fetch(
        `${AUDIUS_API_BASE}/v1/tracks/search?query=${encodeURIComponent(genre)}&limit=${limit}`
      );
      const data = await response.json();
      
      if (!data.data) return [];
      
      return data.data
        .filter((track: any) => track.genre?.toLowerCase().includes(genre.toLowerCase()))
        .map((track: any) => ({
          id: track.id,
          title: track.title,
          artist: track.user.name,
          album: track.genre,
          duration: track.duration,
          artwork: track.artwork?.['480x480'] || track.artwork?.['150x150'],
          streamUrl: `${AUDIUS_API_BASE}/v1/tracks/${track.id}/stream`,
          genre: track.genre,
          playCount: track.play_count,
          favoriteCount: track.favorite_count,
          releaseDate: track.created_at,
        }));
    } catch (error) {
      console.error('Error fetching tracks by genre:', error);
      return [];
    }
  }

  static async searchArtists(query: string, limit: number = 10): Promise<Artist[]> {
    try {
      const response = await fetch(
        `${AUDIUS_API_BASE}/v1/users/search?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      const data = await response.json();
      
      if (!data.data) return [];
      
      return data.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        bio: user.bio,
        avatar: user.profile_picture?.['480x480'] || user.profile_picture?.['150x150'],
        followerCount: user.follower_count,
        trackCount: user.track_count,
      }));
    } catch (error) {
      console.error('Error searching artists:', error);
      return [];
    }
  }
}