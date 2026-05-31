import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Compose class lists. Merges Tailwind conflicts so callers can override safely.
 *
 *   <div class={cn("px-4", className, isActive && "px-6")} />
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
