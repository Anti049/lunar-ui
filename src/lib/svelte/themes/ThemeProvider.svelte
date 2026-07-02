<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import {
		appTheme,
		syncDataThemeAttribute,
		type ThemeName,
		type Mode,
		type FlavorOverride
	} from './theme.svelte';
	import { initRipple } from '../actions';

	interface Props {
		initialTheme?: ThemeName;
		initialMode?: Mode;
		initialFlavor?: FlavorOverride;
		children: Snippet;
	}

	let {
		initialTheme = 'default',
		initialMode = 'system',
		initialFlavor = null,
		children
	}: Props = $props();

	// Keep <html data-theme="…"> in sync with theme + flavor composition.
	syncDataThemeAttribute();

	// Apply initial flavor override (Catppuccin only). Runs once after mount
	// so we don't fight the FOUC script or mode-watcher's rehydration.
	// A persisted user choice wins over initialFlavor — mirrors mode-watcher's
	// own defaultMode + defaultTheme behavior.
	onMount(() => {
		if (initialFlavor !== null && appTheme.flavor === null) {
			appTheme.setFlavor(initialFlavor);
		}
		initRipple();
	});
</script>

<!--
  ModeWatcher renders no visible output. It's a state carrier that:
    - Listens to matchMedia('(prefers-color-scheme: dark)')
    - Persists mode and theme to localStorage
    - Writes .dark/.light classes and inline color-scheme to <html>
    - Suppresses transitions during mode flips
-->
<ModeWatcher
	defaultMode={initialMode}
	defaultTheme={initialTheme === 'default' ? '' : initialTheme}
	darkClassNames={['dark']}
	lightClassNames={['light']}
	disableTransitions
	modeStorageKey="lunar-ui:mode"
	themeStorageKey="lunar-ui:theme"
/>

{@render children()}
