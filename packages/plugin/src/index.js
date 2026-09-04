import plugin from 'tailwindcss/plugin';
import * as components from './imports.js';
import variants from './variants.js';
import properties from './properties.js';
import registry from './registry.js';
import { addPrefix } from './functions/addPrefix.js';

/*
	lunar-ui as a Tailwind JS plugin.

	  @plugin '@anti049/lunar-ui-plugin' {
	    prefix: lunar-;
	    exclude: badge;
	  }

	Options arrive already typed by Tailwind: `prefix: lunar-` is a string,
	`exclude: a, b` an array, bare true/false booleans, numbers numbers.
*/
export default plugin.withOptions((options = {}) => {
	const { prefix = '', include, exclude } = options;

	const included = (name) => {
		if (include) return [].concat(include).includes(name);
		if (exclude) return ![].concat(exclude).includes(name);
		return true;
	};

	return (api) => {
		// @property registrations back Tailwind's --tw-* machinery and must exist
		// unconditionally, so they go through addBase rather than a component.
		api.addBase(addPrefix(properties, prefix, registry));

		for (const [name, selector] of Object.entries(variants)) {
			api.addVariant(`${prefix}${name}`, selector);
		}

		for (const [name, register] of Object.entries(components)) {
			if (!included(name)) continue;
			register({ addUtilities: api.addUtilities, prefix });
		}
	};
});
