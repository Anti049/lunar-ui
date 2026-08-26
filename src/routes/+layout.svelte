<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { MaskedImage, Scaffold, ThemedSVG, initRipple } from '$lib/svelte';
	import { Moon, PanelLeftClose, PanelLeftOpen, Sun, SunMoon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { cn } from '$lib/utils';
	import { ModeWatcher, userPrefersMode as mode, setMode } from 'mode-watcher';
	import { componentLinks, isDisabled } from '$lib/utils';

	const { children } = $props();

	const moonColors = {
		'#cdd6f4': 'fill-on-surface',
		'#7f849c': 'stroke-on-surface-variant',
		'#313244': 'fill-surface-container-high'
	};
	let minimized = $state(false);
	function cycleMode() {
		console.log(mode.current);
		if (mode.current === 'light') {
			setMode('dark');
		} else if (mode.current === 'dark') {
			setMode('system');
		} else {
			setMode('light');
		}
		console.log(mode.current);
	}

	onMount(() => initRipple());
</script>

<ModeWatcher defaultTheme="default" darkClassNames={['dark']} lightClassNames={['light']} />

<Scaffold {minimized}>
	{#snippet header()}
		<!-- Desktop Header -->
		<!-- <div class="hidden compact:flex w-full h-20 surface-container items-center justify-between p-4">
			<button
				class="button button-text button-square button-md swap swap-rotate"
				onclick={() => (test = !test)}
			>
				<input type="checkbox" bind:checked={test} />
				<PanelLeftClose class="swap-off" />
				<PanelLeftOpen class="swap-on" />
			</button>
		</div> -->
		<!-- Mobile Header -->
		<!-- <div class="flex compact:hidden w-full h-16 p-2 items-center justify-between">
			<button
				class="button button-text button-square button-md swap swap-rotate"
				onclick={() => (minimized = !minimized)}
			>
				<input type="checkbox" bind:checked={minimized} />
				<Menu class="swap-off" />
				<X class="swap-on" />
			</button>
		</div> -->
		<div class="appbar appbar-centered">
			<div class="appbar-leading">
				<button
					class="button swap button-square button-md button-text"
					onclick={() => (minimized = !minimized)}
				>
					<input type="checkbox" bind:checked={minimized} />
					<PanelLeftClose class="swap-off" />
					<PanelLeftOpen class="swap-on" />
				</button>
			</div>
			<div class="appbar-body">
				<ThemedSVG
					src="/moon_monochrome.svg"
					replacements={moonColors}
					class="aspect-square h-full appbar-title"
					ariaLabel="Logo"
				/>
			</div>
			<div class="appbar-trailing">
				<button class="button button-square button-md button-text" onclick={cycleMode}>
					{#if mode.current === 'light'}
						<Sun />
					{:else if mode.current === 'dark'}
						<Moon />
					{:else}
						<SunMoon />
					{/if}
				</button>
			</div>
		</div>
	{/snippet}

	{#snippet sidebar()}
		<nav class="nav-rail w-64 gap-2 border-r border-r-surface-container p-2 collapsed:w-16">
			<a
				href={resolve('/')}
				class="nav-link"
				data-active={page.url.pathname === '/' ? '' : undefined}
			>
				<MaskedImage src="/icons/navigation/house.svg" alt="Home" class="nav-link-icon" />
				<span class="nav-link-label">Home</span>
			</a>
			<div class="h-0.5 w-full rounded-full surface-container"></div>
			<div
				class="flex h-full w-full flex-1 scrollbar-hidden flex-col gap-2 overflow-x-clip overflow-y-auto"
			>
				{#each componentLinks as link (link.href)}
					<a
						href={link.href}
						class={cn('nav-link nav-link-small', isDisabled(link) && 'disabled')}
						data-active={page.url.pathname === link.href ? '' : undefined}
					>
						{#if link.icon}
							<MaskedImage src={link.icon} alt={link.label} class="nav-link-icon" />
						{/if}
						<span class="nav-link-label">{link.label}</span>
					</a>
				{/each}
			</div>
			<div class="h-0.5 w-full rounded-full surface-container"></div>
			<a
				href={resolve('/test')}
				class="nav-link"
				data-active={page.url.pathname === '/test' ? '' : undefined}
			>
				<MaskedImage
					src="/icons/navigation/test-tube-diagonal.svg"
					alt="Test"
					class="nav-link-icon"
				/>
				<span class="nav-link-label">Test</span>
			</a>
			<a
				href={resolve('/settings')}
				class="nav-link"
				data-active={page.url.pathname === '/settings' ? '' : undefined}
			>
				<MaskedImage src="/icons/navigation/settings.svg" alt="Settings" class="nav-link-icon" />
				<span class="nav-link-label">Settings</span>
			</a>
		</nav>
	{/snippet}

	{@render children()}
</Scaffold>
