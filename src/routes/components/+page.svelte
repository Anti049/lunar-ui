<script lang="ts">
	import { resolve } from '$app/paths';

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

<div
	class="grid h-full w-full grid-cols-1 gap-4 compact:grid-cols-2 medium:grid-cols-3 expanded:grid-cols-4"
>
	{#each links as link (link.href)}
		<a
			href={link.href}
			class="flex flex-col gap-2 rounded-sm surface-container p-4 elevation-2 transition-all duration-200 hover:-translate-y-2 hover:elevation-4 {link.disabled
				? 'pointer-events-none opacity-50'
				: ''}"
		>
			<p class="text-title-medium font-semibold">{link.label}</p>
			<div class="h-0.5 w-full rounded-full surface-container-high"></div>
			<div class="component-card-body">
				<p>{link.label} component description goes here.</p>
			</div>
		</a>
	{/each}
</div>
