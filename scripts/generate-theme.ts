#!/usr/bin/env bun
/*
 * Theme CSS generator.
 *
 * Given a set of partial tone mappings for each color family, this script
 * emits a complete 30-tone ramp per family by interpolating missing tones
 * between the two nearest defined tones in OKLCH space (perceptually uniform).
 *
 * Tones 0 and 100 are hard-anchored to pure black (#000000) and pure white
 * (#ffffff) respectively unless explicitly overridden in the input.
 *
 * Usage:
 *   bun run scripts/generate-theme.ts <input.json> [--out <path>] [--name <theme>]
 *
 * Example:
 *   bun run scripts/generate-theme.ts themes/catppuccin-mocha.json \
 *     --name catppuccin-mocha \
 *     --out src/lib/styles/themes/catppuccin/mocha.css
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, basename, extname } from 'node:path';
import { parseArgs } from 'node:util';
import { TONES, FAMILIES, type Family, type Tone } from './lib/ramp';

// ---------- Types ----------

/** Input shape: `{ primary: { 80: "#cba6f7", 40: "#..." }, neutral: { ... } }` */
type ThemeInput = Partial<Record<Family, Record<string, string>>>;

// ---------- Color math (sRGB ↔ Linear ↔ OKLab ↔ OKLCH) ----------

type RGB = [number, number, number];
type OKLab = [number, number, number];
type OKLCH = [number, number, number]; // L, C, h(°)

function hexToRgb(hex: string): RGB {
	const h = hex.replace(/^#/, '').trim();
	const n =
		h.length === 3
			? h
					.split('')
					.map((c) => c + c)
					.join('')
			: h;
	if (!/^[0-9a-fA-F]{6}$/.test(n)) throw new Error(`Invalid hex color: "${hex}"`);
	return [
		parseInt(n.slice(0, 2), 16) / 255,
		parseInt(n.slice(2, 4), 16) / 255,
		parseInt(n.slice(4, 6), 16) / 255
	];
}

function rgbToHex([r, g, b]: RGB): string {
	const to = (v: number) =>
		Math.max(0, Math.min(255, Math.round(v * 255)))
			.toString(16)
			.padStart(2, '0');
	return `#${to(r)}${to(g)}${to(b)}`;
}

// sRGB companding
const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const linearToSrgb = (c: number) =>
	c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

// Björn Ottosson's OKLab (https://bottosson.github.io/posts/oklab/)
function rgbToOklab([r, g, b]: RGB): OKLab {
	const lr = srgbToLinear(r);
	const lg = srgbToLinear(g);
	const lb = srgbToLinear(b);

	const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
	const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
	const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);

	return [
		0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
		1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
		0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
	];
}

function oklabToRgb([L, a, b]: OKLab): RGB {
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;

	const l = l_ ** 3;
	const m = m_ ** 3;
	const s = s_ ** 3;

	const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
	const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
	const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

	return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

function oklabToOklch([L, a, b]: OKLab): OKLCH {
	const C = Math.sqrt(a * a + b * b);
	let h = (Math.atan2(b, a) * 180) / Math.PI;
	if (h < 0) h += 360;
	return [L, C, h];
}

function oklchToOklab([L, C, h]: OKLCH): OKLab {
	const rad = (h * Math.PI) / 180;
	return [L, C * Math.cos(rad), C * Math.sin(rad)];
}

const hexToOklch = (hex: string) => oklabToOklch(rgbToOklab(hexToRgb(hex)));

function oklchToHex(oklch: OKLCH): string {
	const rgb = oklabToRgb(oklchToOklab(oklch));
	return rgbToHex(rgb.map((c) => Math.max(0, Math.min(1, c))) as RGB);
}

// ---------- Interpolation ----------

/** Shortest-arc hue lerp so we don't spin the long way around the color wheel. */
function lerpHue(h1: number, h2: number, t: number): number {
	const diff = ((h2 - h1 + 540) % 360) - 180;
	return (h1 + diff * t + 360) % 360;
}

function lerpOklch(a: OKLCH, b: OKLCH, t: number): OKLCH {
	// If either endpoint is achromatic (C ≈ 0), hue is undefined — take the
	// chromatic end's hue to avoid smearing through arbitrary hues.
	const EPS = 1e-4;
	let h: number;
	if (a[1] < EPS && b[1] < EPS) h = 0;
	else if (a[1] < EPS) h = b[2];
	else if (b[1] < EPS) h = a[2];
	else h = lerpHue(a[2], b[2], t);

	return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, h];
}

