<script lang="ts">
	import { ThemePreview } from '$lib/svelte';
</script>

<div class="flex flex-col gap-4 w-full h-fit compact:h-full items-center justify-center">
	<h1 class="medium:text-display-medium compact:text-display-small text-headline-medium">
		Theme Preview
	</h1>
	<div class="flex flex-col gap-2 w-full items-center justify-center max-w-6xl">
		<ThemePreview />
	</div>
</div>
