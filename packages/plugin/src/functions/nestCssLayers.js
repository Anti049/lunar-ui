/*
	addUtilities() rejects an at-rule as a top-level key -- it wants a class
	selector. Compiled output is the other way round: `@layer badge.l3` wrapping
	`.badge`. This inverts that nesting, so `{'@layer x': {'.a': {...}}}` becomes
	`{'.a': {'@layer x': {...}}}`, which is also how the CSS is authored by hand.
*/

const appendRule = (styles, selector, rule) => {
	const existing = styles[selector];
	if (existing === undefined) {
		styles[selector] = rule;
		return;
	}
	styles[selector] = Array.isArray(existing) ? [...existing, rule] : [existing, rule];
};

const wrapWithAtRules = (rule, atRules) =>
	atRules.reduceRight((wrapped, atRule) => ({ [atRule]: wrapped }), rule);

const moveLayerRules = (styles, layerValue, atRules) => {
	for (const block of Array.isArray(layerValue) ? layerValue : [layerValue]) {
		for (const [key, value] of Object.entries(block)) {
			if (key.startsWith('@')) {
				moveLayerRules(styles, value, [...atRules, key]);
				continue;
			}
			appendRule(styles, key, wrapWithAtRules(value, atRules));
		}
	}
};

export const nestCssLayers = (styles) => {
	const nested = {};
	for (const [key, value] of Object.entries(styles)) {
		if (key.startsWith('@layer ')) {
			moveLayerRules(nested, value, [key]);
			continue;
		}
		appendRule(nested, key, value);
	}
	return nested;
};
