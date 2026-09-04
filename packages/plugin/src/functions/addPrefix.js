/*
	Prefixes lunar-ui's own class names and custom properties.

	Unlike DaisyUI -- which prefixes every class it encounters and keeps a
	denylist of exceptions -- this works off an allowlist generated at build time
	from the component sources (dist/registry.js). A name is renamed only when
	lunar-ui actually defines it, so Tailwind's theme variables, consumer state
	hooks like `.disabled`, and third-party classes are left alone by
	construction rather than by remembering to exclude them.
*/

const BACKSLASH = '\\';

/** Rewrites `.foo` in a selector, skipping quoted strings and [attr=...] sections. */
const prefixSelector = (selector, prefix, classes) => {
	let out = '';
	let quote = '';
	let bracketDepth = 0;

	for (let i = 0; i < selector.length; i++) {
		const ch = selector[i];

		if (quote) {
			out += ch;
			if (ch === BACKSLASH) {
				out += selector[++i] ?? '';
			} else if (ch === quote) {
				quote = '';
			}
			continue;
		}
		if (ch === '"' || ch === "'") {
			quote = ch;
			out += ch;
			continue;
		}
		if (ch === BACKSLASH) {
			// Escaped character in a selector, e.g. `.w-1\/2`. Copy both through.
			out += ch + (selector[++i] ?? '');
			continue;
		}
		if (ch === '[') bracketDepth++;
		else if (ch === ']' && bracketDepth > 0) bracketDepth--;

		if (ch === '.' && bracketDepth === 0) {
			const name = /^-?[_a-zA-Z][\w-]*/.exec(selector.slice(i + 1))?.[0];
			if (name && classes.has(name)) {
				out += '.' + prefix + name;
				i += name.length;
				continue;
			}
		}
		out += ch;
	}
	return out;
};

const VAR_REFERENCE = /--([-\w]+)/g;

const prefixValue = (value, prefix, variables) =>
	value.replace(VAR_REFERENCE, (match, name) =>
		variables.has(name) ? '--' + prefix + name : match
	);

const prefixKey = (key, prefix, classes, variables) => {
	if (key.startsWith('--')) {
		const name = key.slice(2);
		return variables.has(name) ? '--' + prefix + name : key;
	}
	// @property names a variable; other at-rules (@layer, @media) pass through.
	if (key.startsWith('@property --')) return prefixValue(key, prefix, variables);
	if (key.startsWith('@')) return key;
	return prefixSelector(key, prefix, classes);
};

const asSet = (value) => (value instanceof Set ? value : new Set(value));

export const addPrefix = (styles, prefix, registry) => {
	if (!prefix) return styles;
	const classes = asSet(registry.classes);
	const variables = asSet(registry.variables);

	const walk = (node) => {
		if (Array.isArray(node)) return node.map(walk);
		if (node === null || typeof node !== 'object') {
			return typeof node === 'string' ? prefixValue(node, prefix, variables) : node;
		}
		return Object.fromEntries(
			Object.entries(node).map(([key, value]) => [
				prefixKey(key, prefix, classes, variables),
				walk(value)
			])
		);
	};

	return walk(styles);
};
