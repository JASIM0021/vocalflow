'use client';

import Link from 'next/link';
import { Github, Keyboard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Gradient line at top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo with hover effect */}
          <Link
            href="/"
            className="flex items-center group transition-transform duration-200 hover:scale-[1.02]"
          >
            <Logo />
          </Link>

          {/* Center badge - Free & Open Source */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Free & Open Source</span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={0}>
              {/* Keyboard shortcuts button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hidden sm:flex hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => {
                      const event = new KeyboardEvent('keydown', {
                        key: 'k',
                        metaKey: true,
                        bubbles: true,
                      });
                      document.dispatchEvent(event);
                    }}
                  >
                    <Keyboard className="h-4 w-4" />
                    <span className="sr-only">Keyboard shortcuts</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur">
                  <p className="flex items-center gap-2">
                    Shortcuts
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">⌘K</kbd>
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-border mx-1" />

              {/* GitHub button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
                    asChild
                  >
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View on GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur">
                  <p>View on GitHub</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
}
