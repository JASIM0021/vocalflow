'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  layout?: string;
  layoutKey?: string;
  responsive?: boolean;
  className?: string;
}

export function AdUnit({
  slot,
  format = 'auto',
  layout,
  layoutKey,
  responsive = true,
  className = '',
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only load ad once
    if (isLoaded.current) return;

    try {
      // Check if adsbygoogle is available
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Don't render in development to avoid AdSense errors
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className={`bg-muted/50 border border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground text-sm ${className}`}
        style={{ minHeight: format === 'horizontal' ? '90px' : format === 'rectangle' ? '250px' : '100px' }}
      >
        Ad Placeholder ({format})
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
      {...(layout && { 'data-ad-layout': layout })}
      {...(layoutKey && { 'data-ad-layout-key': layoutKey })}
    />
  );
}

// Pre-configured ad components for common placements
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || ''}
      format="horizontal"
      className={className}
    />
  );
}

export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || ''}
      format="vertical"
      className={className}
    />
  );
}

export function InArticleAd({ className = '' }: { className?: string }) {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_INARTICLE_SLOT || ''}
      format="fluid"
      layout="in-article"
      className={className}
    />
  );
}

export function ResponsiveAd({ className = '' }: { className?: string }) {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT || ''}
      format="auto"
      responsive={true}
      className={className}
    />
  );
}
