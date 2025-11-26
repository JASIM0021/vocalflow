import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { MAX_TEXT_LENGTH } from '@/types';

// Keep a single TTS instance to avoid repeated connection overhead
let ttsInstance: MsEdgeTTS | null = null;
let currentVoice: string | null = null;

async function getTTSInstance(voice: string): Promise<MsEdgeTTS> {
  // Reuse instance if voice is the same
  if (ttsInstance && currentVoice === voice) {
    return ttsInstance;
  }

  // Create new instance
  ttsInstance = new MsEdgeTTS();
  await ttsInstance.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  currentVoice = voice;

  return ttsInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice, rate, pitch, volume } = body;

    // Validation
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedText.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Build prosody options
    const prosodyOptions: {
      rate?: string;
      pitch?: string;
      volume?: string;
    } = {};

    // Rate: convert from 0.5-2.0 to percentage string like "+50%" or "-25%"
    if (rate !== undefined && rate !== 1) {
      const ratePercent = Math.round((rate - 1) * 100);
      prosodyOptions.rate = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;
    }

    // Pitch: convert from -10 to 10 to Hz offset like "+10Hz" or "-5Hz"
    if (pitch !== undefined && pitch !== 0) {
      prosodyOptions.pitch = pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`;
    }

    // Volume: convert from 0-100 to percentage offset like "+0%" or "-50%"
    if (volume !== undefined && volume !== 100) {
      const volumeOffset = volume - 100;
      prosodyOptions.volume = volumeOffset >= 0 ? `+${volumeOffset}%` : `${volumeOffset}%`;
    }

    const selectedVoice = voice || 'en-US-AriaNeural';

    // Create TTS instance (reuses if same voice)
    const tts = await getTTSInstance(selectedVoice);

    // Get audio stream
    const { audioStream } = tts.toStream(trimmedText, prosodyOptions);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      audioStream.on('end', resolve);
      audioStream.on('error', reject);
    });

    const audioBuffer = Buffer.concat(chunks);

    // Return audio as binary response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Content-Disposition': 'attachment; filename="speech.mp3"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Synthesis failed:', error);
    // Reset TTS instance on error
    ttsInstance = null;
    currentVoice = null;
    return NextResponse.json(
      { error: 'Failed to synthesize speech. Please try again.' },
      { status: 500 }
    );
  }
}
