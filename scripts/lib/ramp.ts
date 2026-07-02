/*
 * Shared ramp + family definitions for the theme and token generators.
 * Single source of truth — keep generate-theme.ts and generate-tokens.ts in
 * sync by importing from here rather than redeclaring these constants.
 */

/** All 30 tones in the lunar-ui ramp, in order. */
export const TONES = [
	0, 2, 4, 5, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 65, 70, 75, 80, 84, 87, 90, 92, 94, 95, 96,
	97, 98, 99, 100
] as const;

/** Every color family that gets a full ramp. */
export const FAMILIES = [
	'primary',
	'secondary',
	'tertiary',
	'error',
	'success',
	'warning',
	'info',
	'alert',
	'neutral',
	'neutral-variant'
] as const;

/**
 * Accent families get semantic utilities (`primary`, `error`, …). The neutral
 * families feed surfaces instead, so they're excluded here.
 */
export const ACCENT_FAMILIES = [
	'primary',
	'secondary',
	'tertiary',
	'error',
	'success',
	'warning',
	'info',
	'alert'
] as const;

export type Family = (typeof FAMILIES)[number];
export type Tone = (typeof TONES)[number];

/** "neutral-variant" → "Neutral Variant", "primary" → "Primary". */
export const label = (family: string) =>
	family
		.split('-')
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join(' ');
