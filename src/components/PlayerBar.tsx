import { PlayerControls } from './PlayerControls';
import { NowPlaying } from './NowPlaying';
import { PlayerState, Track } from '@/types/music';
import { useState } from 'react';

interface PlayerBarProps {
  playerState: PlayerState;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  likedSongs: Track[];
  onToggleLike?: (track: Track) => void;
}

export function PlayerBar({
  playerState,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  likedSongs,
  onToggleLike,
}: PlayerBarProps) {
  return (
    <div className="bg-player-background border-t border-border/40 p-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Now Playing */}
        <div className="flex-1 min-w-0 max-w-sm">
          <NowPlaying 
            track={playerState.currentTrack} 
            likedSongs={likedSongs}
            onToggleLike={onToggleLike}
          />
        </div>

        {/* Player Controls */}
        <div className="flex-1 max-w-2xl">
          <PlayerControls
            playerState={playerState}
            onTogglePlayPause={onTogglePlayPause}
            onNext={onNext}
            onPrevious={onPrevious}
            onSeek={onSeek}
            onVolumeChange={onVolumeChange}
            onToggleShuffle={onToggleShuffle}
            onToggleRepeat={onToggleRepeat}
          />
        </div>

        {/* Right Side (Future: Queue, Devices, etc.) */}
        <div className="flex-1 min-w-0 max-w-sm" />
      </div>
    </div>
  );
}