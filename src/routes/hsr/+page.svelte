<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<h1 class="text-4xl mb-4">lunar-ui playground</h1>

<div class="grid grid-cols-2 gap-4">
	<div class="bg-primary text-on-primary p-6 rounded">
		<p class="font-bold">bg-primary</p>
		<p class="text-sm opacity-90">
			Catppuccin Mocha: mauve (oklch 0.7871 0.1188 304.75)<br />
			Default dark: light blue (#b0c6ff)
		</p>
	</div>

	<div class="bg-secondary text-on-secondary p-6 rounded">
		<p class="font-bold">bg-secondary</p>
		<p class="text-sm opacity-90">Catppuccin / Default secondary</p>
	</div>
	<a href={resolve('/')} class="button button-tonal button-primary button-lg">Go to Home</a>
</div>
