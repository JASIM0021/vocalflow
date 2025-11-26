import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 mt-auto">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Free text-to-speech powered by{' '}
          <a
            href="https://azure.microsoft.com/en-us/products/ai-services/text-to-speech"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            Azure AI
          </a>
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for everyone
        </p>
      </div>
    </footer>
  );
}
