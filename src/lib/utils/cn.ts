import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
	// Remove empty class strings
	inputs = inputs.filter(Boolean);
	inputs = inputs.filter((input) => input !== '');
	return twMerge(clsx(...inputs));
}
