<script lang="ts">
	import { ThemeProvider } from '$lib/svelte';
	import '../app.css';

	const { children } = $props();
</script>

<ThemeProvider initialTheme="default" initialMode="system">
	<div class="h-screen w-screen surface">
		{@render children()}
	</div>
</ThemeProvider>
