export interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  targetLanguage: string;
}

const MAX_CHUNK_SIZE = 450; // MyMemory has 500 char limit, leave some buffer

/**
 * Split text into chunks for translation
 */
function splitTextIntoChunks(text: string): string[] {
  const chunks: string[] = [];

  // Try to split by sentences first
  const sentences = text.split(/(?<=[.!?।。！？])\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if (sentence.length > MAX_CHUNK_SIZE) {
      // If single sentence is too long, push current chunk and split sentence by spaces
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      const words = sentence.split(/\s+/);
      for (const word of words) {
        if ((currentChunk + ' ' + word).length > MAX_CHUNK_SIZE) {
          if (currentChunk) {
            chunks.push(currentChunk.trim());
          }
          currentChunk = word;
        } else {
          currentChunk = currentChunk ? currentChunk + ' ' + word : word;
        }
      }
    } else if ((currentChunk + ' ' + sentence).length > MAX_CHUNK_SIZE) {
      // Current chunk would exceed limit, push it and start new one
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      // Add sentence to current chunk
      currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
    }
  }

  // Push remaining chunk
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.length > 0);
}

/**
 * Translate a single chunk of text
 */
async function translateChunk(
  text: string,
  targetLanguage: string
): Promise<TranslationResult> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      targetLanguage,
      sourceLanguage: 'auto',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Translation failed' }));
    throw new Error(error.error || 'Translation failed');
  }

  return response.json();
}

/**
 * Translate text to a target language using the /api/translate endpoint
 * Handles long texts by splitting into chunks
 */
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<TranslationResult> {
  // For short texts, translate directly
  if (text.length <= MAX_CHUNK_SIZE) {
    return translateChunk(text, targetLanguage);
  }

  // For longer texts, split and translate in chunks
  const chunks = splitTextIntoChunks(text);
  const translatedChunks: string[] = [];
  let detectedLanguage = 'auto';

  // Translate chunks sequentially to avoid rate limiting
  for (const chunk of chunks) {
    const result = await translateChunk(chunk, targetLanguage);
    translatedChunks.push(result.translatedText);
    if (result.detectedLanguage && result.detectedLanguage !== 'autodetect') {
      detectedLanguage = result.detectedLanguage;
    }
  }

  return {
    translatedText: translatedChunks.join(' '),
    detectedLanguage,
    targetLanguage,
  };
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
