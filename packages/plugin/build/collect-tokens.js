import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

/*
	Gathers the design tokens a standalone plugin has to carry.

	Read from source rather than from a compile: `@theme` values are emitted on
	demand, so compiling the context in isolation would only reveal the tokens
	something happened to use.

	Tokens chain -- a component references `--color-primary`, which resolves to
	`--theme-color-primary`, which resolves to `--theme-color-primary-40`, which
	is finally a hex literal. So collection is a transitive closure, not a filter.
*/

const VAR_REFERENCE = /var\(\s*(--[-\w]+)/g;

/** Every custom-property declaration in the context, tagged with its selector. */
export function collectDeclarations(coreSrc) {
	const componentsDir = path.join(coreSrc, 'components');
	const declarations = [];

	const visit = (dir) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
			a.name.localeCompare(b.name)
		)) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				if (full !== componentsDir) visit(full);
				continue;
			}
			if (!entry.name.endsWith('.css')) continue;
			const root = postcss.parse(fs.readFileSync(full, 'utf8'));

			root.walkAtRules('theme', (atRule) => {
				atRule.walkDecls((decl) => {
					if (!decl.prop.startsWith('--')) return;
					declarations.push({ scope: 'theme', selector: '@theme', prop: decl.prop, value: decl.value });
				});
			});

			root.walkRules((rule) => {
				// @theme blocks are handled above; skip their inner decls.
				for (let p = rule.parent; p && p.type !== 'root'; p = p.parent) {
					if (p.type === 'atrule' && p.name === 'theme') return;
				}
				rule.each((node) => {
					if (node.type !== 'decl') return;
					if (node.prop.startsWith('--')) {
						declarations.push({
							scope: 'rule',
							selector: rule.selector,
							prop: node.prop,
							value: node.value
						});
					} else if (node.prop === 'color-scheme') {
						// Not a custom property, but `light-dark()` is inert without it.
						declarations.push({
							scope: 'color-scheme',
							selector: rule.selector,
							prop: node.prop,
							value: node.value
						});
					}
				});
			});
		}
	};

	visit(coreSrc);
	return declarations;
}

/** Transitive closure of the variables `seeds` depends on. */
export function resolveClosure(seeds, declarations) {
	const byName = new Map();
	for (const decl of declarations) {
		if (decl.scope === 'color-scheme') continue;
		if (!byName.has(decl.prop)) byName.set(decl.prop, []);
		byName.get(decl.prop).push(decl);
	}

	const needed = new Set();
	const queue = [...seeds].map((name) => (name.startsWith('--') ? name : '--' + name));

	while (queue.length) {
		const name = queue.pop();
		if (needed.has(name)) continue;
		needed.add(name);
		for (const decl of byName.get(name) ?? []) {
			for (const match of decl.value.matchAll(VAR_REFERENCE)) queue.push(match[1]);
		}
	}
	return needed;
}
