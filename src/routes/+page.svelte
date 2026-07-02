<script lang="ts">
	import { resolve } from '$app/paths';
	import { appTheme, Scaffold } from '$lib/svelte';

	let collapsed = $state(false);
</script>

<Scaffold sidebarCollapsible sidebarCollapsed={collapsed}>
	{#snippet header()}
		<div class="scaffold-header surface-container p-2 flex items-center justify-center">
			<h1 class="text-headline-medium">LunarUI</h1>
		</div>
	{/snippet}
	{#snippet sidebar()}
		<div class="scaffold-sidebar surface-container-low"></div>
	{/snippet}
	<main class="p-4 scaffold-main flex flex-col surface">
		<h1 class="text-4xl mb-4">lunar-ui playground</h1>

		<div class="grid grid-cols-2 gap-4">
			<div class="bg-primary text-on-primary p-6 rounded select-none interactive">
				<p class="font-bold">bg-primary</p>
				<p class="text-sm opacity-90">
					Catppuccin Mocha: mauve (oklch 0.7871 0.1188 304.75)<br />
					Default dark: light blue (#b0c6ff)
				</p>
			</div>

			<div class="bg-secondary text-on-secondary p-6 rounded ripple select-none">
				<p class="font-bold">bg-secondary</p>
				<p class="text-sm opacity-90">Catppuccin / Default secondary</p>
			</div>

			<div class="flex flex-row gap-2 w-full">
				<button
					class="button button-tonal button-secondary"
					onclick={() => appTheme.setMode('light')}
				>
					Light Mode
				</button>
				<button
					class="button button-tonal button-secondary"
					onclick={() => appTheme.setMode('dark')}
				>
					Dark Mode
				</button>
				<button
					class="button button-tonal button-secondary"
					onclick={() => appTheme.setMode('system')}
				>
					System Mode
				</button>
			</div>
			<div class="flex flex-row gap-2 w-full surface-container p-2 rounded-sm">
				<button
					class="button button-tonal button-primary button-lg"
					onclick={() => appTheme.setTheme('catppuccin')}>Catppuccin</button
				>
				<button
					class="button button-tonal button-primary button-lg"
					onclick={() => appTheme.setTheme('default')}>Default</button
				>
			</div>
			<a href={resolve('/hsr')} class="button button-tonal button-primary button-lg">Go to HSR</a>
			<button
				class="button button-tonal button-primary button-lg"
				onclick={() => (collapsed = !collapsed)}
			>
				Toggle Minimized
			</button>
		</div>
		<a href="#foo" class="button button-tonal button-primary button-lg">Go to Filler</a>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 id="foo" class="text-display-large text-primary">Foo</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
		<h1 class="text-display-large">Filler</h1>
	</main>
</Scaffold>
