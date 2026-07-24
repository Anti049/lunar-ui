<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface ScaffoldProps {
		class?: string;
		minimized?: boolean;
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
		minimized = false,
		headerClass = '',
		header,
		sidebarClass = '',
		sidebar,
		mainClass = '',
		contentClass = '',
		children
	}: ScaffoldProps = $props();
</script>

<div class={cn('scaffold', className)} data-minimized={minimized ? '' : undefined}>
	{#if sidebar}
		<aside class={cn('scaffold-sidebar', sidebarClass)}>
			{@render sidebar()}
		</aside>
	{/if}
	{#if header}
		<header class={cn('scaffold-header', headerClass)}>
			{@render header()}
		</header>
	{/if}
	<main class={cn('scaffold-main', mainClass)}>
		<div class={cn('scaffold-content', contentClass)}>
			{@render children()}
		</div>
	</main>
</div>
