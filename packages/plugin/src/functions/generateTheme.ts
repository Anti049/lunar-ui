import {
	Hct,
	TonalPalette,
	argbFromHex,
	hexFromArgb,
	SchemeContent,
	SchemeExpressive,
	SchemeFidelity,
	SchemeFruitSalad,
	SchemeMonochrome,
	SchemeNeutral,
	SchemeRainbow,
	SchemeTonalSpot,
	SchemeVibrant
} from '@material/material-color-utilities';
import type { DynamicScheme } from '@material/material-color-utilities';

/*
	Generates a lunar-ui theme palette from a seed colour, the same shape the
	shipped `default` and `gaziter` themes have: ten palettes at thirty tone
	steps each. The mode layer (colors/modes.css) maps those steps onto semantic
	roles via light-dark(), so a generated theme only has to supply the steps.
*/

/** The tone steps lunar-ui's themes declare. Material's standard set. */
const TONES = [
	0, 2, 4, 5, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 65, 70, 75, 80, 84, 87, 90, 92, 94, 95,
	96, 97, 98, 99, 100
] as const;

type SchemeConstructor = new (source: Hct, isDark: boolean, contrast: number) => DynamicScheme;

/*
	`vibrant` is the default because it is the closest match to the shipped
	themes -- for the default theme's #0956AA seed it lands within a step or two
	of the committed values. The originals came from a different generator, so
	expect a near match rather than an identical one.
*/
const VARIANTS: Record<string, SchemeConstructor> = {
	vibrant: SchemeVibrant,
	tonalspot: SchemeTonalSpot,
	content: SchemeContent,
	expressive: SchemeExpressive,
	fidelity: SchemeFidelity,
	fruitsalad: SchemeFruitSalad,
	monochrome: SchemeMonochrome,
	neutral: SchemeNeutral,
	rainbow: SchemeRainbow
};

export const VARIANT_NAMES = Object.keys(VARIANTS);

/*
	Material's schemes cover primary/secondary/tertiary/neutral/neutral-variant
	and error. lunar-ui adds four status palettes on top, so they get their own
	seeds. These defaults are the shipped default theme's own tone-40 values, so
	an unconfigured generated theme keeps lunar-ui's status colours.
*/
export const DEFAULT_STATUS_SEEDS = {
	success: '#006c49',
	warning: '#88512c',
	info: '#29657d',
	alert: '#993297'
} as const;

export type StatusPalette = keyof typeof DEFAULT_STATUS_SEEDS;

export interface GenerateThemeOptions {
	/** Seed colour, any hex Material accepts (`#0956AA`). */
	seed: string;
	/** Scheme variant; see VARIANT_NAMES. Matching ignores case, spaces and dashes. */
	variant?: string;
	/** Material contrast level, -1 (low) to 1 (high). */
	contrast?: number;
	/** Per-palette seed overrides for the four status roles. */
	status?: Partial<Record<StatusPalette, string>>;
}

/** Normalises "Tonal Spot", "tonal-spot" and "tonalspot" to the same key. */
const normaliseVariant = (variant: string): string => variant.toLowerCase().replace(/[^a-z]/g, '');

const toneSteps = (palette: TonalPalette, name: string): Record<string, string> =>
	Object.fromEntries(
		TONES.map((tone) => [`--theme-color-${name}-${tone}`, hexFromArgb(palette.tone(tone))])
	);

/**
 * Builds the `--theme-color-<palette>-<tone>` declarations for a seed colour.
 *
 * Tone steps do not depend on light/dark -- the mode layer picks per mode with
 * `light-dark()` -- so the scheme is constructed in light mode and the palettes
 * taken from it.
 */
export function generateThemePalette(options: GenerateThemeOptions): Record<string, string> {
	const requested = options.variant ? normaliseVariant(options.variant) : 'vibrant';
	const Scheme = VARIANTS[requested];
	if (!Scheme) {
		throw new Error(
			`lunar-ui: unknown theme variant "${options.variant}". ` +
				`Expected one of: ${VARIANT_NAMES.join(', ')}.`
		);
	}

	let source: Hct;
	try {
		source = Hct.fromInt(argbFromHex(options.seed));
	} catch {
		throw new Error(`lunar-ui: could not parse seed colour "${options.seed}". Expected a hex colour.`);
	}

	const scheme = new Scheme(source, false, options.contrast ?? 0);

	const declarations: Record<string, string> = {
		...toneSteps(scheme.primaryPalette, 'primary'),
		...toneSteps(scheme.secondaryPalette, 'secondary'),
		...toneSteps(scheme.tertiaryPalette, 'tertiary'),
		...toneSteps(scheme.neutralPalette, 'neutral'),
		...toneSteps(scheme.neutralVariantPalette, 'neutral-variant'),
		...toneSteps(scheme.errorPalette, 'error')
	};

	for (const [name, fallback] of Object.entries(DEFAULT_STATUS_SEEDS)) {
		const hex = options.status?.[name as StatusPalette] ?? fallback;
		Object.assign(declarations, toneSteps(TonalPalette.fromInt(argbFromHex(hex)), name));
	}

	return declarations;
}
