<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { MaskedImage, Scaffold } from '$lib/svelte';
	import { PanelLeftClose, PanelLeftOpen, Search } from '@lucide/svelte';
	import '../app.css';
	import { cn } from '$lib/utils';

	const { children } = $props();

	let minimized = $state(false);
	let links = [
		{
			href: resolve('/components/3d-block'),
			label: '3D Block',
			icon: '/icons/navigation/box.svg',
			disabled: true
		},
		{
			href: resolve('/components/accordion'),
			label: 'Accordion',
			icon: '/icons/navigation/list-chevrons-up-down.svg',
			disabled: true
		},
		{
			href: resolve('/components/appbar'),
			label: 'App Bar',
			icon: '/icons/navigation/panel-top.svg'
		},
		{
			href: resolve('/components/aura'),
			label: 'Aura',
			icon: '/icons/navigation/flame.svg',
			disabled: true
		},
		{
			href: resolve('/components/badge'),
			label: 'Badge',
			icon: '/icons/navigation/circle-star.svg',
			disabled: true
		},
		{
			href: resolve('/components/breadcrumbs'),
			label: 'Breadcrumbs',
			icon: '/icons/navigation/route.svg',
			disabled: true
		},
		{
			href: resolve('/components/button'),
			label: 'Button',
			icon: '/icons/navigation/square-plus.svg'
		},
		{
			href: resolve('/components/calendar'),
			label: 'Calendar',
			icon: '/icons/navigation/calendar-days.svg',
			disabled: true
		},
		{
			href: resolve('/components/card'),
			label: 'Card',
			icon: '/icons/navigation/id-card.svg',
			disabled: true
		},
		{
			href: resolve('/components/carousel'),
			label: 'Carousel',
			icon: '/icons/navigation/gallery-horizontal.svg',
			disabled: true
		},
		{
			href: resolve('/components/chat'),
			label: 'Chat',
			icon: '/icons/navigation/messages-square.svg',
			disabled: true
		},
		{
			href: resolve('/components/checkbox'),
			label: 'Checkbox',
			icon: '/icons/navigation/square-check.svg'
		},
		{
			href: resolve('/components/collapse'),
			label: 'Collapse',
			icon: '/icons/navigation/fold-vertical.svg',
			disabled: true
		},
		{
			href: resolve('/components/context-menu'),
			label: 'Context Menu',
			icon: '/icons/navigation/mouse-right.svg',
			disabled: true
		},
		{
			href: resolve('/components/countdown'),
			label: 'Countdown',
			icon: '/icons/navigation/clock-fading.svg',
			disabled: true
		},
		{
			href: resolve('/components/diff'),
			label: 'Diff',
			icon: '/icons/navigation/columns-2.svg',
			disabled: true
		},
		{
			href: resolve('/components/divider'),
			label: 'Divider',
			icon: '/icons/navigation/square-split-vertical.svg'
		},
		{
			href: resolve('/components/drawer'),
			label: 'Drawer',
			icon: '/icons/navigation/panel-left-close.svg',
			disabled: true
		},
		{
			href: resolve('/components/dropdown'),
			label: 'Dropdown',
			icon: '/icons/navigation/chevron-down.svg',
			disabled: true
		},
		{
			href: resolve('/components/fab'),
			label: 'FAB',
			icon: '/icons/navigation/circle-plus.svg',
			disabled: true
		},
		{
			href: resolve('/components/helper'),
			label: 'Helper',
			icon: '/icons/navigation/circle-question-mark.svg',
			disabled: true
		},
		{
			href: resolve('/components/hover-3d'),
			label: 'Hover 3D',
			icon: '/icons/navigation/rotate-3d.svg',
			disabled: true
		},
		{
			href: resolve('/components/indicator'),
			label: 'Indicator',
			icon: '/icons/navigation/rss.svg',
			disabled: true
		},
		{
			href: resolve('/components/input'),
			label: 'Input',
			icon: '/icons/navigation/rectangle-ellipsis.svg',
			disabled: true
		},
		{
			href: resolve('/components/join'),
			label: 'Join',
			icon: '/icons/navigation/columns-3.svg',
			disabled: true
		},
		{
			href: resolve('/components/kbd'),
			label: 'KBD',
			icon: '/icons/navigation/keyboard.svg',
			disabled: true
		},
		{
			href: resolve('/components/label'),
			label: 'Label',
			icon: '/icons/navigation/tag.svg',
			disabled: true
		},
		{
			href: resolve('/components/loading'),
			label: 'Loading',
			icon: '/icons/navigation/loader.svg',
			disabled: true
		},
		{
			href: resolve('/components/menu'),
			label: 'Menu',
			icon: '/icons/navigation/menu.svg',
			disabled: true
		},
		{
			href: resolve('/components/modal'),
			label: 'Modal',
			icon: '/icons/navigation/inspection-panel.svg',
			disabled: true
		},
		{
			href: resolve('/components/navigation'),
			label: 'Navigation',
			icon: '/icons/navigation/map-pin.svg'
		},
		{
			href: resolve('/components/pagination'),
			label: 'Pagination',
			icon: '/icons/navigation/gallery-thumbnails.svg',
			disabled: true
		},
		{
			href: resolve('/components/placeholder'),
			label: 'Placeholder',
			icon: '/icons/navigation/circle-ellipsis.svg',
			disabled: true
		},
		{
			href: resolve('/components/progress'),
			label: 'Progress',
			icon: '/icons/navigation/loader-circle.svg',
			disabled: true
		},
		{
			href: resolve('/components/radio'),
			label: 'Radio',
			icon: '/icons/navigation/circle-dot.svg'
		},
		{
			href: resolve('/components/scaffold'),
			label: 'Scaffold',
			icon: '/icons/navigation/panels-top-left.svg'
		},
		{
			href: resolve('/components/scrollbar'),
			label: 'Scrollbar',
			icon: '/icons/navigation/panel-right.svg'
		},
		{
			href: resolve('/components/section'),
			label: 'Section',
			icon: '/icons/navigation/panel-top-open.svg',
			disabled: true
		},
		{
			href: resolve('/components/select'),
			label: 'Select',
			icon: '/icons/navigation/between-horizontal-end.svg'
		},
		{
			href: resolve('/components/sidebar'),
			label: 'Sidebar',
			icon: '/icons/navigation/panel-left.svg',
			disabled: true
		},
		{
			href: resolve('/components/slider'),
			label: 'Slider',
			icon: '/icons/navigation/sliders-horizontal.svg',
			disabled: true
		},
		{
			href: resolve('/components/snackbar'),
			label: 'Snackbar',
			icon: '/icons/navigation/bell.svg',
			disabled: true
		},
		{
			href: resolve('/components/status'),
			label: 'Status',
			icon: '/icons/navigation/globe-check.svg',
			disabled: true
		},
		{
			href: resolve('/components/steps'),
			label: 'Steps',
			icon: '/icons/navigation/waypoints.svg',
			disabled: true
		},
		{
			href: resolve('/components/swap'),
			label: 'Swap',
			icon: '/icons/navigation/arrow-left-right.svg',
			disabled: true
		},
		{
			href: resolve('/components/switch'),
			label: 'Switch',
			icon: '/icons/navigation/toggle-right.svg',
			disabled: true
		},
		{
			href: resolve('/components/table'),
			label: 'Table',
			icon: '/icons/navigation/sheet.svg',
			disabled: true
		},
		{
			href: resolve('/components/tabs'),
			label: 'Tabs',
			icon: '/icons/navigation/notebook-tabs.svg',
			disabled: true
		},
		{
			href: resolve('/components/timeline'),
			label: 'Timeline',
			icon: '/icons/navigation/timeline.svg',
			disabled: true
		},
		{
			href: resolve('/components/titlebar'),
			label: 'Titlebar',
			icon: '/icons/navigation/app-window.svg',
			disabled: true
		},
		{
			href: resolve('/components/tooltip'),
			label: 'Tooltip',
			icon: '/icons/navigation/info.svg',
			disabled: true
		},
		{
			href: resolve('/components/tree'),
			label: 'Tree',
			icon: '/icons/navigation/list-tree.svg',
			disabled: true
		},
		{
			href: resolve('/components/tristate'),
			label: 'Tristate',
			icon: '/icons/navigation/square-minus.svg',
			disabled: true
		}
	];
</script>

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
				<p class="appbar-title">Title</p>
				<p class="appbar-subtitle">Subtitle</p>
			</div>
			<div class="appbar-trailing">
				<button class="button button-square button-md button-text">
					<Search />
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
				{#each links as link (link.href)}
					<a
						href={link.href}
						class={cn('nav-link nav-link-small', link.disabled && 'disabled')}
						data-active={page.url.pathname === link.href ? '' : undefined}
					>
						<MaskedImage src={link.icon} alt={link.label} class="nav-link-icon" />
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
