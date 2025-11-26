'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  TTSSettings,
  DEFAULT_SETTINGS,
  DEFAULT_VOICE,
  HistoryItem,
  MAX_HISTORY_ITEMS,
} from '@/types';
import { translateText, getVoiceLanguage } from '@/lib/translate';

const HISTORY_KEY = 'vocalflow-history';

export function useTTS() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(DEFAULT_VOICE);
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_SETTINGS);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch {
          setHistory([]);
        }
      }
    }
  }, []);

  // Cleanup audio URL on unmount or when new audio is generated
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const updateSettings = useCallback((newSettings: Partial<TTSSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const generate = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Cleanup previous audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);

    try {
      let textToSpeak = text.trim();

      // Auto-translate if enabled
      if (settings.autoTranslate) {
        const targetLanguage = getVoiceLanguage(voice);
        try {
          const result = await translateText(textToSpeak, targetLanguage);
          textToSpeak = result.translatedText;
        } catch (err) {
          console.warn('Translation failed, using original text:', err);
          // Continue with original text if translation fails
        }
      }

      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voice,
          rate: settings.rate,
          pitch: settings.pitch,
          volume: settings.volume,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate speech');
      }

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      setAudioBlob(blob);
      setAudioUrl(url);

      // Add to history (store original text, not translated)
      addToHistory(text.trim(), voice, settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [text, voice, settings, audioUrl]);

  const addToHistory = useCallback(
    (text: string, voice: string, settings: TTSSettings) => {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        text,
        voice,
        settings,
        createdAt: new Date().toISOString(),
        previewText: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        }

        return updated;
      });
    },
    []
  );

  const loadFromHistory = useCallback((item: HistoryItem) => {
    setText(item.text);
    setVoice(item.voice);
    setSettings(item.settings);
    // Clear current audio when loading from history
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setError(null);
  }, [audioUrl]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      if (typeof window !== 'undefined') {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      }

      return updated;
    });
  }, []);

  const download = useCallback(() => {
      if (!audioBlob) return;

      // Create a new blob URL specifically for download
      const downloadUrl = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `speech-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    },
    [audioBlob]
  );

  const clear = useCallback(() => {
    setText('');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setError(null);
  }, [audioUrl]);

  return {
    // State
    text,
    voice,
    settings,
    audioBlob,
    audioUrl,
    isLoading,
    error,
    history,

    // Actions
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
  };
}
