'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MAX_TEXT_LENGTH } from '@/types';
import { cn } from '@/lib/utils';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({ value, onChange, disabled }: TextInputProps) {
  const charCount = value.length;
  const isNearLimit = charCount > MAX_TEXT_LENGTH * 0.9;
  const isAtLimit = charCount >= MAX_TEXT_LENGTH;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="text-input" className="text-sm font-medium">
          Your Text
        </Label>
        <span
          className={cn(
            'text-xs transition-colors',
            isAtLimit
              ? 'text-destructive font-medium'
              : isNearLimit
              ? 'text-yellow-500 dark:text-yellow-400'
              : 'text-muted-foreground'
          )}
        >
          {charCount.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}
        </span>
      </div>
      <div className="relative">
        <Textarea
          id="text-input"
          placeholder="Enter the text you want to convert to speech... Try pasting an article, story, or any text you'd like to hear spoken aloud."
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_TEXT_LENGTH))}
          disabled={disabled}
          className={cn(
            'min-h-[200px] resize-none text-base leading-relaxed',
            'bg-background/50 border-border/50',
            'focus:border-primary/50 focus:ring-primary/20',
            'placeholder:text-muted-foreground/50',
            'transition-colors duration-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        {charCount === 0 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {['Ctrl', 'Enter'].map((key, i) => (
              <kbd
                key={key}
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/50 rounded border border-border/50"
              >
                {key}
              </kbd>
            ))}
            <span className="hidden sm:inline text-[10px] text-muted-foreground ml-1">
              to generate
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
