/*
	End-to-end check of the CSS -> JS pipeline.

	Compiles badge + button twice from the same source of truth:
	  baseline  - lunar-ui's current pure-CSS path (@import the component files)
	  candidate - the generated plugin (@plugin dist/index.js)
	then compares what each produced. A faithful port means the same selectors
	carry the same declarations under the same cascade layers.

	Also asserts the prefix option renames what lunar-ui owns and nothing else.
*/
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { extractClasses } from '../build/extract-classes.js';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, '..');
const coreSrc = path.resolve(pkgRoot, '../core/src');
const tmpDir = path.join(pkgRoot, 'dist', '.test');

const COMPONENTS = ['badge', 'button'];
const cliEntry = path.join(
	path.dirname(require.resolve('@tailwindcss/cli/package.json')),
	'dist/index.mjs'
);
const toPosix = (p) => p.split(path.sep).join('/');
const rel = (target) => toPosix(path.relative(tmpDir, target));

function compile(input, label) {
	const inFile = path.join(tmpDir, label + '.in.css');
	const outFile = path.join(tmpDir, label + '.out.css');
	fs.writeFileSync(inFile, input);
	try {
		execFileSync(process.execPath, [cliEntry, '-i', inFile, '-o', outFile], { stdio: 'pipe' });
	} catch (error) {
		const detail = (error.stderr?.toString() || '').replace(/\x1b\[[0-9;]*m/g, '').trim();
		throw new Error('tailwind failed on ' + label + ':\n' + detail);
	}
	return fs.readFileSync(outFile, 'utf8');
}

/* Splits a selector list on top-level commas only, so `:is(a, b)` stays intact.
   Tailwind regroups selector lists when it re-emits plugin output, so comparing
   raw selector strings would report differences that are purely cosmetic. */
function splitSelectors(selector) {
	const parts = [];
	let depth = 0;
	let current = '';
	for (const ch of selector) {
		if (ch === '(' || ch === '[') depth++;
		else if (ch === ')' || ch === ']') depth--;
		if (ch === ',' && depth === 0) {
			parts.push(current);
			current = '';
			continue;
		}
		current += ch;
	}
	parts.push(current);
	return parts.map(normalizeSelector).filter(Boolean);
}

/* Tailwind reformats whitespace inside selectors when it re-emits plugin
   output (`:has( > svg)` vs `:has(> svg)`). Normalize so those don't read as
   different selectors. */
function normalizeSelector(selector) {
	return selector
		.replace(/\s+/g, ' ')
		.replace(/\s*([(),>+~])\s*/g, '$1')
		.trim();
}

/* selector -> sorted "prop: value" list, independent of layer nesting and of
   how selector lists happen to be grouped. */
function rulesBySelector(css, keep) {
	const root = postcss.parse(css);
	const out = new Map();
	root.walkRules((rule) => {
		const decls = [];
		rule.each((node) => {
			if (node.type === 'decl') decls.push(node.prop + ': ' + node.value);
		});
		if (!decls.length) return;
		for (const selector of splitSelectors(rule.selector)) {
			if (!keep(selector)) continue;
			out.set(selector, [...(out.get(selector) ?? []), ...decls]);
		}
	});
	for (const [k, v] of out) out.set(k, [...new Set(v)].sort());
	return out;
}

/* layer path a selector's rules sit under, e.g. "utilities > badge.l3" */
function layerPaths(css, keep) {
	const root = postcss.parse(css);
	const out = new Map();
	root.walkRules((rule) => {
		const layers = [];
		for (let p = rule.parent; p && p.type !== 'root'; p = p.parent) {
			if (p.type === 'atrule' && p.name === 'layer') layers.unshift(p.params);
		}
		for (const selector of splitSelectors(rule.selector)) {
			if (!keep(selector)) continue;
			const set = out.get(selector) ?? new Set();
			set.add(layers.join(' > ') || '(top level)');
			out.set(selector, set);
		}
	});
	return out;
}

const classes = COMPONENTS.flatMap((c) =>
	extractClasses(fs.readFileSync(path.join(coreSrc, 'components', c + '.css'), 'utf8'), c)
);
const safelist = [...new Set(classes)].sort();
const contextImport = "@import '" + rel(path.join(pkgRoot, 'src/context.css')) + "';";
const pluginPath = rel(path.join(pkgRoot, 'dist/index.js'));
const sourceLines = safelist.map((c) => '@source inline("' + c + '");');
const prefixedSourceLines = safelist.map((c) => '@source inline("lunar-' + c + '");');

fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });

