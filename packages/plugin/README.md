# @anti049/lunar-ui-plugin

A proof of concept, not a shipping package. It compiles lunar-ui's CSS into a
Tailwind JS plugin the way DaisyUI does, for `badge` and `button` only, so the
approach can be judged on evidence instead of argument.

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
	exclude: badge;
}
```

## Result

The port is faithful. `test/e2e.test.js` compiles badge and button twice from
the same source — once through `@import` (today's path), once through
`@plugin` — and compares them:

```
parity
  present in both:        85
  missing from plugin:    0
  extra in plugin:        0 (+7 redundant :is()/:where() wrappers, same matches)
  benign (var fallback folding): 1
  benign (regrouped superset):   6
  real declaration conflicts:    0

standalone (@plugin only, no @import of lunar-ui)
  ok   emits the same component rules as the plugin-with-context build
  ok   no var() reference left dangling
  ok   carries the theme token chain
  ok   carries color-scheme for light-dark()
  ok   registers theme colors as utilities

prefix
  ok   renames library classes
  ok   renames component-local vars
  ok   leaves Tailwind/theme vars alone
  ok   leaves consumer state hooks alone
  ok   no unprefixed library class survives
```

"No var() reference left dangling" is the load-bearing standalone assertion: it
collects every `var(--x)` used without a fallback and fails if nothing declares
`--x`. Verified against a real external SvelteKit app too — 187 declared, 164
referenced, 0 dangling.

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

The closure splits two ways:

- `--color-*` from `@theme` → `theme.extend.colors`, so Tailwind also generates
  `bg-primary`, `text-on-surface` and friends for the consumer.
- everything else → plain custom properties via `addBase`, which is all the
  components need in order to render. `color-scheme` declarations come along
  unconditionally, since `light-dark()` is inert without them.

For badge and button that works out to 176 variables in the closure → 38 theme
colors and 424 base declarations across 12 selectors.

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

1. **Enumerate** every class each component defines — `@utility` blocks plus
   plain selectors in the component's own namespace (`build/extract-classes.js`).
2. **Compile once** with `src/context.css` (theme, tokens, foundations) plus the
   component files, feeding the class list back as `@source inline(…)`.
   `@utility` output is emitted on demand, so without that safelist the compile
   returns nothing.
3. **Partition** the output by lunar-ui's naming discipline — `@layer <name>.l<n>`
   and `<name>-*` keyframes attribute to a component; everything else is context
   and dropped (`build/partition.js`).
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

This POC covers 2 of ~130 components. Beyond scaling that up:

- **Non-color theme namespaces.** Only `--color-*` is registered as a Tailwind
  theme key. `--text-*`, `--radius-*`, `--ease-*` and the rest ship as plain
  custom properties, which is enough for the components to render but means a
  consumer gets no `text-caption-small-emphasized` utility of their own. Mapping
  those onto JS theme keys (`fontSize`, `borderRadius`,
  `transitionTimingFunction`, …) is a per-namespace translation table.
- **Theme switching.** Only the tokens badge and button actually reach are
  carried, so alternate themes (catppuccin, dracula) come along only where they
  intersect that closure. Shipping a theme the components don't fully touch
  needs its own seed set.
- **`@custom-variant` → `addVariant`.** Hand-ported here; `CUSTOM_VARIANTS` in
  `build/build.js` carries the one `button.css` defines.
- **Functional utilities.** `@utility name-*` can't be safelisted by name and is
  skipped with a warning. Neither badge nor button uses one; other components do.
- **Usage gating.** Plain-selector rules are unconditional today but become
  usage-gated through `addUtilities`, which breaks consumers building class
  names dynamically.
- **`@tailwindcss/forms` / `typography`.** Composable from inside a plugin
  (`forms({}).handler(api)`), but not wired up here.
