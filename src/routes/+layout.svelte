<script lang="ts">
	import { Scaffold } from '$lib/svelte';
	import '../app.css';

	const { children } = $props();
</script>

<Scaffold>
	{#snippet header()}
		<header class="scaffold-header">Header</header>
	{/snippet}

	{#snippet sidebar()}
		<aside class="scaffold-sidebar">Sidebar</aside>
	{/snippet}

	{@render children()}
</Scaffold>
