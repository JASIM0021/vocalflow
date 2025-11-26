import { AudioLines } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent blur-xl opacity-40 rounded-full scale-150 group-hover:opacity-60 transition-opacity duration-300" />
        {/* Icon container */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-300">
          <AudioLines className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight leading-none">
            Vocal<span className="gradient-text">Flow</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
            Text to Speech
          </span>
        </div>
      )}
    </div>
  );
}
