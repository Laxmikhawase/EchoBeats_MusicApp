import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayerState } from '@/types/music';

interface PlayerControlsProps {
  playerState: PlayerState;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export function PlayerControls({
  playerState,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
}: PlayerControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Main Controls */}
      <div className="flex items-center space-x-4">
        <Button
          variant="player-ghost"
          size="player-sm"
          onClick={onToggleShuffle}
          className={playerState.shuffle ? 'text-primary' : 'text-muted-foreground'}
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        
        <Button
          variant="player-ghost"
          size="player-sm"
          onClick={onPrevious}
          disabled={!playerState.currentTrack}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant="player"
          size="player"
          onClick={onTogglePlayPause}
          disabled={!playerState.currentTrack}
        >
          {playerState.isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <Button
          variant="player-ghost"
          size="player-sm"
          onClick={onNext}
          disabled={!playerState.currentTrack}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button
          variant="player-ghost"
          size="player-sm"
          onClick={onToggleRepeat}
          className={playerState.repeat !== 'none' ? 'text-primary' : 'text-muted-foreground'}
        >
          <Repeat className="h-4 w-4" />
          {playerState.repeat === 'one' && (
            <span className="absolute text-xs font-bold">1</span>
          )}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center space-x-3 w-full max-w-md">
        <span className="text-xs text-muted-foreground min-w-[40px]">
          {formatTime(playerState.currentTime)}
        </span>
        <Slider
          value={[playerState.currentTime]}
          max={playerState.duration || 100}
          step={1}
          onValueChange={([value]) => onSeek(value)}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground min-w-[40px]">
          {formatTime(playerState.duration)}
        </span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={[playerState.volume * 100]}
          max={100}
          step={1}
          onValueChange={([value]) => onVolumeChange(value / 100)}
          className="w-24"
        />
      </div>
    </div>
  );
}