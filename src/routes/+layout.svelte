<script lang="ts">
	import { ThemeProvider, initScaffoldScrollRestoration } from '$lib/svelte';
	import '../app.css';

	const { children } = $props();

	initScaffoldScrollRestoration();
</script>

<ThemeProvider initialTheme="default" initialMode="system">
	<div class="scaffold flex flex-col compact:flex-row">
		{@render children()}
	</div>
</ThemeProvider>
