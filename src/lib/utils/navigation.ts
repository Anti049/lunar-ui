import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';

/**
 * Components
 *
 * 3D Viewer
 * Accordion
 * Appbar
 * Aura
 * Avatar
 * Badge
 * Breadcrumb
 * Button
 * Calendar
 * Card
 * Carousel
 * Chart
 * Chat
 * Checkbox
 * Code Block
 * Collapsible
 * Combobox
 * Command
 * Context Menu
 * Countdown
 * Data Table
 * Date Picker
 * Dialog
 * Diff
 * Divider
 * Drawer
 * Dropdown
 * FAB
 * File Upload
 * Form
 * Helper
 * Hover 3D
 * Hover Card
 * Hover Gallery
 * Indicator
 * Input
 * Input OTP
 * Join
 * Kbd
 * Label
 * Loading
 * Marquee
 * Mask
 * Menu
 * Mockup
 * Modal
 * Navigation
 * Pagination
 * Panel
 * Placeholder
 * Popover
 * Portal
 * Progress
 * QR Code
 * Radio
 * Rating
 * Resizable
 * Scroll Area
 * Section
 * Select
 * Sidebar
 * Skeleton
 * Slider
 * Spinner
 * Status
 * Steps
 * Swap
 * Switch
 * Table
 * Tabs
 * Tag
 * Text Reel
 * Timeline
 * Titlebar
 * Toast
 * Toggle
 * Tooltip
 * Tree
 * Tristate
 */
type NavigationRoute = {
	label: string;
	href: ResolvedPathname;
	icon?: string;
	disabled?: boolean;
};

const plannedHref = (path: string): ResolvedPathname => path as ResolvedPathname;

const componentStyles = import.meta.glob<string>('/src/lib/styles/components/*.css', {
	eager: true,
	query: '?raw',
	import: 'default'
});

