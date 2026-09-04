import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
	extractClasses,
	extractThemeVariables,
	extractRootVariables
} from './extract-classes.js';
import { partition } from './partition.js';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, '..');
const coreSrc = path.resolve(pkgRoot, '../core/src');
const distDir = path.join(pkgRoot, 'dist');
const tmpDir = path.join(distDir, '.tmp');

const COMPONENTS = ['badge', 'button'];

/* Hand-ported: @custom-variant has no automated CSS -> JS path. */
const CUSTOM_VARIANTS = { selected: '&:where(.selected)' };

const cliEntry = path.join(
	path.dirname(require.resolve('@tailwindcss/cli/package.json')),
	'dist/index.mjs'
);
const toPosix = (p) => p.split(path.sep).join('/');
const relFromTmp = (target) => toPosix(path.relative(tmpDir, target));

function runTailwind(input, label) {
	const inFile = path.join(tmpDir, `${label}.in.css`);
	const outFile = path.join(tmpDir, `${label}.out.css`);
	fs.writeFileSync(inFile, input);
	try {
		execFileSync(process.execPath, [cliEntry, '-i', inFile, '-o', outFile], { stdio: 'pipe' });
	} catch (error) {
		const detail = (error.stderr?.toString() || '').replace(/\x1b\[[0-9;]*m/g, '').trim();
		throw new Error(`tailwind failed on ${label}:\n${detail}`);
	}
	return fs.readFileSync(outFile, 'utf8');
}

/* Every custom property the theme owns: Tailwind's defaults plus lunar-ui's own
   @theme blocks. Read from source, not from a compile -- theme variables are
   emitted on demand, so a compile only reveals the ones something happened to use. */
function themeVariables() {
	const owned = new Set();
	const tailwindTheme = path.join(
		path.dirname(require.resolve('tailwindcss/package.json')),
		'theme.css'
	);
	for (const name of extractRootVariables(fs.readFileSync(tailwindTheme, 'utf8'))) owned.add(name);

	// Everything outside components/ is context: themes and token files declare
	// their variables at :root, not only inside @theme, so take every declaration
	// there. Components are excluded so their own locals stay prefixable.
	const componentsDir = path.join(coreSrc, 'components');
	const walk = (dir) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				if (full !== componentsDir) walk(full);
				continue;
			}
			if (!entry.name.endsWith('.css')) continue;
			const css = fs.readFileSync(full, 'utf8');
			const inComponents = full.startsWith(componentsDir);
			const names = inComponents ? extractThemeVariables(css) : extractRootVariables(css);
			for (const name of names) owned.add(name);
		}
	};
	walk(coreSrc);
	// Component files may still define @theme values; those are context too.
	for (const entry of fs.readdirSync(componentsDir)) {
		if (!entry.endsWith('.css')) continue;
		for (const n of extractThemeVariables(fs.readFileSync(path.join(componentsDir, entry), 'utf8')))
			owned.add(n);
	}
	return owned;
}

const referencedVariables = (css) => new Set([...css.matchAll(/--([-\w]+)/g)].map((m) => m[1]));

function emitComponent(name, buckets) {
	const dir = path.join(distDir, 'components', name);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(
		path.join(dir, 'object.js'),
		`export const utilities = ${JSON.stringify(buckets.utilities, null, '\t')};\n\n` +
			`export const standalone = ${JSON.stringify(buckets.standalone, null, '\t')};\n`
	);
	fs.writeFileSync(
		path.join(dir, 'index.js'),
		[
			`import { utilities, standalone } from './object.js';`,
			`import registry from '../../registry.js';`,
			`import { addPrefix } from '../../functions/addPrefix.js';`,
			`import { nestCssLayers } from '../../functions/nestCssLayers.js';`,
			``,
			`export default ({ addUtilities, prefix = '' }) => {`,
			`\taddUtilities(nestCssLayers(addPrefix(utilities, prefix, registry)));`,
			`\t// Authored as plain selectors, which Tailwind emits in a top-level`,
			`\t// layer. The plugin API has no channel for that, so they land in`,
			`\t// @layer utilities instead -- see README, "Known divergences".`,
			`\taddUtilities(nestCssLayers(addPrefix(standalone, prefix, registry)));`,
			`};`,
			``
		].join('\n')
	);
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });

process.stdout.write('reading theme variables ... ');
const owned = themeVariables();
console.log(`${owned.size} owned by Tailwind + lunar-ui @theme`);

const classesByComponent = Object.fromEntries(
	COMPONENTS.map((name) => [
		name,
		extractClasses(fs.readFileSync(path.join(coreSrc, 'components', `${name}.css`), 'utf8'), name)
	])
);
const allClasses = [...new Set(Object.values(classesByComponent).flat())].sort();

process.stdout.write(`compiling ${COMPONENTS.length} components together ... `);
const input = [
	`@import '${relFromTmp(path.join(pkgRoot, 'src/context.css'))}';`,
	...COMPONENTS.map((c) => `@import '${relFromTmp(path.join(coreSrc, 'components', `${c}.css`))}';`),
	// @utility output is emitted on demand, so safelist every class the
	// components define or the compile comes back empty.
	...allClasses.map((c) => `@source inline("${c}");`)
].join('\n');
const compiled = runTailwind(input, 'library');
if (compiled.includes('@apply')) throw new Error('output still contains @apply');
console.log(`${compiled.split('\n').length} lines`);

const { components: buckets, properties, unattributed } = partition(compiled, COMPONENTS);

const localVariables = new Set();
for (const name of COMPONENTS) {
	const bucketCss = JSON.stringify(buckets[name]);
	for (const v of referencedVariables(bucketCss)) {
		if (!owned.has(v) && !v.startsWith('tw-')) localVariables.add(v);
	}
}

for (const name of COMPONENTS) {
	emitComponent(name, buckets[name]);
	console.log(
		`  ${name}: ${classesByComponent[name].length} classes, ` +
			`${Object.keys(buckets[name].utilities).length} utility keys, ` +
			`${Object.keys(buckets[name].standalone).length} standalone keys`
	);
}

const registry = { classes: allClasses, variables: [...localVariables].sort() };

fs.mkdirSync(path.join(distDir, 'functions'), { recursive: true });
for (const f of fs.readdirSync(path.join(pkgRoot, 'src/functions'))) {
	fs.copyFileSync(path.join(pkgRoot, 'src/functions', f), path.join(distDir, 'functions', f));
}
const write = (file, value) =>
	fs.writeFileSync(path.join(distDir, file), `export default ${JSON.stringify(value, null, '\t')};\n`);
write('registry.js', registry);
write('variants.js', CUSTOM_VARIANTS);
write('properties.js', properties);
fs.writeFileSync(
	path.join(distDir, 'imports.js'),
	COMPONENTS.map((c) => `export { default as ${c} } from './components/${c}/index.js';`).join('\n') +
		'\n'
);
fs.copyFileSync(path.join(pkgRoot, 'src/index.js'), path.join(distDir, 'index.js'));

console.log(`\nlocal variables: ${registry.variables.join(', ') || '(none)'}`);
console.log(`@property registrations hoisted to addBase: ${Object.keys(properties).length}`);
if (unattributed.length) {
	console.log(`\nunattributed (dropped as context): ${unattributed.length}`);
	for (const u of unattributed.slice(0, 8)) console.log(`  ${u}`);
	if (unattributed.length > 8) console.log(`  ... and ${unattributed.length - 8} more`);
}
if (!process.env.KEEP_TMP) fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(`\nbuilt ${COMPONENTS.length} components -> dist/`);
