import { NextResponse } from 'next/server';
import { MsEdgeTTS } from 'msedge-tts';
import { ProcessedVoice, LANGUAGE_NAMES } from '@/types';

// Cache voices for 24 hours
let cachedVoices: ProcessedVoice[] | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  try {
    // Return cached voices if fresh
    if (cachedVoices && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedVoices);
    }

    // Fetch voices from msedge-tts
    const tts = new MsEdgeTTS();
    const voices = await tts.getVoices();

    // Process and transform voices
    const processedVoices: ProcessedVoice[] = voices.map((voice) => {
      const locale = voice.Locale || voice.ShortName.split('-').slice(0, 2).join('-');
      const language = locale.split('-')[0];

      // Extract a cleaner name from FriendlyName
      let name = voice.FriendlyName || voice.ShortName;
      // Remove "Microsoft" prefix and "Online (Natural)" suffix
      name = name
        .replace('Microsoft ', '')
        .replace(' Online (Natural)', '')
        .replace(/ - .+$/, ''); // Remove language suffix like "- English (United States)"

      return {
        shortName: voice.ShortName,
        name: name,
        locale: locale,
        language: language,
        languageName: LANGUAGE_NAMES[language] || language.toUpperCase(),
        gender: voice.Gender as 'Male' | 'Female',
      };
    });

    // Sort by language name, then by voice name
    processedVoices.sort((a, b) => {
      const langCompare = a.languageName.localeCompare(b.languageName);
      if (langCompare !== 0) return langCompare;
      return a.name.localeCompare(b.name);
    });

    // Update cache
    cachedVoices = processedVoices;
    cacheTime = Date.now();

    return NextResponse.json(processedVoices);
  } catch (error) {
    console.error('Failed to fetch voices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}
