export interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  targetLanguage: string;
}

/**
 * Translate text to a target language using the /api/translate endpoint
 */
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<TranslationResult> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      targetLanguage,
      sourceLanguage: 'auto', // Auto-detect source language
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Translation failed' }));
    throw new Error(error.error || 'Translation failed');
  }

  return response.json();
}

/**
 * Extract language code from voice shortName
 * e.g., 'en-US-AriaNeural' → 'en'
 * e.g., 'zh-CN-XiaoxiaoNeural' → 'zh'
 */
export function getVoiceLanguage(voiceShortName: string): string {
  if (!voiceShortName) return 'en';
  return voiceShortName.split('-')[0];
}

/**
 * Check if the voice language matches the detected text language
 */
export function languagesMatch(
  detectedLanguage: string,
  voiceLanguage: string
): boolean {
  // Normalize both to lowercase
  const detected = detectedLanguage.toLowerCase();
  const voice = voiceLanguage.toLowerCase();

  // Direct match
  if (detected === voice) return true;

  // Handle Chinese variants (zh-CN, zh-TW, etc.)
  if (detected.startsWith('zh') && voice.startsWith('zh')) return true;

  return false;
}
