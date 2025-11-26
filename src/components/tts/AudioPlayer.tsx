'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Download,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAudioPlayer, formatTime } from '@/hooks/useAudioPlayer';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string | null;
  isGenerating: boolean;
  onDownload: () => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function AudioPlayer({
  audioUrl,
  isGenerating,
  onDownload,
}: AudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    toggle,
    seek,
    skip,
    setPlaybackRate,
    setVolume,
    toggleMute,
  } = useAudioPlayer(audioUrl);

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Static heights for empty state waveform bars (avoids hydration mismatch)
  const emptyStateHeights = [18, 28, 22, 30, 16];

  // Loading/empty state
  if (!audioUrl && !isGenerating) {
    return (
      <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {emptyStateHeights.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-muted-foreground/30 rounded-full"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Your audio will appear here after generating
          </p>
        </div>
      </div>
    );
  }

  // Generating state
  if (isGenerating) {
    return (
      <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-waveform"
                style={{
                  height: '24px',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating speech...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card/50 p-4 space-y-4">
      {/* Waveform visualization placeholder */}
      <div className="h-16 bg-muted/30 rounded-md flex items-center justify-center overflow-hidden relative">
        <WaveformVisualization isPlaying={isPlaying} progress={duration > 0 ? currentTime / duration : 0} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full shrink-0"
                onClick={toggle}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isPlaying ? 'Pause' : 'Play'} (Space)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Progress */}
        <div className="flex-1 space-y-1">
          <Slider
            value={[currentTime]}
            onValueChange={([value]) => seek(value)}
            max={duration || 100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Skip controls */}
        <div className="hidden sm:flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => skip(-10)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Back 10s</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => skip(10)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Forward 10s</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Playback rate */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-mono">
              {playbackRate}x
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {PLAYBACK_RATES.map((rate) => (
              <DropdownMenuItem
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={cn(playbackRate === rate && 'bg-accent')}
              >
                {rate}x {rate === 1 && '(Normal)'}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Volume */}
        <div
          className="relative hidden sm:block"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          {showVolumeSlider && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-popover border rounded-md shadow-lg">
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={([value]) => setVolume(value / 100)}
                max={100}
                step={1}
                orientation="vertical"
                className="h-24"
              />
            </div>
          )}
        </div>

        {/* Download */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={onDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download MP3 (⌘S)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

// Simple waveform visualization component
function WaveformVisualization({
  isPlaying,
  progress,
}: {
  isPlaying: boolean;
  progress: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bars] = useState(() =>
    Array.from({ length: 50 }, () => 0.3 + Math.random() * 0.7)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const barWidth = width / bars.length;
    const progressX = progress * width;

    ctx.clearRect(0, 0, width, height);

    bars.forEach((barHeight, i) => {
      const x = i * barWidth;
      const h = barHeight * height * 0.8;
      const y = (height - h) / 2;

      // Color based on progress
      if (x < progressX) {
        ctx.fillStyle = 'oklch(0.7 0.2 264)'; // Primary color
      } else {
        ctx.fillStyle = 'oklch(0.5 0 0 / 0.3)'; // Muted color
      }

      ctx.beginPath();
      ctx.roundRect(x + 1, y, barWidth - 2, h, 2);
      ctx.fill();
    });
  }, [bars, progress, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}
