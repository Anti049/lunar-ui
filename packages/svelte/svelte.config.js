import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	// Strips `lang="ts"` from component <script> blocks during `svelte-package`.
	preprocess: vitePreprocess()
};
