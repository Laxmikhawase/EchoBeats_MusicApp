import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlayerState } from '@/types/music';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    currentTime: 0,
    duration: 0,
    queue: [],
    currentIndex: -1,
    shuffle: false,
    repeat: 'none',
  });

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = playerState.volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const playTrack = useCallback((track: Track, queue: Track[] = [], startIndex: number = 0) => {
    if (!audioRef.current) return;

    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      queue: queue.length > 0 ? queue : [track],
      currentIndex: startIndex,
    }));

    audioRef.current.src = track.streamUrl;
    audioRef.current.load();
    audioRef.current.play().then(() => {
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    }).catch(console.error);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !playerState.currentTrack) return;

    if (playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    } else {
      audioRef.current.play().then(() => {
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
      }).catch(console.error);
    }
  }, [playerState.isPlaying, playerState.currentTrack]);

  const handleNext = useCallback(() => {
    const { queue, currentIndex, shuffle, repeat } = playerState;
    
    if (queue.length === 0) return;

    let nextIndex = currentIndex;

    if (repeat === 'one') {
      // Stay on the same track
      nextIndex = currentIndex;
    } else if (shuffle) {
      // Random next track (excluding current)
      const availableIndices = queue.map((_, i) => i).filter(i => i !== currentIndex);
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeat === 'all') {
      nextIndex = 0;
    } else {
      // End of queue, stop playing
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    playTrack(queue[nextIndex], queue, nextIndex);
  }, [playerState, playTrack]);

  const handlePrevious = useCallback(() => {
    const { queue, currentIndex } = playerState;
    
    if (queue.length === 0) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    playTrack(queue[prevIndex], queue, prevIndex);
  }, [playerState, playTrack]);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      repeat: prev.repeat === 'none' ? 'all' : prev.repeat === 'all' ? 'one' : 'none',
    }));
  }, []);

  return {
    playerState,
    playTrack,
    togglePlayPause,
    handleNext,
    handlePrevious,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
  };
};