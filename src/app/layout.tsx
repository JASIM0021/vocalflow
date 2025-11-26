import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/shared/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vocalflow.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1625' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VocalFlow - Free Text to Speech Online | AI Voice Generator',
    template: '%s | VocalFlow',
  },
  description:
    'Transform text into natural-sounding speech for free. 300+ AI voices, 70+ languages, no sign-up required. Download MP3 audio instantly. Best free TTS tool online.',
  keywords: [
    'text to speech',
    'TTS',
    'text to speech online',
    'free text to speech',
    'voice generator',
    'AI voice generator',
    'speech synthesis',
    'text to audio',
    'convert text to speech',
    'text reader',
    'online TTS',
    'natural voice generator',
    'text to mp3',
    'voice over generator',
    'AI speech',
    'neural TTS',
    'text to speech converter',
    'free TTS online',
    'multilingual TTS',
    'text to voice',
  ],
  authors: [{ name: 'VocalFlow', url: siteUrl }],
  creator: 'VocalFlow',
  publisher: 'VocalFlow',
  applicationName: 'VocalFlow',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'VocalFlow',
    title: 'VocalFlow - Free Text to Speech Online | AI Voice Generator',
    description:
      'Transform text into natural-sounding speech for free. 300+ AI voices, 70+ languages, no sign-up required. Download MP3 audio instantly.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VocalFlow - Free Text to Speech Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VocalFlow - Free Text to Speech Online | AI Voice Generator',
    description:
      'Transform text into natural-sounding speech for free. 300+ AI voices, 70+ languages, no sign-up required.',
    images: ['/og-image.png'],
    creator: '@vocalflow',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': siteUrl,
    },
  },
  category: 'technology',
  classification: 'Text to Speech Tool',
  other: {
    'google-site-verification': 'your-google-verification-code',
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      name: 'VocalFlow',
      description:
        'Free online text to speech tool with 300+ AI voices in 70+ languages. Convert text to natural-sounding audio and download as MP3.',
      url: siteUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        '300+ AI voices',
        '70+ languages',
        'No registration required',
        'Free MP3 download',
        'Adjustable speech rate',
        'Pitch and volume control',
        'Dark and light mode',
      ],
      screenshot: `${siteUrl}/og-image.png`,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'VocalFlow',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.svg`,
      },
      sameAs: ['https://github.com/vocalflow', 'https://twitter.com/vocalflow'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'VocalFlow',
      description: 'Free Text to Speech Online',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is VocalFlow free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, VocalFlow is completely free to use. No registration or credit card required. You can convert unlimited text to speech and download as MP3.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many voices does VocalFlow support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'VocalFlow offers 300+ natural-sounding AI voices across 70+ languages including English, Spanish, French, German, Chinese, Japanese, and many more.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I download the generated audio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you can download any generated speech as an MP3 file with a single click. No watermarks or limitations.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to create an account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No account or sign-up required. Simply visit VocalFlow, enter your text, select a voice, and generate speech instantly.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4304822949261068" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Google AdSense Script */}
      {adsenseClientId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
