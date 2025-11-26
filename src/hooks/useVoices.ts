'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProcessedVoice, VoiceGroup } from '@/types';

const FAVORITES_KEY = 'vocalflow-favorites';

export function useVoices() {
  const [voices, setVoices] = useState<ProcessedVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch {
          setFavorites([]);
        }
      }
    }
  }, []);

  // Fetch voices
  useEffect(() => {
    async function fetchVoices() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/voices');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        setVoices(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load voices');
      } finally {
        setIsLoading(false);
      }
    }
    fetchVoices();
  }, []);

  // Mark voices as favorites
  const voicesWithFavorites = useMemo(() => {
    return voices.map((voice) => ({
      ...voice,
      isFavorite: favorites.includes(voice.shortName),
    }));
  }, [voices, favorites]);

  // Group voices by language
  const voiceGroups = useMemo(() => {
    const groups: Record<string, VoiceGroup> = {};

    voicesWithFavorites.forEach((voice) => {
      if (!groups[voice.language]) {
        groups[voice.language] = {
          language: voice.language,
          languageName: voice.languageName,
          voices: [],
        };
      }
      groups[voice.language].voices.push(voice);
    });

    // Sort groups by language name
    return Object.values(groups).sort((a, b) =>
      a.languageName.localeCompare(b.languageName)
    );
  }, [voicesWithFavorites]);

  // Get favorite voices
  const favoriteVoices = useMemo(() => {
    return voicesWithFavorites.filter((v) => v.isFavorite);
  }, [voicesWithFavorites]);

  // Toggle favorite
  const toggleFavorite = useCallback((shortName: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(shortName)
        ? prev.filter((f) => f !== shortName)
        : [...prev, shortName];

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      }

      return newFavorites;
    });
  }, []);

  // Search voices
  const searchVoices = useCallback(
    (query: string): ProcessedVoice[] => {
      if (!query.trim()) return voicesWithFavorites;

      const lowerQuery = query.toLowerCase();
      return voicesWithFavorites.filter(
        (voice) =>
          voice.name.toLowerCase().includes(lowerQuery) ||
          voice.languageName.toLowerCase().includes(lowerQuery) ||
          voice.locale.toLowerCase().includes(lowerQuery) ||
          voice.shortName.toLowerCase().includes(lowerQuery)
      );
    },
    [voicesWithFavorites]
  );

  // Get voice by shortName
  const getVoice = useCallback(
    (shortName: string): ProcessedVoice | undefined => {
      return voicesWithFavorites.find((v) => v.shortName === shortName);
    },
    [voicesWithFavorites]
  );

  return {
    voices: voicesWithFavorites,
    voiceGroups,
    favoriteVoices,
    isLoading,
    error,
    toggleFavorite,
    searchVoices,
    getVoice,
  };
}
