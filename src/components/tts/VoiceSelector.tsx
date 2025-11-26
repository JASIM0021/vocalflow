'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Star, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ProcessedVoice, VoiceGroup } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface VoiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  voices: ProcessedVoice[];
  voiceGroups: VoiceGroup[];
  favoriteVoices: ProcessedVoice[];
  isLoading: boolean;
  onToggleFavorite: (shortName: string) => void;
  disabled?: boolean;
}

export function VoiceSelector({
  value,
  onChange,
  voices,
  voiceGroups,
  favoriteVoices,
  isLoading,
  onToggleFavorite,
  disabled,
}: VoiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedVoice = useMemo(
    () => voices.find((v) => v.shortName === value),
    [voices, value]
  );

  // Filter voices based on search
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return voiceGroups;

    const lowerSearch = search.toLowerCase();
    return voiceGroups
      .map((group) => ({
        ...group,
        voices: group.voices.filter(
          (v) =>
            v.name.toLowerCase().includes(lowerSearch) ||
            v.languageName.toLowerCase().includes(lowerSearch) ||
            v.locale.toLowerCase().includes(lowerSearch)
        ),
      }))
      .filter((group) => group.voices.length > 0);
  }, [voiceGroups, search]);

  const filteredFavorites = useMemo(() => {
    if (!search.trim()) return favoriteVoices;

    const lowerSearch = search.toLowerCase();
    return favoriteVoices.filter(
      (v) =>
        v.name.toLowerCase().includes(lowerSearch) ||
        v.languageName.toLowerCase().includes(lowerSearch)
    );
  }, [favoriteVoices, search]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Voice</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select voice"
            disabled={disabled}
            className={cn(
              'w-full justify-between h-10 bg-background/50 border-border/50',
              !selectedVoice && 'text-muted-foreground'
            )}
          >
            {selectedVoice ? (
              <div className="flex items-center gap-2 truncate">
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
                    selectedVoice.gender === 'Female'
                      ? 'bg-pink-500/10 text-pink-500'
                      : 'bg-blue-500/10 text-blue-500'
                  )}
                >
                  <User className="h-3 w-3" />
                </div>
                <span className="truncate">{selectedVoice.name}</span>
                <Badge variant="secondary" className="ml-1 text-[10px] hidden sm:flex">
                  {selectedVoice.languageName}
                </Badge>
              </div>
            ) : (
              'Select a voice...'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search voices..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                <div className="flex flex-col items-center py-6">
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No voices found</p>
                </div>
              </CommandEmpty>

              {/* Favorites */}
              {filteredFavorites.length > 0 && (
                <>
                  <CommandGroup heading="Favorites">
                    {filteredFavorites.map((voice) => (
                      <VoiceItem
                        key={voice.shortName}
                        voice={voice}
                        isSelected={value === voice.shortName}
                        onSelect={() => {
                          onChange(voice.shortName);
                          setOpen(false);
                        }}
                        onToggleFavorite={() => onToggleFavorite(voice.shortName)}
                      />
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* All voices by language */}
              {filteredGroups.map((group) => (
                <CommandGroup key={group.language} heading={group.languageName}>
                  {group.voices.map((voice) => (
                    <VoiceItem
                      key={voice.shortName}
                      voice={voice}
                      isSelected={value === voice.shortName}
                      onSelect={() => {
                        onChange(voice.shortName);
                        setOpen(false);
                      }}
                      onToggleFavorite={() => onToggleFavorite(voice.shortName)}
                    />
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface VoiceItemProps {
  voice: ProcessedVoice;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

function VoiceItem({
  voice,
  isSelected,
  onSelect,
  onToggleFavorite,
}: VoiceItemProps) {
  return (
    <CommandItem
      value={voice.shortName}
      onSelect={onSelect}
      className="flex items-center gap-2 py-2"
    >
      <div
        className={cn(
          'flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium shrink-0',
          voice.gender === 'Female'
            ? 'bg-pink-500/10 text-pink-500'
            : 'bg-blue-500/10 text-blue-500'
        )}
      >
        <User className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-medium truncate">{voice.name}</span>
          <span className="text-xs text-muted-foreground">
            ({voice.gender === 'Female' ? '♀' : '♂'})
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{voice.locale}</span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="p-1 hover:bg-muted rounded transition-colors"
        aria-label={voice.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          className={cn(
            'h-4 w-4 transition-colors',
            voice.isFavorite
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground hover:text-yellow-400'
          )}
        />
      </button>
      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
    </CommandItem>
  );
}
