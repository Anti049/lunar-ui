---
'@anti049/lunar-ui': minor
'@anti049/lunar-ui-svelte': minor
---

Split lunar-ui into two packages.

`@anti049/lunar-ui` is now the framework-agnostic CSS layer only — Tailwind v4
styles, design tokens, foundations, and themes, shipped as raw CSS. Its previous
`.` export (Svelte components) has moved to the new `@anti049/lunar-ui-svelte`
package.

Other changes:

- Font faces are no longer part of the main CSS entry. Import
  `@anti049/lunar-ui/fonts.css` and install the `@fontsource-variable` packages
  to keep them.
- `@tailwindcss/forms` and `@tailwindcss/typography` are now real dependencies
  rather than devDependencies, so `core/plugins.css` resolves for consumers.
- Components that depend on SvelteKit (`NavBar`, `NavLinks`, `CodeBlock`) or on
  the docs site's own route list are no longer published; they live in the docs
  app. The library no longer pulls in codemirror, shiki, prettier, or lucide.
- Svelte consumers should import `@anti049/lunar-ui-svelte/styles.css` so
  utility classes used inside the components are not tree-shaken away.