function isDisabled(route: NavigationRoute): boolean {
	// Check if a CSS file exists for the component, if not, mark it as disabled
	const cssFilePath = `/src/lib/styles/components/${route.href.replace('/components/', '')}.css`;
	const cssContent = componentStyles[cssFilePath];
	const meaningfulCss = cssContent?.replace(/\/\*[\s\S]*?\*\//g, '').trim();
	return !meaningfulCss || route.disabled === true;
}

const componentLinks: NavigationRoute[] = [
	{
		label: '3D Viewer',
		href: resolve('/components/3d-viewer'),
		icon: '/icons/navigation/box.svg'
	},
	{
		href: resolve('/components/accordion'),
		label: 'Accordion',
		icon: '/icons/navigation/list-chevrons-up-down.svg'
	},
	{
		href: resolve('/components/appbar'),
		label: 'Appbar',
		icon: '/icons/navigation/panel-top.svg'
	},
	{
		href: resolve('/components/aura'),
		label: 'Aura',
		icon: '/icons/navigation/flame.svg'
	},
	{
		href: plannedHref('/components/avatar'),
		label: 'Avatar',
		icon: '/icons/navigation/user.svg'
	},
	{
		href: resolve('/components/badge'),
		label: 'Badge',
		icon: '/icons/navigation/circle-star.svg'
	},
	{
		href: resolve('/components/breadcrumb'),
		label: 'Breadcrumb',
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
		icon: '/icons/navigation/gallery-horizontal-end.svg'
	},
	{
		href: resolve('/components/chart'),
		label: 'Chart',
		icon: '/icons/navigation/chart-column.svg'
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
		href: resolve('/components/code-block'),
		label: 'Code Block',
		icon: '/icons/navigation/code.svg'
	},
	{
		href: resolve('/components/collapsible'),
		label: 'Collapsible',
		icon: '/icons/navigation/fold-vertical.svg'
	},
	{
		href: plannedHref('/components/combobox'),
		label: 'Combobox',
		icon: '/icons/navigation/combine.svg'
	},
	{
		href: plannedHref('/components/command'),
		label: 'Command',
		icon: '/icons/navigation/terminal.svg'
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
		href: plannedHref('/components/data-table'),
		label: 'Data Table',
		icon: '/icons/navigation/columns-3-cog.svg'
	},
	{
		href: plannedHref('/components/date-picker'),
		label: 'Date Picker',
		icon: '/icons/navigation/calendar-plus.svg'
	},
	{
		href: plannedHref('/components/dialog'),
		label: 'Dialog',
		icon: '/icons/navigation/picture-in-picture.svg'
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
		href: plannedHref('/components/file-upload'),
		label: 'File Upload',
		icon: '/icons/navigation/file-plus-corner.svg'
	},
	{
		href: plannedHref('/components/form'),
		label: 'Form',
		icon: '/icons/navigation/form.svg'
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
		href: plannedHref('/components/hover-card'),
		label: 'Hover Card',
		icon: '/icons/navigation/card-sim.svg'
	},
	{
		href: plannedHref('/components/hover-gallery'),
		label: 'Hover Gallery',
		icon: '/icons/navigation/scan-eye.svg'
	},
	{
		href: resolve('/components/indicator'),
		label: 'Indicator',
		icon: '/icons/navigation/rss.svg'
	},
	{
		href: resolve('/components/input'),
		label: 'Input',
		icon: '/icons/navigation/text-cursor-input.svg'
	},
	{
		href: plannedHref('/components/input-otp'),
		label: 'Input OTP',
		icon: '/icons/navigation/rectangle-ellipsis.svg'
	},
	{
		href: resolve('/components/join'),
		label: 'Join',
		icon: '/icons/navigation/columns-3.svg'
	},
	{
		href: resolve('/components/kbd'),
		label: 'Kbd',
		icon: '/icons/navigation/keyboard.svg'
	},
	{
		href: resolve('/components/label'),
		label: 'Label',
		icon: '/icons/navigation/bookmark.svg'
	},
	{
		href: resolve('/components/loading'),
		label: 'Loading',
		icon: '/icons/navigation/loader.svg'
	},
	{
		href: plannedHref('/components/marquee'),
		label: 'Marquee',
		icon: '/icons/navigation/gallery-horizontal.svg'
	},
	{
		href: plannedHref('/components/mask'),
		label: 'Mask',
		icon: '/icons/navigation/eye-off.svg'
	},
	{
		href: resolve('/components/menu'),
		label: 'Menu',
		icon: '/icons/navigation/menu.svg'
	},
	{
		href: plannedHref('/components/mockup'),
		label: 'Mockup',
		icon: '/icons/navigation/drama.svg'
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
		href: plannedHref('/components/panel'),
		label: 'Panel',
		icon: '/icons/navigation/panel-left-dashed.svg'
	},
	{
		href: resolve('/components/placeholder'),
		label: 'Placeholder',
		icon: '/icons/navigation/circle-ellipsis.svg'
	},
	{
		href: plannedHref('/components/popover'),
		label: 'Popover',
		icon: '/icons/navigation/balloon.svg'
	},
	{
		href: plannedHref('/components/portal'),
		label: 'Portal',
		icon: '/icons/navigation/replace.svg'
	},
	{
		href: resolve('/components/progress'),
		label: 'Progress',
		icon: '/icons/navigation/loader-circle.svg'
	},
	{
		href: plannedHref('/components/qr-code'),
		label: 'QR Code',
		icon: '/icons/navigation/qr-code.svg'
	},
	{
		href: resolve('/components/radio'),
		label: 'Radio',
		icon: '/icons/navigation/circle-dot.svg'
	},
	{
		href: plannedHref('/components/rating'),
		label: 'Rating',
		icon: '/icons/navigation/star.svg'
	},
	{
		href: plannedHref('/components/resizable'),
		label: 'Resizable',
		icon: '/icons/navigation/scaling.svg'
	},
	{
		href: plannedHref('/components/scroll-area'),
		label: 'Scroll Area',
		icon: '/icons/navigation/mouse.svg'
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
		href: plannedHref('/components/skeleton'),
		label: 'Skeleton',
		icon: '/icons/navigation/square-dashed.svg'
	},
	{
		href: resolve('/components/slider'),
		label: 'Slider',
		icon: '/icons/navigation/sliders-horizontal.svg'
	},
	{
		href: plannedHref('/components/spinner'),
		label: 'Spinner',
		icon: '/icons/navigation/circle-dot-dashed.svg'
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
		href: plannedHref('/components/tag'),
		label: 'Tag',
		icon: '/icons/navigation/tag.svg'
	},
	{
		href: plannedHref('/components/text-reel'),
		label: 'Text Reel',
		icon: '/icons/navigation/a-arrow-down.svg'
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
		href: plannedHref('/components/toast'),
		label: 'Toast',
		icon: '/icons/navigation/bell.svg'
	},
	{
		href: plannedHref('/components/toggle'),
		label: 'Toggle',
		icon: '/icons/navigation/circle-power.svg'
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

export { componentLinks, isDisabled, type NavigationRoute };
