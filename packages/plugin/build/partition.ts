import postcss from 'postcss';
import { objectify } from 'postcss-js';
import type { Bundle, StyleObject } from '../src/types.js';

const LAYER_OWNER = /^([a-z][\w-]*)\.l\d+$/;

export interface Partitioned {
	components: Record<string, Bundle>;
	properties: StyleObject;
	unattributed: string[];
}

/**
 * Splits a whole-library compile into per-bundle buckets.
 *
 * Attribution runs off lunar-ui's own naming discipline: component rules live
 * in `@layer <component>.l<n>`, and keyframes are named `<component>-*`.
 * Foundations carry no layer marker of their own, so they are attributed by
 * class name via `classOwners`. Anything unattributed is context (theme,
 * preflight) and is dropped.
 *
 * Two buckets per bundle, because they need different plugin channels:
 *   utilities - came from `@utility`, wrapped in `@layer utilities`, usage-gated
 *   standalone - came from plain selectors, emitted at the top level
 */
export function partition(
	css: string,
	components: string[],
	classOwners: ReadonlyMap<string, string> = new Map()
): Partitioned {
	const root = postcss.parse(css);
	const owners = new Set(components);
	const extraBundles = new Set(classOwners.values());

	const buckets: Record<string, { utilities: postcss.Root; standalone: postcss.Root }> =
		Object.fromEntries(
			[...components, ...extraBundles].map((name) => [
				name,
				{ utilities: postcss.root(), standalone: postcss.root() }
			])
		);
	const properties = postcss.root();
	const unattributed: string[] = [];

	const ownerOf = (node: postcss.ChildNode): string | null => {
		if (node.type === 'atrule' && node.name === 'layer') {
			const owner = LAYER_OWNER.exec(node.params.trim())?.[1];
			if (owner && owners.has(owner)) return owner;
		}
		if (node.type === 'atrule' && node.name === 'keyframes') {
			const name = node.params.trim();
			for (const c of components) if (name === c || name.startsWith(`${c}-`)) return c;
		}
		// Foundations carry no @layer marker of their own -- `@utility surface`
		// lands as a bare `.surface` inside @layer utilities -- so they are
		// attributed by class name instead.
		if (node.type === 'rule') {
			for (const match of node.selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
				const owner = classOwners.get(match[1]);
				if (owner) return owner;
			}
		}
		return null;
	};

	const take = (node: postcss.ChildNode, bucket: keyof Bundle): boolean => {
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
		// and must be unconditional, so they go to addBase rather than a bundle.
		if (node.type === 'atrule' && node.name === 'property') {
			properties.append(node.clone());
			return;
		}
		if (node.type === 'atrule' && node.name === 'layer' && node.params === 'properties') {
			node.each((child) => {
				properties.append(child.clone());
			});
			return;
		}
		if (!take(node, 'standalone')) unattributed.push(describe(node));
	});

	return {
		components: Object.fromEntries(
			Object.entries(buckets).map(([name, b]) => [
				name,
				{
					utilities: objectify(b.utilities) as StyleObject,
					standalone: objectify(b.standalone) as StyleObject
				}
			])
		),
		properties: objectify(properties) as StyleObject,
		unattributed
	};
}

const describe = (node: postcss.ChildNode): string =>
	node.type === 'atrule' ? `@${node.name} ${node.params}`.trim() : (node as postcss.Rule).selector;
