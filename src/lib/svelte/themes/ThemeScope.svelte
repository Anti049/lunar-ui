<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ThemeName } from './theme.svelte';

	interface ThemeScopeProps {
		theme: ThemeName;
		class?: string;
		children: Snippet<[]>;
	}
	let { theme, class: className, children }: ThemeScopeProps = $props();
</script>

<div data-theme={theme} class={className}>
	{@render children()}
</div>
