# @anti049/lunar-ui

Framework-agnostic component styles, design tokens, and themes for Tailwind CSS v4.

This package ships **raw CSS, not a build artifact** — Tailwind v4 needs to process
`@plugin`, `@theme`, and `@layer` inside your own build, so there is nothing to compile.

## Install

```sh
npm install @anti049/lunar-ui
```

`tailwindcss` v4 is a peer dependency. `@tailwindcss/forms` and
`@tailwindcss/typography` come along as regular dependencies, because
`core/plugins.css` registers them for you.

## Use

```css
@import 'tailwindcss';
@import '@anti049/lunar-ui';
```

That gives you the color system, design tokens, cascade layers, foundations
(elevation, motion, ripple, state layers, typography), every component style,
and the bundled themes.

### Fonts (opt-in)

Font faces are deliberately not part of the main entry, so you are not forced to
download three families you may not want:

```sh
npm install @fontsource-variable/plus-jakarta-sans @fontsource-variable/inter @fontsource-variable/fira-code
```

```css
@import '@anti049/lunar-ui/fonts.css';
```

### Themes

All themes are included in the main entry. Individual themes are also addressable:

```css
@import '@anti049/lunar-ui/themes/catppuccin/mocha.css';
```

## Using it with Svelte

[`@anti049/lunar-ui-svelte`](../svelte) wraps these styles in Svelte 5 components.
