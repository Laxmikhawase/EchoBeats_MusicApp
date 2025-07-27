import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PlayerBar } from '@/components/PlayerBar';
import { TrackCard } from '@/components/TrackCard';
import { TrackList } from '@/components/TrackList';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { AudiusAPI } from '@/services/audiusApi';
import { Track } from '@/types/music';
import { Loader2, Play, Heart, Plus } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [hindiTracks, setHindiTracks] = useState<Track[]>([]);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [hindiLoading, setHindiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);

  const {
    playerState,
    playTrack,
    togglePlayPause,
    handleNext,
    handlePrevious,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
  } = useAudioPlayer();

  useEffect(() => {
    loadTrendingTracks();
    loadHindiTracks();
  }, []);

  const loadTrendingTracks = async () => {
    setLoading(true);
    try {
      const tracks = await AudiusAPI.getTrendingTracks(20);
      setTrendingTracks(tracks);
    } catch (error) {
      console.error('Error loading trending tracks:', error);
    }
    setLoading(false);
  };

  const loadHindiTracks = async () => {
    setHindiLoading(true);
    try {
      const tracks = await AudiusAPI.getHindiTracks(20);
      setHindiTracks(tracks);
    } catch (error) {
      console.error('Error loading Hindi tracks:', error);
    }
    setHindiLoading(false);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    setLoading(true);
    setSearchQuery(query);
    try {
      const tracks = await AudiusAPI.searchTracks(query, 50);
      setSearchResults(tracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
    setLoading(false);
  };

  const handleTrackPlay = (track: Track, tracks?: Track[], index?: number) => {
    const queue = tracks || (currentView === 'search' ? searchResults : trendingTracks);
    const trackIndex = index !== undefined ? index : queue.findIndex(t => t.id === track.id);
    playTrack(track, queue, trackIndex);
  };

  const toggleLikedSong = (track: Track) => {
    setLikedSongs(prev => {
      const isLiked = prev.some(t => t.id === track.id);
      if (isLiked) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  const isTrackLiked = (trackId: string) => {
    return likedSongs.some(track => track.id === trackId);
  };

  const renderHomeView = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Good evening</h1>
        <p className="text-muted-foreground">Discover new music and enjoy your favorites</p>
      </div>

      {/* Recently Played Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingTracks.slice(0, 6).map((track) => (
          <div
            key={track.id}
            className="bg-secondary/60 hover:bg-secondary/80 rounded-lg p-4 transition-colors group cursor-pointer"
            onClick={() => handleTrackPlay(track)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {track.artwork ? (
                  <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{track.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
              <Button
                variant="player"
                size="player-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <Button variant="outline">Show all</Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingTracks.slice(0, 10).map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={handleTrackPlay}
                isPlaying={playerState.currentTrack?.id === track.id && playerState.isPlaying}
                isLiked={isTrackLiked(track.id)}
                onToggleLike={toggleLikedSong}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hindi Music Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Hindi Music</h2>
          <Button variant="outline" onClick={loadHindiTracks}>Show all</Button>
        </div>
        
        {hindiLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {hindiTracks.slice(0, 10).map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={(track) => handleTrackPlay(track, hindiTracks)}
                isPlaying={playerState.currentTrack?.id === track.id && playerState.isPlaying}
                isLiked={isTrackLiked(track.id)}
                onToggleLike={toggleLikedSong}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSearchView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        <SearchBar onSearch={handleSearch} className="max-w-lg" />
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {searchQuery && !loading && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Results for "{searchQuery}" ({searchResults.length} tracks)
          </h2>
          
          {searchResults.length > 0 ? (
            <TrackList
              tracks={searchResults}
              onTrackPlay={handleTrackPlay}
              currentTrack={playerState.currentTrack}
              isPlaying={playerState.isPlaying}
              likedSongs={likedSongs}
              onToggleLike={toggleLikedSong}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No tracks found for "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {!searchQuery && !loading && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['Pop', 'Hip-Hop', 'Electronic', 'Rock', 'Jazz', 'Classical', 'Indie', 'Folk'].map((genre) => (
              <div
                key={genre}
                className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-6 cursor-pointer hover:from-primary/30 hover:to-primary/10 transition-colors"
                onClick={() => handleSearch(genre)}
              >
                <h3 className="text-lg font-semibold">{genre}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLikedSongsView = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-60 h-60 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Heart className="h-24 w-24 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium mb-2">PLAYLIST</p>
          <h1 className="text-5xl font-bold mb-4">Liked Songs</h1>
          <p className="text-muted-foreground">{likedSongs.length} songs</p>
        </div>
      </div>
      
      {likedSongs.length > 0 ? (
        <TrackList
          tracks={likedSongs}
          onTrackPlay={handleTrackPlay}
          currentTrack={playerState.currentTrack}
          isPlaying={playerState.isPlaying}
          likedSongs={likedSongs}
          onToggleLike={toggleLikedSong}
        />
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <div className="mb-4">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Songs you like will appear here</h3>
          <p className="mb-4">Save songs by tapping the heart icon</p>
          <Button variant="spotify" onClick={() => setCurrentView('search')}>Find something to like</Button>
        </div>
      )}
    </div>
  );

  const renderPlaylistsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <Button variant="spotify">
          <Plus className="h-4 w-4 mr-2" />
          Create Playlist
        </Button>
      </div>
      
      <div className="text-center py-16 text-muted-foreground">
        <div className="mb-4">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
            <Play className="h-8 w-8" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Create your first playlist</h3>
        <p className="mb-4">It's easy, we'll help you</p>
        <Button variant="spotify">Create playlist</Button>
      </div>
    </div>
  );

  const renderLibraryView = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Library</h1>
      <div className="text-center py-16 text-muted-foreground">
        <div className="mb-4">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
            <Play className="h-8 w-8" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Start building your library</h3>
        <p className="mb-4">Save tracks, create playlists, and discover new music</p>
        <Button variant="spotify">Find something to listen to</Button>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return renderSearchView();
      case 'library':
        return renderLibraryView();
      case 'liked':
        return renderLikedSongsView();
      case 'playlists':
        return renderPlaylistsView();
      default:
        return renderHomeView();
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      <PlayerBar
        playerState={playerState}
        onTogglePlayPause={togglePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={seekTo}
        onVolumeChange={setVolume}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        likedSongs={likedSongs}
        onToggleLike={toggleLikedSong}
      />
    </div>
  );
};

export default Index;