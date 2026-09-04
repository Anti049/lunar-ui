# @anti049/lunar-ui-plugin

A proof of concept, not a shipping package. It compiles lunar-ui's CSS into a
Tailwind JS plugin the way DaisyUI does — the `foundations` layer plus `badge`
and `button` — so the approach can be judged on evidence instead of argument.

Three bundles ship, each excludable by name:

- **`foundations`** — the 59 non-namespaced utilities: colour roles (`surface`,
  `primary`, `inverse-error-container`), `elevation-0`…`elevation-5`,
  `focusable`, `interactive`, `scrim`, `touch-target`. Composite utilities keep
  both halves, so `surface` still sets `background-color` *and* `color`.
- **`badge`**, **`button`** — the two components.

```sh
bun run --filter '@anti049/lunar-ui-plugin' build   # compile CSS -> JS
bun run --filter '@anti049/lunar-ui-plugin' test    # compare against the CSS-first build
```

It is **standalone** — no lunar-ui CSS import, and `@anti049/lunar-ui` need not
even be installed. Consumers write:

```css
@import 'tailwindcss';
@plugin '@anti049/lunar-ui-plugin' {
	prefix: lunar-;
	exclude: badge;   /* or: foundations */
}
```

## Result

The port is faithful. `test/e2e.test.js` compiles all three bundles twice from
the same source — once through `@import` (today's path), once through
`@plugin` — and compares them:

```
parity
  present in both:        146
  missing from plugin:    0
  extra in plugin:        0 (+7 redundant :is()/:where() wrappers, same matches)
  benign (inlined var fallback):  41
  benign (var fallback folding): 1
  benign (regrouped superset):   6
  real declaration conflicts:    0

standalone (@plugin only, no @import of lunar-ui)
  ok   emits the same component rules as the plugin-with-context build
  ok   no var() reference left dangling
  ok   carries the theme token chain
  ok   carries color-scheme for light-dark()
  ok   registers theme colors as utilities
  ok   every shipped theme resolves (9 selectors)
  ok   ships the foundation utilities (59 classes)
  ok   composite utilities carry both halves (surface = bg + text)
  ok   JS-coupled class keeps its name under a prefix
  ok   registers non-color namespaces too

prefix
  ok   renames library classes
  ok   renames component-local vars
  ok   leaves Tailwind/theme vars alone
  ok   leaves consumer state hooks alone
  ok   no unprefixed library class survives
```

"No var() reference left dangling" is the load-bearing standalone assertion: it
collects every `var(--x)` used without a fallback and fails if nothing declares
`--x`. Verified against a real external SvelteKit app too, with the CSS package not
installed at all — 203 declared, 0 dangling, and lunar-ui
utilities (text-display-small, bg-primary) generated from the plugin theme.

The benign buckets are real differences that don't change rendering, and the
test classifies rather than hides them:

- **fallback folding** — Tailwind collapses `var(--tw-duration, …)` to `200ms`
  in its own utility output but passes plugin-supplied declarations through as
  authored. The variable is set in the same rule, so both compute identically.
- **regrouped superset** — Tailwind re-groups selector lists when re-emitting,
  so a plugin rule can carry declarations the CSS-first build reached through a
  different grouping.
- **redundant wrappers** — `:is(:is(x), y)` and a trailing `:where(.selected)`
  on rules already carrying `.selected`. `:where()` adds no specificity and
  `:is()` takes its most specific argument, so matching is unchanged.

## Standalone tokens

The components reference `--color-primary`, which resolves to
`--theme-color-primary`, which resolves to `--theme-color-primary-40`, which is
finally a hex literal. Carrying that means a transitive closure, not a filter —
`build/collect-tokens.js` walks it from the compiled component output.

Tokens are read from **source**, not from a compile: `@theme` values are emitted
on demand, so compiling the context in isolation would only reveal whichever
tokens something happened to use.

Every `@theme` value lunar-ui defines is registered through `theme.extend` —
not merely the ones badge and button reach — across all the namespaces it uses,
mapped onto the JS theme keys a plugin config accepts:

| CSS namespace | JS theme key | | CSS namespace | JS theme key |
| --- | --- | --- | --- | --- |
| `--color-*` | `colors` | | `--ease-*` | `transitionTimingFunction` |
| `--text-*` | `fontSize` | | `--duration-*` | `transitionDuration` |
| `--font-*` | `fontFamily` | | `--opacity-*` | `opacity` |
| `--breakpoint-*` | `screens` | | `--animation-*` | `animation` |

So consumers get real utilities — `text-display-small`, `duration-medium-2`,
`bg-primary` — not just bare custom properties. `--text-x--line-height` and its
siblings fold back into the `fontSize` tuple form Tailwind expects. For badge
and button that is 418 theme entries across 8 namespaces.

Registration alone is not enough for the components themselves, though: **a
theme entry only materialises as CSS when a utility uses it**, and compiled
component CSS references it straight from `var()`, which Tailwind does not
track. Re-emitting those tokens through `addBase` would land them in
`@layer base` and shadow any override a consumer makes in their own `@theme`.
So the default is inlined as a `var()` fallback instead —
`var(--ease-standard, cubic-bezier(0.2, 0, 0, 1))`. An override still wins when
present; the components still render when it is not.

Tokens outside every namespace (`--default-transition-*`, the `--theme-color-*`
palette) are emitted as plain custom properties via `addBase`, along with
`color-scheme`, since `light-dark()` is inert without it — 484 declarations
across 12 selectors.

### Theme switching

All nine theme selectors ship, and every semantic token the components read
resolves under each. The two theme families define tokens at different levels
and both work:

- **default, gaziter** declare tone steps (`--theme-color-primary-40`), which
  the mode layer maps to semantics via `light-dark()`.
- **catppuccin, dracula** override the semantics (`--theme-color-primary`)
  directly, and inherit anything they do not set from the default theme, which
  sits at `:where(:root)` — zero specificity, so it always underlies whatever a
  `[data-theme]` selector sets.

Theme values are deliberately **not** prefixed. They occupy shared Tailwind
namespaces, so `--color-primary` stays `--color-primary` whatever `prefix` is
set to; only lunar-ui's own component classes and locals get renamed.

## Known divergence: cascade position

**24 selectors change layer**, and this one is real:

```
.badge-disabled
  CSS-first: badge.l1
  plugin:    utilities > badge.l1
```

Rules authored as plain selectors (`.badge-disabled { @layer badge.l1 { … } }`)
are emitted by Tailwind into a **top-level** layer. Top-level layers that aren't
in the `@layer theme, base, components, utilities` list sort *after* all of
them, so those rules currently outrank every utility.

The plugin API has no channel that lands there — `addBase` means `@layer base`,
`addUtilities` means `@layer utilities`. So they move inside `utilities`, where
unlayered content in that layer now beats them. Concretely: `.badge-disabled`
stops overriding `bg-*` utilities.

Rules from `@utility` are unaffected: they were already inside
`@layer utilities` and stay there.

Worth noting the CSS-first build has an oddity here too. `core/layers.css`
declares the sublayer order inside `@layer components`, but the rules land under
`@layer utilities` and at the top level — different layer trees, so that
ordering declaration appears to have no effect on either path.

## How the build works

`build/build.js`:

1. **Enumerate** every class each bundle defines — `@utility` blocks plus plain
   selectors in the bundle's own namespace. Foundations are not namespaced, so
   they pass `namespace: null` and accept any non-state-hook class
   (`build/extract-classes.js`).
2. **Compile once** with `src/context.css` (theme, tokens, foundations) plus the
   component files, feeding the class list back as `@source inline(…)`.
   `@utility` output is emitted on demand, so without that safelist the compile
   returns nothing.
3. **Partition** the output by lunar-ui's naming discipline — `@layer <name>.l<n>`
   and `<name>-*` keyframes attribute to a component. Foundations carry no layer
   marker (`@utility surface` lands as a bare `.surface`), so they are attributed
   by class name. Everything else is context and dropped (`build/partition.js`).
4. **Serialize** to JS objects with postcss-js, into two buckets per component:
   `utilities` (from `@utility`) and `standalone` (from plain selectors).
5. **Emit** `dist/components/<name>/{object,index}.js`, plus a `registry.js` of
   owned names and a `properties.js` of `@property` registrations.

At runtime, `functions/nestCssLayers.js` inverts `{'@layer x': {'.a': …}}` into
`{'.a': {'@layer x': …}}`, because `addUtilities` rejects an at-rule as a
top-level key. `functions/addPrefix.js` then renames what the registry says
lunar-ui owns.

## Where this differs from DaisyUI

DaisyUI prefixes every class it encounters and keeps a **denylist** of
exceptions (`color-`, `size-`, `radius-`, `prose`, `is-disabled`, …). This uses
an **allowlist** generated at build time from the sources instead, so Tailwind
theme variables, consumer state hooks, and third-party classes are left alone by
construction rather than by remembering to exclude them.

That inversion removes most of the prefixer's risk, but not all: generic state
hooks (`.disabled`, `.selected`, `.active`, …) appear in lunar-ui's own
selectors while belonging to consumer markup, so they still need an explicit
denylist — see `STATE_HOOKS` in `build/extract-classes.js`.

## What a real port would still need

This POC covers the foundations layer and 2 of ~130 components. Beyond scaling
that up:

- **`@custom-variant` → `addVariant`.** Hand-ported here; `CUSTOM_VARIANTS` in
  `build/build.js` carries the one `button.css` defines. Automating it means
  translating `@slot` nesting into a variant selector.
- **Namespace table upkeep.** `THEME_NAMESPACES` in `build/collect-tokens.js`
  is hand-maintained. A namespace Tailwind adds, or one lunar-ui invents that
  isn't in the table, silently falls through to a plain custom property — the
  components still render, but consumers get no utility for it.
- **JS-coupled class names.** `JS_COUPLED` in `build/extract-classes.js` lists
  classes also written in JavaScript -- currently just `lunar-ripple`, created by
  the ripple action. Prefixing those would leave the action pointing at a class
  that no longer exists, so they ship unrenamed. The list is hand-maintained; a
  new action that writes a class name needs adding to it.
- **Functional utilities.** `@utility name-*` can't be safelisted by name and is
  skipped with a warning. Neither badge nor button uses one; other components do.
- **Usage gating.** Plain-selector rules are unconditional today but become
  usage-gated through `addUtilities`, which breaks consumers building class
  names dynamically.
- **`@tailwindcss/forms` / `typography`.** Composable from inside a plugin
  (`forms({}).handler(api)`), but not wired up here.
