'use client';

import { ChevronDown, RotateCcw, Volume2, Gauge, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { TTSSettings, DEFAULT_SETTINGS } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface VoiceSettingsProps {
  settings: TTSSettings;
  onChange: (settings: Partial<TTSSettings>) => void;
  onReset: () => void;
  disabled?: boolean;
}

export function VoiceSettings({
  settings,
  onChange,
  onReset,
  disabled,
}: VoiceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasChanges =
    settings.rate !== DEFAULT_SETTINGS.rate ||
    settings.pitch !== DEFAULT_SETTINGS.pitch ||
    settings.volume !== DEFAULT_SETTINGS.volume;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 px-0 hover:bg-transparent"
            disabled={disabled}
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
            <span className="text-sm font-medium">Voice Settings</span>
            {hasChanges && (
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
          </Button>
        </CollapsibleTrigger>
        {hasChanges && isOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <CollapsibleContent className="pt-4 space-y-6">
        {/* Speed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Speed</Label>
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {settings.rate.toFixed(1)}x
            </span>
          </div>
          <Slider
            value={[settings.rate]}
            onValueChange={([value]) => onChange({ rate: value })}
            min={0.5}
            max={2}
            step={0.1}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Slow (0.5x)</span>
            <span>Normal (1x)</span>
            <span>Fast (2x)</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Pitch</Label>
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {settings.pitch >= 0 ? `+${settings.pitch}` : settings.pitch}
            </span>
          </div>
          <Slider
            value={[settings.pitch]}
            onValueChange={([value]) => onChange({ pitch: value })}
            min={-10}
            max={10}
            step={1}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Lower</span>
            <span>Normal</span>
            <span>Higher</span>
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Volume</Label>
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {settings.volume}%
            </span>
          </div>
          <Slider
            value={[settings.volume]}
            onValueChange={([value]) => onChange({ volume: value })}
            min={0}
            max={100}
            step={5}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Quiet</span>
            <span>Normal (100%)</span>
          </div>
        </div>

        {/* Presets */}
        <div className="pt-2">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Quick Presets
          </Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => onChange(preset.settings)}
                disabled={disabled}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const PRESETS = [
  {
    name: 'Normal',
    settings: { rate: 1.0, pitch: 0, volume: 100 },
  },
  {
    name: 'Slow & Clear',
    settings: { rate: 0.8, pitch: 0, volume: 100 },
  },
  {
    name: 'Fast',
    settings: { rate: 1.5, pitch: 0, volume: 100 },
  },
  {
    name: 'Deep Voice',
    settings: { rate: 0.9, pitch: -5, volume: 100 },
  },
  {
    name: 'High Voice',
    settings: { rate: 1.0, pitch: 5, volume: 100 },
  },
];
