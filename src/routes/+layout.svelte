<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { MaskedImage, Scaffold } from '$lib/svelte';
	import { PanelLeftClose, PanelLeftOpen, Search } from '@lucide/svelte';
	import '../app.css';

	const { children } = $props();

	let minimized = $state(false);
	let links = [
		{
			href: resolve('/components/3d-block'),
			label: '3D Block',
			icon: '/icons/navigation/box.svg'
		},
		{
			href: resolve('/components/accordion'),
			label: 'Accordion',
			icon: '/icons/navigation/list-chevrons-up-down.svg'
		},
		{
			href: resolve('/components/appbar'),
			label: 'App Bar',
			icon: '/icons/navigation/panel-top.svg'
		},
		{
			href: resolve('/components/aura'),
			label: 'Aura',
			icon: '/icons/navigation/flame.svg'
		},
		{
			href: resolve('/components/badge'),
			label: 'Badge',
			icon: '/icons/navigation/circle-star.svg'
		},
		{
			href: resolve('/components/breadcrumbs'),
			label: 'Breadcrumbs',
			icon: '/icons/navigation/route.svg'
		},
		{
			href: resolve('/components/button'),
			label: 'Button',
			icon: '/icons/navigation/square-plus.svg'
		},
		{
			href: resolve('/components/calendar'),
			label: 'Calendar',
			icon: '/icons/navigation/calendar-days.svg'
		},
		{
			href: resolve('/components/card'),
			label: 'Card',
			icon: '/icons/navigation/id-card.svg'
		},
		{
			href: resolve('/components/carousel'),
			label: 'Carousel',
			icon: '/icons/navigation/gallery-horizontal.svg'
		},
		{
			href: resolve('/components/chat'),
			label: 'Chat',
			icon: '/icons/navigation/messages-square.svg'
		},
		{
			href: resolve('/components/checkbox'),
			label: 'Checkbox',
			icon: '/icons/navigation/square-check.svg'
		},
		{
			href: resolve('/components/collapse'),
			label: 'Collapse',
			icon: '/icons/navigation/fold-vertical.svg'
		},
		{
			href: resolve('/components/context-menu'),
			label: 'Context Menu',
			icon: '/icons/navigation/mouse-right.svg'
		},
		{
			href: resolve('/components/countdown'),
			label: 'Countdown',
			icon: '/icons/navigation/clock-fading.svg'
		},
		{
			href: resolve('/components/diff'),
			label: 'Diff',
			icon: '/icons/navigation/columns-2.svg'
		},
		{
			href: resolve('/components/divider'),
			label: 'Divider',
			icon: '/icons/navigation/square-split-vertical.svg'
		},
		{
			href: resolve('/components/drawer'),
			label: 'Drawer',
			icon: '/icons/navigation/panel-left-close.svg'
		},
		{
			href: resolve('/components/dropdown'),
			label: 'Dropdown',
			icon: '/icons/navigation/chevron-down.svg'
		},
		{
			href: resolve('/components/fab'),
			label: 'FAB',
			icon: '/icons/navigation/circle-plus.svg'
		},
		{
			href: resolve('/components/helper'),
			label: 'Helper',
			icon: '/icons/navigation/circle-question-mark.svg'
		},
		{
			href: resolve('/components/hover-3d'),
			label: 'Hover 3D',
			icon: '/icons/navigation/rotate-3d.svg'
		},
		{
			href: resolve('/components/indicator'),
			label: 'Indicator',
			icon: '/icons/navigation/rss.svg'
		},
		{
			href: resolve('/components/input'),
			label: 'Input',
			icon: '/icons/navigation/rectangle-ellipsis.svg'
		},
		{
			href: resolve('/components/join'),
			label: 'Join',
			icon: '/icons/navigation/columns-3.svg'
		},
		{
			href: resolve('/components/kbd'),
			label: 'KBD',
			icon: '/icons/navigation/keyboard.svg'
		},
		{
			href: resolve('/components/label'),
			label: 'Label',
			icon: '/icons/navigation/tag.svg'
		},
		{
			href: resolve('/components/loading'),
			label: 'Loading',
			icon: '/icons/navigation/loader.svg'
		},
		{
			href: resolve('/components/menu'),
			label: 'Menu',
			icon: '/icons/navigation/menu.svg'
		},
		{
			href: resolve('/components/modal'),
			label: 'Modal',
			icon: '/icons/navigation/inspection-panel.svg'
		},
		{
			href: resolve('/components/navigation'),
			label: 'Navigation',
			icon: '/icons/navigation/map-pin.svg'
		},
		{
			href: resolve('/components/pagination'),
			label: 'Pagination',
			icon: '/icons/navigation/gallery-thumbnails.svg'
		},
		{
			href: resolve('/components/placeholder'),
			label: 'Placeholder',
			icon: '/icons/navigation/circle-ellipsis.svg'
		},
		{
			href: resolve('/components/progress'),
			label: 'Progress',
			icon: '/icons/navigation/loader-circle.svg'
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
			icon: '/icons/navigation/panel-top-open.svg'
		},
		{
			href: resolve('/components/select'),
			label: 'Select',
			icon: '/icons/navigation/between-horizontal-end.svg'
		},
		{
			href: resolve('/components/sidebar'),
			label: 'Sidebar',
			icon: '/icons/navigation/panel-left.svg'
		},
		{
			href: resolve('/components/slider'),
			label: 'Slider',
			icon: '/icons/navigation/sliders-horizontal.svg'
		},
		{
			href: resolve('/components/snackbar'),
			label: 'Snackbar',
			icon: '/icons/navigation/bell.svg'
		},
		{
			href: resolve('/components/status'),
			label: 'Status',
			icon: '/icons/navigation/globe-check.svg'
		},
		{
			href: resolve('/components/steps'),
			label: 'Steps',
			icon: '/icons/navigation/waypoints.svg'
		},
		{
			href: resolve('/components/swap'),
			label: 'Swap',
			icon: '/icons/navigation/arrow-left-right.svg'
		},
		{
			href: resolve('/components/switch'),
			label: 'Switch',
			icon: '/icons/navigation/toggle-right.svg'
		},
		{
			href: resolve('/components/table'),
			label: 'Table',
			icon: '/icons/navigation/sheet.svg'
		},
		{
			href: resolve('/components/tabs'),
			label: 'Tabs',
			icon: '/icons/navigation/notebook-tabs.svg'
		},
		{
			href: resolve('/components/timeline'),
			label: 'Timeline',
			icon: '/icons/navigation/timeline.svg'
		},
		{
			href: resolve('/components/titlebar'),
			label: 'Titlebar',
			icon: '/icons/navigation/app-window.svg'
		},
		{
			href: resolve('/components/tooltip'),
			label: 'Tooltip',
			icon: '/icons/navigation/info.svg'
		},
		{
			href: resolve('/components/tree'),
			label: 'Tree',
			icon: '/icons/navigation/list-tree.svg'
		},
		{
			href: resolve('/components/tristate'),
			label: 'Tristate',
			icon: '/icons/navigation/square-minus.svg'
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
					class="button button-text button-square button-md swap"
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
				<button class="button button-text button-square button-md">
					<Search />
				</button>
			</div>
		</div>
	{/snippet}

	{#snippet sidebar()}
		<nav class="nav-rail w-64 collapsed:w-20 p-2 gap-2 border-r border-r-surface-container">
			<a
				href={resolve('/')}
				class="nav-link"
				data-active={page.url.pathname === '/' ? '' : undefined}
			>
				<MaskedImage src="/icons/navigation/house.svg" alt="Home" class="nav-link-icon" />
				<span class="nav-link-label">Home</span>
			</a>
			<div class="w-full h-0.5 surface-container rounded-full"></div>
			<div
				class="w-full h-full flex flex-col flex-1 overflow-x-clip overflow-y-auto scrollbar-hidden gap-2"
			>
				{#each links as link (link.href)}
					<a
						href={link.href}
						class="nav-link nav-link-small"
						data-active={page.url.pathname === link.href ? '' : undefined}
					>
						<MaskedImage src={link.icon} alt={link.label} class="nav-link-icon" />
						<span class="nav-link-label">{link.label}</span>
					</a>
				{/each}
			</div>
			<div class="w-full h-0.5 surface-container rounded-full"></div>
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
