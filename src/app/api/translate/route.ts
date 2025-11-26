import { NextRequest, NextResponse } from 'next/server';

// Lingva Translate public instances (no API key needed)
const LINGVA_INSTANCES = [
  'https://lingva.ml',
  'https://translate.plausibility.cloud',
  'https://lingva.pussthecat.org',
];

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage = 'auto', targetLanguage } = await request.json();

    // Validate inputs
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text' }, { status: 400 });
    }

    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid targetLanguage' }, { status: 400 });
    }

    // Limit text length
    const trimmedText = text.trim().slice(0, 5000);

    if (trimmedText.length === 0) {
      return NextResponse.json({ error: 'Text cannot be empty' }, { status: 400 });
    }

    // Try multiple instances for reliability
    for (const instance of LINGVA_INSTANCES) {
      try {
        const url = `${instance}/api/v1/${sourceLanguage}/${targetLanguage}/${encodeURIComponent(trimmedText)}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.translation) {
            return NextResponse.json({
              translatedText: data.translation,
              detectedLanguage: data.info?.detectedSource || sourceLanguage,
              targetLanguage,
            });
          }
        }
      } catch (error) {
        console.warn(`Lingva instance ${instance} failed:`, error);
        continue;
      }
    }

    // All instances failed
    return NextResponse.json(
      { error: 'Translation service unavailable. Please try again.' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to process translation request' },
      { status: 500 }
    );
  }
}
