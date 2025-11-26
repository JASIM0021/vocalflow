// Voice types from Edge TTS
export interface Voice {
  Name: string;
  ShortName: string;
  Gender: 'Male' | 'Female';
  Locale: string;
  SuggestedCodec: string;
  FriendlyName: string;
  Status: string;
}

// Processed voice for frontend
export interface ProcessedVoice {
  shortName: string;
  name: string;
  locale: string;
  language: string;
  languageName: string;
  gender: 'Male' | 'Female';
  isFavorite?: boolean;
}

// Voice grouped by language
export interface VoiceGroup {
  language: string;
  languageName: string;
  voices: ProcessedVoice[];
}

// TTS Settings
export interface TTSSettings {
  rate: number;      // 0.5 to 2.0 (1.0 = normal, displayed as percentage)
  pitch: number;     // -10 to 10 (0 = normal)
  volume: number;    // 0 to 100 (100 = normal)
}

// TTS State
export interface TTSState {
  text: string;
  voice: string;
  settings: TTSSettings;
  audioBlob: Blob | null;
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

// API Request body for synthesis
export interface SynthesizeRequest {
  text: string;
  voice: string;
  rate?: string;
  pitch?: string;
  volume?: string;
}

// History item stored in localStorage
export interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  settings: TTSSettings;
  createdAt: string;
  previewText: string;
}

// Audio player state
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
}

// Language name mapping
export const LANGUAGE_NAMES: Record<string, string> = {
  'af': 'Afrikaans',
  'am': 'Amharic',
  'ar': 'Arabic',
  'az': 'Azerbaijani',
  'bg': 'Bulgarian',
  'bn': 'Bengali',
  'bs': 'Bosnian',
  'ca': 'Catalan',
  'cs': 'Czech',
  'cy': 'Welsh',
  'da': 'Danish',
  'de': 'German',
  'el': 'Greek',
  'en': 'English',
  'es': 'Spanish',
  'et': 'Estonian',
  'eu': 'Basque',
  'fa': 'Persian',
  'fi': 'Finnish',
  'fil': 'Filipino',
  'fr': 'French',
  'ga': 'Irish',
  'gl': 'Galician',
  'gu': 'Gujarati',
  'he': 'Hebrew',
  'hi': 'Hindi',
  'hr': 'Croatian',
  'hu': 'Hungarian',
  'hy': 'Armenian',
  'id': 'Indonesian',
  'is': 'Icelandic',
  'it': 'Italian',
  'ja': 'Japanese',
  'jv': 'Javanese',
  'ka': 'Georgian',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'kn': 'Kannada',
  'ko': 'Korean',
  'lo': 'Lao',
  'lt': 'Lithuanian',
  'lv': 'Latvian',
  'mk': 'Macedonian',
  'ml': 'Malayalam',
  'mn': 'Mongolian',
  'mr': 'Marathi',
  'ms': 'Malay',
  'mt': 'Maltese',
  'my': 'Myanmar',
  'nb': 'Norwegian Bokmål',
  'ne': 'Nepali',
  'nl': 'Dutch',
  'pl': 'Polish',
  'ps': 'Pashto',
  'pt': 'Portuguese',
  'ro': 'Romanian',
  'ru': 'Russian',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'so': 'Somali',
  'sq': 'Albanian',
  'sr': 'Serbian',
  'su': 'Sundanese',
  'sv': 'Swedish',
  'sw': 'Swahili',
  'ta': 'Tamil',
  'te': 'Telugu',
  'th': 'Thai',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'wuu': 'Wu Chinese',
  'yue': 'Cantonese',
  'zh': 'Chinese',
  'zu': 'Zulu',
};

// Default settings
export const DEFAULT_SETTINGS: TTSSettings = {
  rate: 1.0,
  pitch: 0,
  volume: 100,
};

export const DEFAULT_VOICE = 'en-US-AriaNeural';

export const MAX_TEXT_LENGTH = 5000;
export const MAX_HISTORY_ITEMS = 20;
