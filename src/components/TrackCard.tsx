import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Track } from '@/types/music';

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  isPlaying?: boolean;
  showPlayButton?: boolean;
  isLiked?: boolean;
  onToggleLike?: (track: Track) => void;
}

export function TrackCard({ track, onPlay, isPlaying, showPlayButton = true, isLiked = false, onToggleLike }: TrackCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="group relative bg-gradient-card hover:bg-secondary/60 transition-all duration-300 hover:shadow-card border-border/40 overflow-hidden">
      <div className="p-4">
        {/* Artwork */}
        <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
          {track.artwork ? (
            <img
              src={track.artwork}
              alt={track.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Play className="h-8 w-8 text-primary/60" />
            </div>
          )}
          
          {showPlayButton && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="player"
                size="player"
                onClick={() => onPlay(track)}
                className="shadow-xl"
              >
                <Play className="h-5 w-5 ml-0.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground truncate" title={track.title}>
            {track.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate" title={track.artist}>
            {track.artist}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{formatDuration(track.duration)}</span>
              {track.playCount && (
                <>
                  <span>•</span>
                  <span>{track.playCount.toLocaleString()} plays</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike?.(track);
                }}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-primary text-primary' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}