<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { ResolvedPathname } from '$app/types';
	import { cn, componentLinks, isDisabled } from '$lib/utils';
	import MaskedImage from './MaskedImage.svelte';

	// Fired when a link is activated, so hosts (e.g. the mobile menu) can react.
	let { onnavigate }: { onnavigate?: (event: MouseEvent, href: ResolvedPathname) => void } =
		$props();
</script>

<div class="tooltip tooltip-center tooltip-right" data-tooltip="Home">
	<a
		href={resolve('/')}
		class="nav-link"
		data-active={page.url.pathname === '/' ? '' : undefined}
		onclick={(e) => onnavigate?.(e, resolve('/'))}
	>
		<MaskedImage src="/icons/navigation/house.svg" alt="Home" class="nav-link-icon" />
		<span class="nav-link-label">Home</span>
	</a>
</div>
<div class="h-0.5 w-full rounded-full surface-container"></div>
<div class="flex w-full flex-1 scrollbar-hidden flex-col gap-2 overflow-x-clip overflow-y-auto">
	{#each componentLinks as link (link.href)}
		<div class="tooltip tooltip-center tooltip-right" data-tooltip={link.label}>
			<a
				href={link.href}
				class={cn('nav-link nav-link-small', isDisabled(link) && 'disabled')}
				data-active={page.url.pathname === link.href ? '' : undefined}
				onclick={(e) => onnavigate?.(e, link.href)}
			>
				{#if link.icon}
					<MaskedImage src={link.icon} alt={link.label} class="nav-link-icon" />
				{/if}
				<span class="nav-link-label">{link.label}</span>
			</a>
		</div>
	{/each}
</div>
<div class="h-0.5 w-full rounded-full surface-container"></div>
<div class="tooltip tooltip-center tooltip-right" data-tooltip="">
	<a
		href={resolve('/test')}
		class="nav-link"
		data-active={page.url.pathname === '/test' ? '' : undefined}
		onclick={(e) => onnavigate?.(e, resolve('/test'))}
	>
		<MaskedImage src="/icons/navigation/test-tube-diagonal.svg" alt="Test" class="nav-link-icon" />
		<span class="nav-link-label">Test</span>
	</a>
</div>
<div class="tooltip tooltip-center tooltip-right" data-tooltip="Settings">
	<a
		href={resolve('/settings')}
		class="nav-link"
		data-active={page.url.pathname === '/settings' ? '' : undefined}
		onclick={(e) => onnavigate?.(e, resolve('/settings'))}
	>
		<MaskedImage src="/icons/navigation/settings.svg" alt="Settings" class="nav-link-icon" />
		<span class="nav-link-label">Settings</span>
	</a>
</div>
