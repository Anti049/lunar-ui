#!/usr/bin/env bun
import { readdir } from 'node:fs/promises';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const CSS_DIR = 'src/lib/styles/components';
const SVELTE_DIR = 'src/lib/svelte';
const MARKER = '<!-- AUTO-GENERATED BELOW: do not edit by hand -->';

const cssFiles = (await readdir(CSS_DIR))
	.filter((f) => f.endsWith('.css') && f !== 'index.css')
	.map((f) => f.replace(/\.css$/, ''));

const rows = cssFiles.map((name) => {
	const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
	const hasSvelte = existsSync(`${SVELTE_DIR}/${capitalized}.svelte`);
	return `| ${capitalized} | ✅ | ${hasSvelte ? '✅' : '❌'} |`;
});

const generated = `${MARKER}

## Shipped (auto-generated from \`src/lib/\`)

| Component | CSS | Svelte |
|---|---|---|
${rows.join('\n')}
`;

const existing = readFileSync('COMPONENTS.md', 'utf-8');
const idx = existing.indexOf(MARKER);
const preserved = idx === -1 ? existing : existing.slice(0, idx);

writeFileSync('COMPONENTS.md', preserved.trimEnd() + '\n\n' + generated);
console.log(`✓ Updated COMPONENTS.md with ${rows.length} components.`);
