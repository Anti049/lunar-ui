import plugin from 'tailwindcss/plugin';
import * as components from './imports.js';
import variants from './variants.js';
import properties from './properties.js';
import registry from './registry.js';
import theme from './theme.js';
import base from './base.js';
import { addPrefix } from './functions/addPrefix.js';

/*
	lunar-ui as a standalone Tailwind plugin.

	  @import 'tailwindcss';
	  @plugin '@anti049/lunar-ui-plugin' {
	    prefix: lunar-;
	    exclude: badge;
	  }

	No CSS import is needed: the design tokens the components depend on ship with
	the plugin. Colors are registered through theme.extend so Tailwind also
	generates `bg-primary` and friends; the remaining tokens are emitted as plain
	custom properties.

	Options arrive already typed by Tailwind: `prefix: lunar-` is a string,
	`exclude: a, b` an array, bare true/false booleans, numbers numbers.
*/
export default plugin.withOptions(
	(options = {}) => {
		const { prefix = '', include, exclude } = options;

		const included = (name) => {
			if (include) return [].concat(include).includes(name);
			if (exclude) return ![].concat(exclude).includes(name);
			return true;
		};

		return (api) => {
			// Design tokens, plus the @property registrations backing Tailwind's
			// --tw-* machinery. Both must be unconditional, hence addBase.
			api.addBase(base);
			api.addBase(addPrefix(properties, prefix, registry));

			for (const [name, selector] of Object.entries(variants)) {
				api.addVariant(`${prefix}${name}`, selector);
			}

			for (const [name, register] of Object.entries(components)) {
				if (!included(name)) continue;
				register({ addUtilities: api.addUtilities, prefix });
			}
		};
	},
	// Theme values are shared Tailwind namespaces, so they are deliberately not
	// prefixed -- `--color-primary` stays `--color-primary` whatever the prefix.
	() => ({ theme: { extend: theme } })
);
