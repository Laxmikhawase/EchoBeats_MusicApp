import { Play, Pause, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Track } from '@/types/music';

interface TrackListProps {
  tracks: Track[];
  onTrackPlay: (track: Track, tracks: Track[], index: number) => void;
  currentTrack?: Track | null;
  isPlaying?: boolean;
  likedSongs?: Track[];
  onToggleLike?: (track: Track) => void;
}

export function TrackList({ tracks, onTrackPlay, currentTrack, isPlaying, likedSongs = [], onToggleLike }: TrackListProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border/40">
        <div>#</div>
        <div>TITLE</div>
        <div>ARTIST</div>
        <div>ALBUM</div>
        <div><Clock className="h-4 w-4" /></div>
      </div>

      {/* Track List */}
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isTrackPlaying = isCurrentTrack && isPlaying;
        const isLiked = likedSongs.some(t => t.id === track.id);

        return (
          <div
            key={track.id}
            className="group grid grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 py-2 rounded-md hover:bg-secondary/50 transition-colors"
          >
            {/* Track Number / Play Button */}
            <div className="flex items-center">
              {isTrackPlaying ? (
                <div className="text-primary text-sm font-medium">
                  <div className="w-3 h-3 bg-primary rounded-sm animate-pulse" />
                </div>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground group-hover:hidden">
                    {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hidden group-hover:flex"
                    onClick={() => onTrackPlay(track, tracks, index)}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>

            {/* Title & Artist Column */}
            <div className="flex items-center space-x-3 min-w-0">
              {track.artwork && (
                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <div 
                  className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`}
                  title={track.title}
                >
                  {track.title}
                </div>
                <div className="text-xs text-muted-foreground truncate" title={track.artist}>
                  {track.artist}
                </div>
              </div>
            </div>

            {/* Artist */}
            <div className="flex items-center text-sm text-muted-foreground truncate" title={track.artist}>
              {track.artist}
            </div>

            {/* Album */}
            <div className="flex items-center text-sm text-muted-foreground truncate" title={track.album || track.genre || ''}>
              {track.album || track.genre || '-'}
            </div>

            {/* Duration & Actions */}
            <div className="flex items-center justify-between">
              <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onToggleLike?.(track)}
                >
                  <Heart className={`h-3 w-3 ${isLiked ? 'fill-primary text-primary' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground group-hover:hidden">
                {formatDuration(track.duration)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}