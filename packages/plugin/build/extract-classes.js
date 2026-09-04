import postcss from 'postcss';

const CLASS_IN_SELECTOR = /\.(-?[_a-zA-Z][\w-]*)/g;

/*
	Generic state hooks lunar-ui reads but does not own. They show up in
	component selectors (`.badge.disabled`) yet belong to the consumer's markup,
	so a prefix must never rename them.
*/
const STATE_HOOKS = new Set(['disabled', 'selected', 'active', 'checked', 'open', 'collapsed']);

/**
 * Class names a component stylesheet defines.
 *
 * `@utility` blocks are authoritative. Plain class selectors are only counted
 * when they sit in the component's own namespace -- otherwise Tailwind builtins
 * the component merely references (`.sr-only`) get claimed as ours and renamed.
 *
 * Tailwind emits an `@utility` only when something references it, so this list
 * is fed back to the compile as a safelist.
 */
export function extractClasses(css, namespace) {
	const root = postcss.parse(css);
	const classes = new Set();

	root.walkAtRules('utility', (rule) => {
		const name = rule.params.trim();
		if (name.includes('*')) {
			console.warn(`  ! skipping functional utility: @utility ${name}`);
			return;
		}
		classes.add(name);
	});

	root.walkRules((rule) => {
		if (rule.parent?.type === 'atrule' && rule.parent.name === 'utility') return;
		for (const match of rule.selector.matchAll(CLASS_IN_SELECTOR)) {
			const name = match[1];
			if (STATE_HOOKS.has(name)) continue;
			if (name !== namespace && !name.startsWith(`${namespace}-`)) continue;
			classes.add(name);
		}
	});

	return [...classes].sort();
}

/** Custom property names declared inside `@theme` blocks. */
export function extractThemeVariables(css) {
	const root = postcss.parse(css);
	const variables = new Set();
	root.walkAtRules('theme', (atRule) => {
		atRule.walkDecls((decl) => {
			if (decl.prop.startsWith('--')) variables.add(decl.prop.slice(2));
		});
	});
	return variables;
}

/** Custom property names declared at the top level of a stylesheet (e.g. Tailwind's theme.css). */
export function extractRootVariables(css) {
	const root = postcss.parse(css);
	const variables = new Set();
	root.walkDecls((decl) => {
		if (decl.prop.startsWith('--')) variables.add(decl.prop.slice(2));
	});
	return variables;
}
