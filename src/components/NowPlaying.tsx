import { Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Track } from '@/types/music';

interface NowPlayingProps {
  track: Track | null;
  likedSongs?: Track[];
  onToggleLike?: (track: Track) => void;
}

export function NowPlaying({ track, likedSongs = [], onToggleLike }: NowPlayingProps) {
  if (!track) {
    return (
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        <div className="w-14 h-14 bg-muted rounded-lg" />
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">No track playing</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 min-w-0 flex-1">
      {/* Album Art */}
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {track.artwork ? (
          <img
            src={track.artwork}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
      </div>

      {/* Track Info */}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-foreground truncate" title={track.title}>
          {track.title}
        </div>
        <div className="text-xs text-muted-foreground truncate" title={track.artist}>
          {track.artist}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => track && onToggleLike?.(track)}
        >
          <Heart className={`h-4 w-4 ${likedSongs.some(t => t.id === track.id) ? 'fill-primary text-primary' : ''}`} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}