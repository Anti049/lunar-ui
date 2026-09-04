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
bun run --filter '@anti049/lunar-ui-plugin' build   # CSS -> generated TS -> dist
bun run --filter '@anti049/lunar-ui-plugin' check   # build + typecheck + compare vs CSS-first
```

It is **standalone** — no lunar-ui CSS import, and `@anti049/lunar-ui` need not
even be installed. Consumers write:

```css
@import 'tailwindcss';
@plugin '@anti049/lunar-ui-plugin' {
	prefix: lunar-;
	exclude: badge;      /* or: foundations */
	themes: dracula;     /* optional; omit for all */
}
```

## Result

The port is faithful. `test/e2e.test.ts` compiles all three bundles twice from
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

themes
  ok   `themes` keeps the requested theme
  ok   `themes` drops the rest
  ok   `default` is always kept, since others inherit from it
  ok   seed generates a full tone scale
  ok   variant changes the generated palette
  ok   hand-declared roles beat the generated ones
  ok   role-only themes need no seed
  ok   `default: true` also applies at :root
  ok   rejects unknown theme
  ok   rejects unknown variant
  ok   rejects theme with no name

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
`build/collect-tokens.ts` walks it from the compiled component output.

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

### Choosing which themes ship

All four shipped palettes are included by default. `themes` narrows that:

```css
@plugin '@anti049/lunar-ui-plugin' {
	themes: dracula, gaziter;
}
```

`default` is always added regardless. It sits at `:where(:root)` with zero
specificity and supplies the tone steps every other theme falls back to for
roles it does not set, so dropping it would leave the others with unresolved
colours. Naming a theme that does not exist is an error listing the ones that do.

### Custom themes

Tailwind hands option bodies over as flat scalars — no nested objects — so each
custom theme is its own `@plugin` call against the `/theme` entry point. Two
ways to supply colours, and they compose.

**From a seed**, generating the full 10-palette × 30-tone scale the way `default`
and `gaziter` are built:

```css
@plugin '@anti049/lunar-ui-plugin/theme' {
	name: brand;
	seed: #b5179e;
	variant: vibrant;   /* optional */
	contrast: 0.3;      /* optional, -1 to 1 */
	default: true;      /* optional, also apply at :root */
	success: #2e7d32;   /* optional status-palette seeds */
}
```

Variants: `vibrant` (default), `tonalspot`, `content`, `expressive`, `fidelity`,
`fruitsalad`, `monochrome`, `neutral`, `rainbow`. Matching ignores case, spaces
and dashes, so `tonal spot` and `tonal-spot` both work.

`vibrant` is the default because it lands closest to the shipped themes — for
the default theme's `#0956AA` seed it produces `#005db9` against the committed
`#0058ca`. **Near, not identical**: the originals came from a different
generator, so a regenerated theme will not be byte-for-byte equal to the one
in `packages/core`.

Material's schemes only cover primary, secondary, tertiary, neutral,
neutral-variant and error. lunar-ui's four status palettes get their own seeds,
defaulting to the shipped default theme's own tone-40 values so an unconfigured
generated theme keeps lunar-ui's status colours.

**By hand**, declaring semantic roles the way `catppuccin` and `dracula` are
authored:

```css
@plugin '@anti049/lunar-ui-plugin/theme' {
	name: nightfall;
	color-scheme: dark;
	--theme-color-primary: #8be9fd;
	--theme-color-on-primary: #10121b;
	--theme-color-surface: #10121b;
	--theme-color-on-surface: #e6e8f0;
}
```

Both forms may be combined — generate from a seed, then override individual
roles. **Hand-declared values always win.** Anything a custom theme leaves unset
falls back to the default theme, so a partial theme is valid.

Generation runs in the consumer's build, which is why
`@material/material-color-utilities` is a real dependency of this package. Note
it ships broken ESM (extensionless relative imports that Node's resolver
rejects); it works here because Tailwind bundles plugins before loading them.
Verified under both the Tailwind CLI and `@tailwindcss/vite`.

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

Everything is TypeScript. `build/*.ts` runs directly under bun — no compile
step — and writes `src/generated/*.ts`; `tsc` then compiles the hand-written
runtime and the generated data together into `dist/` as JS plus `.d.ts`.

Generating `.ts` rather than `.js` is what makes the runtime type-safe: the
hand-written `src/index.ts` imports `./generated/registry.js`, `theme.js` and
the rest, so `tsc` checks it against the real shape of what the build produced
rather than against `any`.

```sh
bun build/build.ts              # CSS -> src/generated/*.ts
tsc -p tsconfig.build.json      # src/**/*.ts -> dist (JS + .d.ts)
```

`build/build.ts`:

1. **Enumerate** every class each bundle defines — `@utility` blocks plus plain
   selectors in the bundle's own namespace. Foundations are not namespaced, so
   they pass `namespace: null` and accept any non-state-hook class
   (`build/extract-classes.ts`).
2. **Compile once** with `src/context.css` (theme, tokens, foundations) plus the
   component files, feeding the class list back as `@source inline(…)`.
   `@utility` output is emitted on demand, so without that safelist the compile
   returns nothing.
3. **Partition** the output by lunar-ui's naming discipline — `@layer <name>.l<n>`
   and `<name>-*` keyframes attribute to a component. Foundations carry no layer
   marker (`@utility surface` lands as a bare `.surface`), so they are attributed
   by class name. Everything else is context and dropped (`build/partition.ts`).
4. **Serialize** to JS objects with postcss-js, into two buckets per component:
   `utilities` (from `@utility`) and `standalone` (from plain selectors).
5. **Emit** `src/generated/components/<name>/{object,index}.ts`, plus a
   `registry.ts` of owned names, `theme.ts`, `base.ts` and a `properties.ts` of
   `@property` registrations.

At runtime, `functions/nestCssLayers.ts` inverts `{'@layer x': {'.a': …}}` into
`{'.a': {'@layer x': …}}`, because `addUtilities` rejects an at-rule as a
top-level key. `functions/addPrefix.ts` then renames what the registry says
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
denylist — see `STATE_HOOKS` in `build/extract-classes.ts`.

## What a real port would still need

This POC covers the foundations layer and 2 of ~130 components. Beyond scaling
that up:

- **`@custom-variant` → `addVariant`.** Hand-ported here; `CUSTOM_VARIANTS` in
  `build/build.ts` carries the one `button.css` defines. Automating it means
  translating `@slot` nesting into a variant selector.
- **Namespace table upkeep.** `THEME_NAMESPACES` in `build/collect-tokens.ts`
  is hand-maintained. A namespace Tailwind adds, or one lunar-ui invents that
  isn't in the table, silently falls through to a plain custom property — the
  components still render, but consumers get no utility for it.
- **The CssInJs boundary.** postcss-js emits numeric CSS values as JS numbers
  (`opacity: 0`), which Tailwind's own `CssInJs` type does not model. The
  conversion is safe -- Tailwind stringifies them -- and is confined to one cast
  in `src/index.ts`. TypeScript found this; the JS version shipped it unnoticed.
- **JS-coupled class names.** `JS_COUPLED` in `build/extract-classes.ts` lists
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