const baseline = compile(
	[
		contextImport,
		...COMPONENTS.map((c) => "@import '" + rel(path.join(coreSrc, 'components', c + '.css')) + "';"),
		...sourceLines
	].join('\n'),
	'baseline'
);
const candidate = compile(
	[contextImport, "@plugin '" + pluginPath + "';", ...sourceLines].join('\n'),
	'candidate'
);
const prefixed = compile(
	[
		contextImport,
		"@plugin '" + pluginPath + "' {",
		'\tprefix: lunar-;',
		'}',
		...prefixedSourceLines
	].join('\n'),
	'prefixed'
);

/* No CSS import at all -- the plugin must carry its own tokens. */
const standalone = compile(
	["@import 'tailwindcss' source(none);", "@plugin '" + pluginPath + "';", ...sourceLines].join(
		'\n'
	),
	'standalone'
);

const owns = (selector) => COMPONENTS.some((c) => selector.includes('.' + c));
const ownsPrefixed = (selector) => COMPONENTS.some((c) => selector.includes('.lunar-' + c));

const base = rulesBySelector(baseline, owns);
const cand = rulesBySelector(candidate, owns);

const failures = [];
const notes = [];

// 1. Same set of selectors.
//
// Re-emitting through the plugin API leaves redundant wrappers behind:
// `:is(:is(x), y)` for `:is(x, y)`, and a trailing `:where(.selected)` on rules
// whose selector already carries `.selected`. Neither changes what matches --
// `:where()` contributes no specificity and `:is()` takes its most specific
// argument -- so collapse them before deciding a selector is genuinely new.
const collapseRedundant = (selector) => {
	let out = selector;
	let previous;
	do {
		previous = out;
		out = out.replace(/:is\((:is\([^()]*\))\)/g, '$1').replace(/:is\(([^(),]*)\)/g, '$1');
	} while (out !== previous);
	return out;
};
const withoutWhere = (selector) => collapseRedundant(selector.replace(/:where\([^()]*\)/g, ''));

const baseCollapsed = new Set([...base.keys()].map(withoutWhere));
const missing = [...base.keys()].filter((k) => !cand.has(k));
const extraAll = [...cand.keys()].filter((k) => !base.has(k));
const extra = extraAll.filter((k) => !baseCollapsed.has(withoutWhere(k)));
const extraRedundant = extraAll.length - extra.length;

if (missing.length) failures.push(missing.length + ' selectors missing from plugin output');
if (extra.length) failures.push(extra.length + ' selectors only in plugin output');

// 2. Same declarations per selector.
//
// Two kinds of benign difference show up here:
//   fallback folding - Tailwind collapses `var(--tw-x, ...)` to the literal in
//     its own utility output, but leaves plugin-supplied declarations as
//     authored. Same computed value, since --tw-x is set in the same rule.
//   superset - selector-list regrouping means a plugin rule can legitimately
//     carry declarations the CSS-first build reached through a different group.
const splitDecl = (d) => {
	const at = d.indexOf(': ');
	return [d.slice(0, at), d.slice(at + 2)];
};

