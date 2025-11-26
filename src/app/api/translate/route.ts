import { NextRequest, NextResponse } from 'next/server';

// Language code mapping for MyMemory API
// MyMemory uses standard ISO 639-1 codes
const LANGUAGE_CODE_MAP: Record<string, string> = {
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'pt': 'pt-PT',
  'pt-BR': 'pt-BR',
  'pt-PT': 'pt-PT',
};

function normalizeLanguageCode(code: string): string {
  return LANGUAGE_CODE_MAP[code] || code;
}

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

    // Limit text length (MyMemory has a 500 char limit per request for anonymous users)
    const trimmedText = text.trim().slice(0, 500);

    if (trimmedText.length === 0) {
      return NextResponse.json({ error: 'Text cannot be empty' }, { status: 400 });
    }

    const sourceLang = sourceLanguage === 'auto' ? 'autodetect' : normalizeLanguageCode(sourceLanguage);
    const targetLang = normalizeLanguageCode(targetLanguage);

    // Use MyMemory Translation API (free, no API key required)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmedText)}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'VocalFlow/1.0 (Text-to-Speech Application)',
      },
    });

    if (!response.ok) {
      console.error('MyMemory API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Translation service unavailable. Please try again.' },
        { status: 503 }
      );
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      // Check if translation quality is acceptable
      const match = data.responseData.match;

      return NextResponse.json({
        translatedText: data.responseData.translatedText,
        detectedLanguage: data.responseData.detectedLanguage || sourceLang,
        targetLanguage: targetLang,
        confidence: match,
      });
    }

    // Handle specific error cases
    if (data.responseStatus === 403) {
      return NextResponse.json(
        { error: 'Translation quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    console.error('MyMemory translation failed:', data);
    return NextResponse.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to process translation request' },
      { status: 500 }
    );
  }
}
