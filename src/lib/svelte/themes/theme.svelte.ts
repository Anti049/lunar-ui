/*
 * lunar-ui's theme wrapper. Layers Catppuccin flavor semantics on top of
 * mode-watcher, which handles the low-level mode/theme state, persistence,
 * SSR-safe rehydration, FOUC prevention, transition disabling, and matchMedia
 * lifecycle.
 *
 * mode-watcher: https://mode-watcher.sveco.dev
 */
import { setMode, setTheme, toggleMode, mode, theme } from 'mode-watcher';
import { PersistedState } from 'runed';

/** All lunar-ui palettes. Passed to mode-watcher's setTheme(). */
export type ThemeName =
	| 'default'
	| 'catppuccin'
	| 'dracula'
	| 'eula'
	| 'gaziter'
	| 'irontomb'
	| 'nihility'
	| 'star-rail';

/** Binary mode. Driven by mode-watcher. */
export type Mode = 'light' | 'dark' | 'system';

/**
 * Catppuccin-specific: which flavor is active.
 * `null` means "use binary mode" (Latte for light, Mocha for dark).
 * Any non-null value BYPASSES binary mode and pins the flavor directly.
 */
export type CatppuccinFlavor = 'latte' | 'frappe' | 'macchiato' | 'mocha';
export type FlavorOverride = CatppuccinFlavor | null;

/**
 * Persisted Catppuccin flavor override. Owns its own localStorage key;
 * mode-watcher owns theme and mode keys.
 */
const flavorState = new PersistedState<FlavorOverride>('lunar-ui:flavor', null, {
	serializer: {
		serialize: (v) => (v === null ? '' : v),
		deserialize: (v) => (v === '' ? null : (v as CatppuccinFlavor))
	}
});

export const appTheme = {
	/** Current palette. Delegates to mode-watcher. */
	get theme() {
		return (theme.current || 'default') as ThemeName;
	},

	/** Current mode. Delegates to mode-watcher. `undefined` on SSR. */
	get mode() {
		return mode.current;
	},

	/** Catppuccin flavor override. `null` when binary mode wins. */
	get flavor() {
		return flavorState.current;
	},

	/**
	 * The value written to <html data-theme="…">.
	 * Composes theme + flavor: `catppuccin-frappe`, or just `default`.
	 * A separate $effect (syncDataThemeAttribute) writes this to the DOM.
	 */
	get dataTheme() {
		return flavorState.current !== null ? `${this.theme}-${flavorState.current}` : this.theme;
	},

	setTheme(name: ThemeName) {
		flavorState.current = null;
		// mode-watcher's `theme` uses "" for "no data-theme" — normalize 'default' to ''
		setTheme(name === 'default' ? '' : name);
	},

	setMode(m: Mode) {
		flavorState.current = null;
		setMode(m);
	},

	toggleMode() {
		flavorState.current = null;
		toggleMode();
	},

	setFlavor(flavor: FlavorOverride) {
		flavorState.current = flavor;
		if (flavor !== null) {
			// Pin the equivalent mode so mode-watcher stays coherent.
			setMode(flavor === 'latte' ? 'light' : 'dark');
		}
	}
};

/**
 * Effect that composes theme + flavor into the data-theme attribute.
 *
 * mode-watcher writes just the theme name to <html data-theme="…">, which
 * doesn't include Catppuccin flavor suffixes. This effect overwrites that
 * with the composed value.
 *
 * Must be called during component setup (top of <script> in ThemeProvider).
 */
export function syncDataThemeAttribute() {
	$effect(() => {
		if (typeof document === 'undefined') return;
		document.documentElement.dataset.theme = appTheme.dataTheme;
	});
}