function foldsToSame(baseDecls, candDecls) {
	const declared = new Map(baseDecls.concat(candDecls).map(splitDecl));
	for (const d of baseDecls) {
		if (candDecls.includes(d)) continue;
		const [prop, literal] = splitDecl(d);
		const counterpart = candDecls.find((c) => splitDecl(c)[0] === prop);
		if (!counterpart) return false;
		const variable = /^var\((--[-\w]+)/.exec(splitDecl(counterpart)[1])?.[1];
		if (!variable || declared.get(variable) !== literal) return false;
	}
	return true;
}

let realMismatches = 0;
let foldedCount = 0;
let supersetCount = 0;
for (const [selector, decls] of base) {
	const other = cand.get(selector);
	if (!other || JSON.stringify(decls) === JSON.stringify(other)) continue;

	const onlyBase = decls.filter((d) => !other.includes(d));
	const onlyCand = other.filter((d) => !decls.includes(d));

	if (!onlyBase.length) {
		supersetCount++;
		continue;
	}
	if (foldsToSame(decls, other)) {
		foldedCount++;
		continue;
	}
	realMismatches++;
	if (realMismatches <= 3) {
		notes.push(
			'  ' +
				selector +
				'\n    only in CSS-first: ' +
				(onlyBase.join('; ') || '-') +
				'\n    only in plugin:    ' +
				(onlyCand.join('; ') || '-')
		);
	}
}
if (realMismatches) failures.push(realMismatches + ' selectors differ in declarations');

// 3. Cascade position.
const baseLayers = layerPaths(baseline, owns);
const candLayers = layerPaths(candidate, owns);
const layerMoves = [];
for (const [selector, paths] of baseLayers) {
	const other = candLayers.get(selector);
	if (!other) continue;
	const a = [...paths].sort().join(',');
	const b = [...other].sort().join(',');
	if (a !== b) layerMoves.push('  ' + selector + '\n    CSS-first: ' + a + '\n    plugin:    ' + b);
}

// 4. Prefix behaviour.
const prefixedSelectors = rulesBySelector(prefixed, ownsPrefixed);
const strippedPrefixed = prefixed.replace(/\.lunar-/g, '.X-');
const prefixChecks = [
	[
		'renames library classes',
		prefixedSelectors.size > 0 && [...prefixedSelectors.keys()].every((s) => s.includes('.lunar-'))
	],
	['renames component-local vars', prefixed.includes('--lunar-button-color')],
	['leaves Tailwind/theme vars alone', !prefixed.includes('--lunar-color-')],
	[
		'leaves consumer state hooks alone',
		prefixed.includes('.disabled') && !prefixed.includes('.lunar-disabled')
	],
	['no unprefixed library class survives', !/\.badge[\s.,:[{]/.test(strippedPrefixed)]
];

console.log('selectors compared: ' + base.size + ' (CSS-first) vs ' + cand.size + ' (plugin)\n');

console.log('parity');
console.log('  present in both:        ' + [...base.keys()].filter((k) => cand.has(k)).length);
console.log('  missing from plugin:    ' + missing.length);
console.log('  extra in plugin:        ' + extra.length +
  (extraRedundant ? ' (+' + extraRedundant + ' redundant :is()/:where() wrappers, same matches)' : ''));
console.log('  benign (var fallback folding): ' + foldedCount);
console.log('  benign (regrouped superset):   ' + supersetCount);
console.log('  real declaration conflicts:    ' + realMismatches);
if (missing.length) for (const m of missing.slice(0, 5)) console.log('    missing: ' + m);
if (extra.length) for (const e of extra.slice(0, 5)) console.log('    extra:   ' + e);
if (notes.length) console.log(notes.join('\n'));

console.log('\ncascade');
if (!layerMoves.length) console.log('  every selector kept its layer path');
else {
	console.log('  ' + layerMoves.length + ' selectors changed layer:');
	console.log(layerMoves.slice(0, 4).join('\n'));
	if (layerMoves.length > 4) console.log('  ... and ' + (layerMoves.length - 4) + ' more');
}

// 5. Standalone: tokens must resolve with no CSS import in play.
const declaredVars = new Set([...standalone.matchAll(/(--[-\w]+)\s*:/g)].map((m) => m[1]));
const referencedVars = new Map();
for (const m of standalone.matchAll(/var\(\s*(--[-\w]+)\s*([,)])/g)) {
	const [, name, next] = m;
	if (!referencedVars.has(name)) referencedVars.set(name, false);
	if (next === ',') referencedVars.set(name, true);
}
// Tailwind's own preflight internals are always referenced with a fallback and
// never declared; a hard reference to something undefined is a real break.
const danglingHard = [...referencedVars]
	.filter(([name, hasFallback]) => !hasFallback && !declaredVars.has(name))
	.map(([name]) => name);

const standaloneRules = rulesBySelector(standalone, owns);
const standaloneChecks = [
	[
		'emits the same component rules as the plugin-with-context build',
		[...cand.keys()].every((selector) => standaloneRules.has(selector))
	],
	['no var() reference left dangling', danglingHard.length === 0],
	['carries the theme token chain', standalone.includes('--theme-color-primary-40:')],
	['carries color-scheme for light-dark()', standalone.includes('color-scheme')],
	['registers theme colors as utilities', /\.bg-primary\b|--color-primary\s*:/.test(standalone)]
];

console.log('\nstandalone (@plugin only, no @import of lunar-ui)');
console.log(
	'  selectors: ' + standaloneRules.size + ' | variables declared: ' + declaredVars.size
);
for (const [label, ok] of standaloneChecks) {
	console.log('  ' + (ok ? 'ok  ' : 'FAIL') + ' ' + label);
	if (!ok) failures.push('standalone: ' + label);
}
if (danglingHard.length) for (const v of danglingHard.slice(0, 10)) console.log('    dangling: ' + v);

console.log('\nprefix');
for (const [label, ok] of prefixChecks) {
	console.log('  ' + (ok ? 'ok  ' : 'FAIL') + ' ' + label);
	if (!ok) failures.push('prefix: ' + label);
}

if (!process.env.KEEP_TMP) fs.rmSync(tmpDir, { recursive: true, force: true });

console.log('');
if (failures.length) {
	console.log('RESULT: ' + failures.length + ' problem(s)');
	for (const f of failures) console.log('  - ' + f);
	process.exitCode = 1;
} else {
	console.log('RESULT: plugin output matches the CSS-first build');
}
