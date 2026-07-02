<script lang="ts">
	import { ThemeScope } from '$lib/svelte';

	let { children } = $props();
</script>

<ThemeScope class="h-screen w-screen surface" theme="gaziter">
	<div class="scaffold scrollbar scaffold-sidebar-collapsible scrollbar-accent">
		<aside class="scaffold-sidebar surface-container-low"></aside>
		<main class="scaffold-main p-4 flex flex-col">
			{@render children()}
		</main>
	</div>
</ThemeScope>
