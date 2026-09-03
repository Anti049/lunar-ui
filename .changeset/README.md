# Changesets

Run `bun run changeset` to describe a change, then commit the generated file.
The release workflow opens a version PR; merging it publishes to npm.

`@anti049/lunar-ui` and `@anti049/lunar-ui-svelte` are versioned in lockstep
(`fixed` in config.json), so a bump to either releases both. `@anti049/lunar-ui-docs`
is private and never published.
