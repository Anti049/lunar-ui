<script lang="ts">
	import { cn } from '../utils/cn.js';
	import { onMount } from 'svelte';

	type ColorClassMap = Record<string, string>;

	interface ThemedSVGProps {
		src?: string;
		svg?: string;
		replacements?: ColorClassMap;
		class?: string;
		ariaLabel?: string;
	}

	let {
		src = '',
		svg = '',
		replacements = {},
		class: className = '',
		ariaLabel = ''
	}: ThemedSVGProps = $props();

	let svgMarkup = $state('');
	let isMounted = $state(false);
	let requestId = 0;

	function resolveSource(): string {
		return src || svg;
	}

	function applyColorReplacements(svgText: string, classes: ColorClassMap): string {
		if (!Object.keys(classes).length) return svgText;

		const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
		const root = doc.documentElement;
		if (root.nodeName.toLowerCase() !== 'svg') {
			throw new Error('ThemedSVG expects SVG content.');
		}

		for (const [color, replacementClass] of Object.entries(classes)) {
			for (const attribute of ['fill', 'stroke'] as const) {
				const nodes = Array.from(doc.querySelectorAll(`[${attribute}]`));

				for (const node of nodes) {
					if (node.getAttribute(attribute) !== color) continue;

					node.removeAttribute(attribute);
					node.setAttribute('class', cn(node.getAttribute('class'), replacementClass));
				}
			}
		}

		if (className) {
			root.setAttribute('class', cn(root.getAttribute('class'), className));
		}

		if (ariaLabel) {
			root.setAttribute('role', 'img');
			root.setAttribute('aria-label', ariaLabel);
			root.removeAttribute('aria-hidden');
		} else {
			root.setAttribute('aria-hidden', 'true');
			root.removeAttribute('role');
			root.removeAttribute('aria-label');
		}

		return new XMLSerializer().serializeToString(doc);
	}

	async function loadSvg() {
		const source = resolveSource().trim();
		if (!source) {
			svgMarkup = '';
			return;
		}

		const currentRequest = ++requestId;

		try {
			const rawSvg = source.startsWith('<svg')
				? source
				: await fetch(source).then((response) => {
						if (!response.ok) {
							throw new Error(`Failed to load SVG: ${response.status} ${response.statusText}`);
						}

						return response.text();
					});

			const nextMarkup = applyColorReplacements(rawSvg, replacements);
			if (currentRequest === requestId) {
				svgMarkup = nextMarkup;
			}
		} catch {
			if (currentRequest === requestId) {
				svgMarkup = '';
			}
		}
	}

	onMount(() => {
		isMounted = true;

		return () => {
			isMounted = false;
			requestId += 1;
		};
	});

	$effect(() => {
		void src;
		void svg;
		void replacements;
		void className;
		void ariaLabel;

		if (!isMounted) return;
		void loadSvg();
	});
</script>

{#if svgMarkup}
	{@html svgMarkup}
{/if}
