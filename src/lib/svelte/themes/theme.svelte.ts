/*
 * lunar-ui's theme wrapper. Layers Catppuccin flavor semantics on top of
 * mode-watcher, which handles the low-level mode/theme state, persistence,
 * SSR, FOUC prevention, transition disabling, and matchMedia lifecycle.
 *
 * mode-watcher docs: https://mode-watcher.sveco.dev
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

/** Binary mode class, driven by mode-watcher. */
export type Mode = 'light' | 'dark' | 'system';

/**
 * Catppuccin-specific: which flavor is active.
 * `null` means "use binary mode" — Latte for light, Mocha for dark.
 * Any non-null value BYPASSES binary mode and pins the flavor directly.
 */
export type CatppuccinFlavor = 'latte' | 'frappe' | 'macchiato' | 'mocha';
export type FlavorOverride = CatppuccinFlavor | null;

/**
 * Persisted Catppuccin flavor override. Persists across reloads via localStorage.
 * mode-watcher owns the theme + mode keys; we only own the flavor key.
 */
const flavorState = new PersistedState<FlavorOverride>('lunar-ui:flavor', null, {
	serializer: {
		serialize: (v) => (v === null ? '' : v),
		deserialize: (v) => (v === '' ? null : (v as CatppuccinFlavor))
	}
});

export const lunarTheme = {
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
	 */
	get dataTheme() {
		return flavorState.current !== null ? `${this.theme}-${flavorState.current}` : this.theme;
	},

	setTheme(name: ThemeName) {
		flavorState.current = null;
		setTheme(name === 'default' ? '' : name);
		// mode-watcher's `theme` uses "" for the "no data-theme" case,
		// so we normalize `default` to empty for it. Our dataTheme getter
		// still returns 'default' for the UI.
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
			// Pin the equivalent mode so mode-watcher stays in sync.
			setMode(flavor === 'latte' ? 'light' : 'dark');
		}
	}
};

export function syncDataThemeAttribute() {
	if (typeof document === 'undefined') return;
	$effect(() => {
		const composed = lunarTheme.dataTheme;
		document.documentElement.dataset.theme = composed;
	});
}
