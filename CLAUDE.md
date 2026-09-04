# lunar-ui

Bun-workspace monorepo. A Tailwind CSS v4 design system, its Svelte bindings,
and a docs site.

| workspace | package | notes |
| --- | --- | --- |
| `packages/core` | `@anti049/lunar-ui` | framework-agnostic CSS. **No build step** |
| `packages/svelte` | `@anti049/lunar-ui-svelte` | Svelte 5 components, built by `svelte-package` |
| `packages/plugin` | `@anti049/lunar-ui-plugin` | the same CSS compiled to a Tailwind JS plugin. Private |
| `apps/docs` | `@anti049/lunar-ui-docs` | SvelteKit site. Private |

## Commands

Bun workspaces — not npm or pnpm.

```sh
bun run check                                      # every workspace
bun run --filter '@anti049/lunar-ui-plugin' check  # build + typecheck + e2e
bun run dev                                        # docs site
```

## Things that will bite

**`packages/core` has no build step.** It ships raw CSS, deliberately: Tailwind
v4 must process `@plugin`, `@theme` and `@layer` in the consumer's own build, so
precompiling it would break it. Don't add a bundler.

**Never hand-edit generated files.** `packages/plugin/src/generated/**` is
written by `bun build/build.ts`; `packages/plugin/dist/**` is `tsc` output. Both
are gitignored. Change the generator or the CSS source instead.

**Run the plugin's check after touching `packages/core` CSS.** The plugin is
compiled from those same files, and `packages/plugin/test/e2e.test.ts` compiles
every component twice — once via `@import`, once via `@plugin` — and compares.
It is the guard against the two paths drifting, and it has caught real bugs in
the CSS itself.

**`bun run lint` already fails, on essentially every file.** The repo is CRLF throughout and
Prettier defaults to `endOfLine: "lf"`. Pre-existing, unrelated to any change
you make. Do **not** "fix" it by running `prettier --write .` — that rewrites the
whole repo and buries the real diff. If it needs fixing, that is its own commit.

**The Bash tool mangles heredocs containing backticks or backslashes.** It has
silently eaten template literals and dropped `\\`, producing things like
`collisions.push()` with no argument. Use Write/Edit for any file containing
backticks, escapes or `${}`.

## CSS authoring convention

Components are authored as Tailwind v4 utilities with a three-level cascade
layer, and the plugin's build depends on this shape:

```css
@utility badge {
	@layer badge.l3 {   /* l3 foundation, l2 variant/size/colour, l1 state */
		@apply inline-flex items-center rounded-sm;
	}
}
```

Layer names do not always match file names (`collapsible.css` emits into
`@layer collapse.lN`), which the build handles — but keep new components
consistent.

## More

`docs/handoff.md` has the deeper context: verified Tailwind v4 behaviour that
cost real experiments to establish, the plugin's architecture and why generated
data is emitted as `.ts`, known divergences, and the open work to take the
plugin from proof-of-concept to shipping. Read it before changing the plugin.
