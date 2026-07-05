<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface ScaffoldProps {
		class?: string;
		state?: 'collapsed' | 'expanded';
		headerClass?: string;
		header?: Snippet<[]>;
		sidebarClass?: string;
		sidebar?: Snippet<[]>;
		mainClass?: string;
		contentClass?: string;
		children: Snippet<[]>;
	}
	let {
		class: className = '',
		state: sidebarState = 'expanded',
		headerClass = '',
		header,
		sidebarClass = '',
		sidebar,
		mainClass = '',
		contentClass = '',
		children
	}: ScaffoldProps = $props();

	/**
	 * Whether the viewport is currently below the shared `--breakpoint-medium`
	 * token. Driven by `matchMedia` so the layout auto-collapses without any
	 * layout thrashing.
	 */
	let belowMedium = $state(false);
	let belowCompact = $state(false);

	/**
	 * The effective sidebar state, exposed on the DOM via `data-sidebar-state`.
	 * This is the single source of truth the scaffold CSS keys off:
	 *   - no sidebar snippet        → "hidden"
	 *   - viewport below compact     → "hidden" (auto-hide)
	 *   - viewport below medium     → "collapsed" (auto-collapse)
	 *   - otherwise                 → the caller's `state` prop
	 */
	let resolvedState = $derived(
		sidebar == null ? 'hidden' : belowCompact ? 'hidden' : belowMedium ? 'collapsed' : sidebarState
	);

	$effect(() => {
		// Read the breakpoint from the design token so this stays bound to
		// --breakpoint-medium rather than a hardcoded pixel value. matchMedia
		// can't resolve var(), so we resolve it once from the computed style.
		const mediumBreakpoint = getComputedStyle(document.documentElement)
			.getPropertyValue('--breakpoint-medium')
			.trim();
		const compactBreakpoint = getComputedStyle(document.documentElement)
			.getPropertyValue('--breakpoint-compact')
			.trim();
		const mediumQuery = window.matchMedia(`(max-width: ${mediumBreakpoint})`);
		const compactQuery = window.matchMedia(`(max-width: ${compactBreakpoint})`);
		const update = () => {
			belowMedium = mediumQuery.matches;
			belowCompact = compactQuery.matches;
		};

		update();
		mediumQuery.addEventListener('change', update);
		compactQuery.addEventListener('change', update);
		return () => {
			mediumQuery.removeEventListener('change', update);
			compactQuery.removeEventListener('change', update);
		};
	});
</script>

<div class={cn('scaffold', className)} data-sidebar-state={resolvedState}>
	{#if header}
		<header class={cn('scaffold-header', headerClass)}>
			{@render header()}
		</header>
	{/if}
	{#if sidebar}
		<aside class={cn('scaffold-sidebar', sidebarClass)}>
			{@render sidebar()}
		</aside>
	{/if}
	<main class={cn('scaffold-main', mainClass)}>
		<div class={cn('scaffold-content', contentClass)}>
			{@render children()}
		</div>
	</main>
</div>
