<script lang="ts">
	import { ThemeScope } from '$lib/svelte';

	let { children } = $props();
</script>

<ThemeScope class="h-screen w-screen surface" theme="gaziter">
	{@render children()}
</ThemeScope>
