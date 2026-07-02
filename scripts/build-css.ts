#!/usr/bin/env bun
import { mkdir, cp, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC = 'src/lib/styles';
const OUT = 'dist/styles';

if (existsSync(OUT)) await rm(OUT, { recursive: true });
await mkdir(OUT, { recursive: true });
await cp(SRC, OUT, { recursive: true });

console.log(`✓ Copied ${SRC} → ${OUT}`);

/*
 * Minify only PLAIN CSS files. lunar-ui ships Tailwind SOURCE: files using
 * `@theme`, `@utility`, `@apply`, or `@plugin` must survive untouched so the
 * consumer's Tailwind compiler can process them. We therefore skip any file
 * containing those directives and minify the rest — chiefly the per-theme ramp
 * files, which are the bulk of the shipped bytes and are pure custom-property
 * declarations (safe to compress).
 */
const TAILWIND_DIRECTIVE = /@(?:theme|utility|apply|plugin)\b/;

/** Conservative whitespace/comment minifier for declaration-only CSS. */
function minifyPlainCss(css: string): string {
	return css
		.replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
		.replace(/\s+/g, ' ') // collapse whitespace runs to a single space
		.replace(/\s*([{}:;,])\s*/g, '$1') // drop spaces around structural chars
		.replace(/;}/g, '}') // drop the last semicolon in a block
		.trim();
}

async function* walk(dir: string): AsyncGenerator<string> {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(full);
		else yield full;
	}
}

let minified = 0;
let savedBytes = 0;
for await (const file of walk(OUT)) {
	if (extname(file) !== '.css') continue;
	const original = await readFile(file, 'utf8');
	if (TAILWIND_DIRECTIVE.test(original)) continue; // Tailwind source — leave as-is

	const compressed = minifyPlainCss(original);
	savedBytes += Buffer.byteLength(original) - Buffer.byteLength(compressed);
	await writeFile(file, compressed, 'utf8');
	minified++;
}

console.log(
	`✓ Minified ${minified} plain-CSS file(s) — saved ${(savedBytes / 1024).toFixed(1)} KB`
);
