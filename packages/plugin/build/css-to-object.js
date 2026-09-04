import postcss from 'postcss';
import { objectify } from 'postcss-js';

/**
 * Compiled component CSS -> the JS object shape a Tailwind plugin can consume.
 *
 * Tailwind wraps `@utility` output in `@layer utilities`. The plugin's
 * addUtilities() re-adds that wrapper, so strip it here and keep only what was
 * inside: the component's own `@layer <name>.l3` blocks, layer-outside. The
 * runtime flips them selector-outside (see nestCssLayers) because addUtilities
 * rejects an at-rule as a top-level key.
 */
export function cssToObject(css) {
	const root = postcss.parse(css);

	const hoisted = postcss.root();
	const strays = [];

	root.each((node) => {
		if (node.type === 'atrule' && node.name === 'layer' && node.params === 'utilities') {
			node.each((child) => hoisted.append(child.clone()));
			return;
		}
		if (node.type === 'comment') return;
		strays.push(node.type === 'atrule' ? `@${node.name} ${node.params}` : node.selector);
		hoisted.append(node.clone());
	});

	return { styles: objectify(hoisted), strays };
}
