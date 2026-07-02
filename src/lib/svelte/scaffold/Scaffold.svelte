<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../utils';

	interface Props {
		/** Optional top header content. Static in the top-right grid cell. */
		header?: Snippet;
		/** Optional bottom footer content. Static in the bottom-right cell. */
		footer?: Snippet;
		/** Optional sidebar content. Full-height left column, own scroll container. */
		sidebar?: Snippet;
		/** Main content — the only required section. Own scroll container. */
		children: Snippet;

		/**
		 * When true, the sidebar renders in its collapsed narrow state.
		 * Animated via prefers-reduced-motion-aware transitions.
		 */
		sidebarCollapsed?: boolean;

		/**
		 * When true, the sidebar auto-collapses at the medium breakpoint
		 * (960px) and below. Ignored if there's no sidebar.
		 */
		sidebarCollapsible?: boolean;

		/** Extra classes for the .scaffold root. */
		class?: string;
	}

	let {
		header,
		footer,
		sidebar,
		children,
		sidebarCollapsed = false,
		sidebarCollapsible = false,
		class: klass = ''
	}: Props = $props();

	let classes = $derived(
		cn(
			'scaffold',
			sidebarCollapsed && 'scaffold-sidebar-collapsed',
			sidebarCollapsible && 'scaffold-sidebar-collapsible',
			klass
		)
	);
</script>

<div class={classes}>
	{#if header}
		<header class="scaffold-header">
			{@render header()}
		</header>
	{/if}

	{#if sidebar}
		<!--
		  scrollbar-thin on the sidebar because nav lists are usually narrow
		  and a 12px scrollbar competes visually. Consumers can override via
		  a nested class if they want the default width.
		-->
		<aside class="scaffold-sidebar scrollbar scrollbar-thin">
			{@render sidebar()}
		</aside>
	{/if}

	<!--
	  Default 12px themed scrollbar on main. Bounded to the main cell of the
	  grid, so it appears only between the header and the footer.
	-->
	<main class="scaffold-main scrollbar">
		{@render children()}
	</main>

	{#if footer}
		<footer class="scaffold-footer">
			{@render footer()}
		</footer>
	{/if}
</div>
