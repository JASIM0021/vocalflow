'use client';

import { useEffect, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Sparkles, Loader2, AlertCircle, History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useTTS } from '@/hooks/useTTS';
import { useVoices } from '@/hooks/useVoices';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { TextInput } from './TextInput';
import { VoiceSelector } from './VoiceSelector';
import { VoiceSettings } from './VoiceSettings';
import { AudioPlayer } from './AudioPlayer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function TTSInterface() {
  const {
    text,
    voice,
    settings,
    audioUrl,
    isLoading,
    error,
    history,
    setText,
    setVoice,
    updateSettings,
    resetSettings,
    generate,
    download,
    clear,
    loadFromHistory,
    clearHistory,
    removeFromHistory,
  } = useTTS();

  const {
    voices,
    voiceGroups,
    favoriteVoices,
    isLoading: voicesLoading,
    toggleFavorite,
  } = useVoices();

  const { toggle: togglePlayback, isPlaying } = useAudioPlayer(audioUrl);

  // Keyboard shortcuts
  useHotkeys(
    'mod+enter',
    (e) => {
      e.preventDefault();
      if (!isLoading && text.trim()) {
        generate();
      }
    },
    { enableOnFormTags: ['TEXTAREA', 'INPUT'] },
    [isLoading, text, generate]
  );

  useHotkeys(
    'space',
    (e) => {
      // Only trigger if not focused on input elements
      if (
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'INPUT' &&
        audioUrl
      ) {
        e.preventDefault();
        togglePlayback();
      }
    },
    { enabled: !!audioUrl },
    [audioUrl, togglePlayback]
  );

  useHotkeys(
    'mod+s',
    (e) => {
      e.preventDefault();
      if (audioUrl) {
        download();
        toast.success('Audio downloaded!');
      }
    },
    { enabled: !!audioUrl, preventDefault: true },
    [audioUrl, download]
  );

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle generate with success toast
  const handleGenerate = useCallback(async () => {
    await generate();
  }, [generate]);

  // Success toast when audio is ready
  useEffect(() => {
    if (audioUrl && !isLoading) {
      toast.success('Speech generated successfully!');
    }
  }, [audioUrl, isLoading]);

  return (
    <Card className="w-full max-w-4xl mx-auto border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Text to Speech
        </CardTitle>

        {/* History button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              disabled={history.length === 0}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({history.length})
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Recent Conversions</h4>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={clearHistory}
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No history yet
                </p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.previewText}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Text Input */}
        <TextInput value={text} onChange={setText} disabled={isLoading} />

        {/* Voice Selector & Settings Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VoiceSelector
            value={voice}
            onChange={setVoice}
            voices={voices}
            voiceGroups={voiceGroups}
            favoriteVoices={favoriteVoices}
            isLoading={voicesLoading}
            onToggleFavorite={toggleFavorite}
            disabled={isLoading}
          />

          <div className="lg:pt-6">
            <VoiceSettings
              settings={settings}
              onChange={updateSettings}
              onReset={resetSettings}
              disabled={isLoading}
            />
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Audio Player */}
        <AudioPlayer
          audioUrl={audioUrl}
          isGenerating={isLoading}
          onDownload={download}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className={cn(
              'flex-1 gap-2 text-base font-medium',
              'bg-gradient-to-r from-primary to-primary/80',
              'hover:from-primary/90 hover:to-primary/70',
              'shadow-lg shadow-primary/25',
              'transition-all duration-300',
              'hover:shadow-primary/40 hover:scale-[1.02]',
              'active:scale-[0.98]'
            )}
            disabled={isLoading || !text.trim()}
            onClick={handleGenerate}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Speech
              </>
            )}
          </Button>

          {(text || audioUrl) && (
            <Button
              variant="outline"
              size="lg"
              onClick={clear}
              disabled={isLoading}
              className="sm:w-auto"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