// ---------- Ramp construction ----------

function buildRamp(
	family: Family,
	input: Record<string, string> | undefined
): Record<Tone, string> {
	// Collect defined tones + hard anchors (0 = black, 100 = white).
	const defined = new Map<Tone, string>();
	defined.set(0, '#000000');
	defined.set(100, '#ffffff');

	if (input) {
		for (const [toneStr, hex] of Object.entries(input)) {
			const tone = Number(toneStr);
			if (!(TONES as readonly number[]).includes(tone)) {
				throw new Error(
					`[${family}] Unknown tone "${toneStr}" — must be one of ${TONES.join(', ')}`
				);
			}
			defined.set(tone as Tone, hex);
		}
	}

	// Sort defined tones ascending — these are our interpolation anchors.
	const anchors = [...defined.keys()].sort((a, b) => a - b) as Tone[];

	// For each target tone, find the two flanking anchors and interpolate.
	const out = {} as Record<Tone, string>;
	for (const tone of TONES) {
		if (defined.has(tone)) {
			out[tone] = defined.get(tone)!.toLowerCase();
			continue;
		}

		// Find the last anchor ≤ tone and the first anchor ≥ tone.
		let lower: Tone = anchors[0];
		let upper: Tone = anchors[anchors.length - 1];
		for (const a of anchors) {
			if (a <= tone) lower = a;
			if (a >= tone) {
				upper = a;
				break;
			}
		}

		const t = (tone - lower) / (upper - lower);
		const oklch = lerpOklch(hexToOklch(defined.get(lower)!), hexToOklch(defined.get(upper)!), t);
		out[tone] = oklchToHex(oklch);
	}

	return out;
}

// ---------- CSS emission ----------

function emitCss(themeName: string, ramps: Record<Family, Record<Tone, string>>): string {
	// Un-layered `[data-theme='x']`, matching the hand-written ramp themes
	// (default.css, gaziter.css). The mode mapper resolves these tones via
	// var(), so no cascade layer is needed.
	const lines: string[] = [];
	lines.push(`[data-theme='${themeName}'] {`);

	for (const family of FAMILIES) {
		const ramp = ramps[family];
		for (const tone of TONES) {
			lines.push(`\t--theme-color-${family}-${tone}: ${ramp[tone]};`);
		}
	}

	lines.push('}');
	lines.push('');
	return lines.join('\n');
}

// ---------- Entry point ----------

async function main() {
	const { values, positionals } = parseArgs({
		args: Bun.argv.slice(2),
		options: {
			out: { type: 'string', short: 'o' },
			name: { type: 'string', short: 'n' }
		},
		allowPositionals: true
	});

	const inputPath = positionals[0];
	if (!inputPath) {
		console.error(
			'Usage: bun run scripts/generate-theme.ts <input.json> [--out <path>] [--name <theme>]'
		);
		process.exit(1);
	}

	const raw = await readFile(inputPath, 'utf8');
	const input = JSON.parse(raw) as ThemeInput;

	// Fill any missing families with just black/white anchors so the ramp is
	// still valid (produces a neutral gray ramp — obvious placeholder).
	const ramps = {} as Record<Family, Record<Tone, string>>;
	for (const family of FAMILIES) {
		ramps[family] = buildRamp(family, input[family]);
	}

	const themeName = values.name ?? basename(inputPath, extname(inputPath));
	const css = emitCss(themeName, ramps);

	if (values.out) {
		await mkdir(dirname(values.out), { recursive: true });
		await writeFile(values.out, css, 'utf8');
		console.log(`✓ Wrote ${values.out}`);
	} else {
		process.stdout.write(css);
	}
}

await main();
