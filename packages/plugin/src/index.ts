import plugin from 'tailwindcss/plugin';
import type { PluginAPI, PluginWithConfig } from 'tailwindcss/plugin';

import * as bundles from './generated/imports.js';
import variants from './generated/variants.js';
import properties from './generated/properties.js';
import registry from './generated/registry.js';
import theme from './generated/theme.js';
import base from './generated/base.js';
import { addPrefix } from './functions/addPrefix.js';
import type { BundleRegistrar, PluginOptions, StyleObject } from './types.js';

/*
	lunar-ui as a standalone Tailwind plugin.

	  @import 'tailwindcss';
	  @plugin '@anti049/lunar-ui-plugin' {
	    prefix: lunar-;
	    exclude: badge;
	  }

	No CSS import is needed: the design tokens the bundles depend on ship with
	the plugin. Colors are registered through theme.extend so Tailwind also
	generates `bg-primary` and friends; the remaining tokens are emitted as plain
	custom properties.

	Options arrive already typed by Tailwind: `prefix: lunar-` is a string,
	`exclude: a, b` an array, bare true/false booleans, numbers numbers.
*/

/*
	Tailwind imports this type in its own declarations but never re-exports it,
	so the inferred type of the default export cannot be named. Restating it
	keeps the emitted .d.ts portable.
*/
type PluginWithOptions<T> = {
	(options?: T): PluginWithConfig;
	__isOptionsFunction: true;
};

/*
	The one place StyleObject meets Tailwind's CssInJs. They are the same shape
	except that postcss-js emits numeric CSS values as JS numbers (`opacity: 0`),
	which CssInJs does not model. Tailwind stringifies them at emit time, so the
	conversion is safe; it lives here so there is one place to revisit if that
	ever stops being true.
*/
type CssInJs = Parameters<PluginAPI['addBase']>[0];
const asCssInJs = (styles: StyleObject): CssInJs => styles as unknown as CssInJs;

const lunarUi: PluginWithOptions<PluginOptions> = plugin.withOptions(
	(options: PluginOptions = {}) => {
		const { prefix = '', include, exclude } = options;

		const included = (name: string): boolean => {
			if (include) return ([] as string[]).concat(include).includes(name);
			if (exclude) return !([] as string[]).concat(exclude).includes(name);
			return true;
		};

		return (api: PluginAPI) => {
			// Design tokens, plus the @property registrations backing Tailwind's
			// --tw-* machinery. Both must be unconditional, hence addBase.
			api.addBase(base);
			api.addBase(asCssInJs(addPrefix(properties, prefix, registry)));

			for (const [name, selector] of Object.entries(variants)) {
				api.addVariant(`${prefix}${name}`, selector);
			}

			const addUtilities = (utilities: Record<string, StyleObject>): void => {
				api.addUtilities(utilities as unknown as Record<string, CssInJs>);
			};

			for (const [name, register] of Object.entries(bundles) as [string, BundleRegistrar][]) {
				if (!included(name)) continue;
				register({ addUtilities, prefix });
			}
		};
	},
	// Theme values are shared Tailwind namespaces, so they are deliberately not
	// prefixed -- `--color-primary` stays `--color-primary` whatever the prefix.
	() => ({ theme: { extend: theme } })
);

export default lunarUi;
