/*
 * Class name utility. Merges Tailwind classes intelligently:
 *   - Deduplicates conflicting utilities (last one wins)
 *   - Handles arrays, objects, and conditionals
 *
 * Composition:
 *   clsx(...)         → concatenates + handles truthy/falsy
 *   twMerge(...)      → resolves Tailwind conflicts (e.g. `p-4 p-2` → `p-2`)
 *
 * Framework-agnostic. Works in Svelte, React, Vue, plain JS.
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
