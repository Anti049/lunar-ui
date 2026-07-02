<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '../utils/cn';

	type ColorFormat = 'RGB' | 'HEX' | 'OKLCH';

	interface ColorSwatchProps {
		name: string;
		color: string;
		showColor?: boolean;
		interactive?: boolean;
		direction?: 'horizontal' | 'vertical';
		format?: ColorFormat;
		class?: string;
	}

	let {
		name,
		color,
		showColor = true,
		interactive = true,
		direction = 'vertical',
		format = 'OKLCH',
		class: className = ''
	}: ColorSwatchProps = $props();
	let swatchElement: HTMLDivElement | undefined = $state();
	let displayColor = $state('');

	// One hidden canvas parses any CSS color the browser can paint (rgb, oklch,
	// color(srgb ...), etc.) into sRGB [0..1] — no per-format regex needed.
	let ctx: CanvasRenderingContext2D | null = null;
	function toRgb01(cssColor: string): [number, number, number] {
		ctx ??= document.createElement('canvas').getContext('2d');
		if (!ctx) return [0, 0, 0];
		ctx.fillStyle = cssColor;
		ctx.fillRect(0, 0, 1, 1);
		const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
		return [r / 255, g / 255, b / 255];
	}

	function rgbToOklch(r: number, g: number, b: number): string {
		// Convert RGB to linear RGB
		const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
		const rLin = toLinear(r);
		const gLin = toLinear(g);
		const bLin = toLinear(b);

		// Convert linear RGB to XYZ
		const x = 0.4124 * rLin + 0.3576 * gLin + 0.1805 * bLin;
		const y = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
		const z = 0.0193 * rLin + 0.1192 * gLin + 0.9505 * bLin;

		// Convert XYZ to OKLab
		const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
		const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
		const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

		const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
		const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
		const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

		// Convert OKLab to OKLCH
		const C = Math.sqrt(a * a + b_ * b_);
		let H = (Math.atan2(b_, a) * 180) / Math.PI;
		if (H < 0) H += 360;

		return `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(2)})`;
	}

	function updateDisplayColor() {
		if (!swatchElement) {
			displayColor = '';
			return;
		}

		const bg = getComputedStyle(swatchElement).backgroundColor;

		// Keep full precision when the browser already reports OKLCH.
		if (format === 'OKLCH') {
			const m = bg.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
			if (m) {
				displayColor = `oklch(${(+m[1]).toFixed(4)} ${(+m[2]).toFixed(4)} ${(+m[3]).toFixed(2)})`;
				return;
			}
		}

		const [r, g, b] = toRgb01(bg);
		const [r255, g255, b255] = [r, g, b].map((c) => Math.round(c * 255));

		displayColor =
			format === 'OKLCH'
				? rgbToOklch(r, g, b)
				: format === 'RGB'
					? `rgb(${r255}, ${g255}, ${b255})`
					: `#${[r255, g255, b255].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
	}

	$effect(() => {
		// Re-resolve when the requested format or the source color class changes.
		void color;
		void format;
		updateDisplayColor();
	});

	onMount(() => {
		if (!swatchElement) return;

		// One observer covers theme toggles on <html> (class/style/data-theme) and
		// stylesheet swaps in <head> (Vite HMR) — editing CSS variables mutates no
		// element attribute, so both are needed.
		const observer = new MutationObserver(updateDisplayColor);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'style', 'data-theme']
		});
		observer.observe(document.head, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['href']
		});

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', updateDisplayColor);

		return () => {
			observer.disconnect();
			mediaQuery.removeEventListener('change', updateDisplayColor);
		};
	});

	function copyToClipboard() {
		if (!interactive) return;
		navigator.clipboard.writeText(displayColor);
		// alert(`Copied color ${displayColor} to clipboard!`);
	}
</script>

<div
	bind:this={swatchElement}
	class={cn(
		'flex justify-between rounded-sm p-2 text-caption-small medium:text-body-small compact:text-label-small',
		color,
		interactive && 'interactive',
		direction === 'horizontal' ? 'flex-row' : 'flex-col',
		className
	)}
	onclick={copyToClipboard}
	onkeydown={() => {}}
	role="button"
	tabindex="0"
>
	<span class="w-full truncate">{name}</span>
	{#if showColor}
		<span class="font-mono text-xs">{displayColor}</span>
	{/if}
</div>
