<script lang="ts">
	import { ThemePreview } from '$lib/svelte';

	let themes = [
		'default',
		'catppuccin',
		'catppuccin-latte',
		'catppuccin-frappe',
		'catppuccin-macchiato',
		'catppuccin-mocha',
		'dracula',
		'alucard',
		'gaziter'
	];
</script>

<div class="flex flex-col gap-4 w-full max-w-6xl compact:flex-1 items-center justify-center">
	<select class="select">
		{#each themes as theme (theme)}
			<option value={theme}>{theme}</option>
		{/each}
	</select>
	<ThemePreview />
</div>
