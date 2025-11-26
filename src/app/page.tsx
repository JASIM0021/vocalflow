import { Badge } from '@/components/ui/badge';
import { TTSInterface } from '@/components/tts/TTSInterface';
import { ResponsiveAd, BannerAd } from '@/components/ads/AdUnit';
import { Mic, Languages, Download, Zap, Shield, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="container pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 text-primary px-4 py-1"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Text to Speech
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Transform Text into{' '}
            <span className="gradient-text">Natural Speech</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create lifelike voiceovers in seconds. 300+ voices, 50+ languages,
            completely free. No sign-up required.
          </p>
        </div>

        {/* TTS Interface */}
        <div className="animate-slide-up">
          <TTSInterface />
        </div>

        {/* Ad Banner - Below TTS */}
        <div className="mt-8 max-w-4xl mx-auto">
          <ResponsiveAd className="rounded-lg overflow-hidden" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-16 max-w-4xl mx-auto">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-card/30 border border-border/50 hover:border-primary/30 transition-colors"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Pro tip: Use{' '}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
              Ctrl
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
              Enter
            </kbd>{' '}
            to generate,{' '}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
              Space
            </kbd>{' '}
            to play/pause
          </p>
        </div>

        {/* Bottom Ad Banner */}
        <div className="mt-12 max-w-4xl mx-auto">
          <BannerAd className="rounded-lg overflow-hidden" />
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    icon: Mic,
    title: '300+ Voices',
    description: 'Neural voices that sound natural',
  },
  {
    icon: Languages,
    title: '50+ Languages',
    description: 'Global language support',
  },
  {
    icon: Download,
    title: 'Free Download',
    description: 'Export as MP3 instantly',
  },
  {
    icon: Zap,
    title: 'Fast Generation',
    description: 'Results in seconds',
  },
  {
    icon: Shield,
    title: 'No Sign-up',
    description: 'Use without an account',
  },
  {
    icon: Sparkles,
    title: 'AI Powered',
    description: 'Azure neural TTS engine',
  },
];
