import postcss from 'postcss';
import { objectify } from 'postcss-js';

const LAYER_OWNER = /^([a-z][\w-]*)\.l\d+$/;

/**
 * Splits a whole-library compile into per-component buckets.
 *
 * Attribution runs off lunar-ui's own naming discipline: component rules live
 * in `@layer <component>.l<n>`, and keyframes are named `<component>-*`.
 * Anything unattributed is context (theme, preflight, foundations) and dropped.
 *
 * Two buckets per component, because they need different plugin channels:
 *   utilities - came from `@utility`, wrapped in `@layer utilities`, usage-gated
 *   standalone - came from plain selectors, emitted at the top level
 */
export function partition(css, components) {
	const root = postcss.parse(css);
	const owners = new Set(components);

	const buckets = Object.fromEntries(
		components.map((name) => [name, { utilities: postcss.root(), standalone: postcss.root() }])
	);
	const properties = postcss.root();
	const unattributed = [];

	const ownerOf = (node) => {
		if (node.type === 'atrule' && node.name === 'layer') {
			const owner = LAYER_OWNER.exec(node.params.trim())?.[1];
			if (owner && owners.has(owner)) return owner;
		}
		if (node.type === 'atrule' && node.name === 'keyframes') {
			const name = node.params.trim();
			for (const c of components) if (name === c || name.startsWith(`${c}-`)) return c;
		}
		return null;
	};

	const take = (node, bucket) => {
		const owner = ownerOf(node);
		if (owner) {
			buckets[owner][bucket].append(node.clone());
			return true;
		}
		return false;
	};

	root.each((node) => {
		if (node.type === 'comment') return;

		if (node.type === 'atrule' && node.name === 'layer' && node.params === 'utilities') {
			node.each((child) => {
				if (!take(child, 'utilities')) unattributed.push(describe(child));
			});
			return;
		}
		// @property registrations back Tailwind's --tw-* machinery. They are global
		// and must be unconditional, so they go to addBase rather than a component.
		if (node.type === 'atrule' && node.name === 'property') {
			properties.append(node.clone());
			return;
		}
		if (node.type === 'atrule' && node.name === 'layer' && node.params === 'properties') {
			node.each((child) => properties.append(child.clone()));
			return;
		}
		if (!take(node, 'standalone')) unattributed.push(describe(node));
	});

	return {
		components: Object.fromEntries(
			Object.entries(buckets).map(([name, b]) => [
				name,
				{ utilities: objectify(b.utilities), standalone: objectify(b.standalone) }
			])
		),
		properties: objectify(properties),
		unattributed
	};
}

const describe = (node) =>
	node.type === 'atrule' ? `@${node.name} ${node.params}`.trim() : node.selector;
