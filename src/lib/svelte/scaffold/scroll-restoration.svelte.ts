/*
 * Scaffold scroll behavior — restoration, hash handling, event forwarding.
 *
 * When .scaffold-main is the scroll container (Approach A), the browser's
 * built-in behaviors that assume window-scrolling need adaptation:
 *   1. Scroll restoration (browser saves window.scrollY, not .scaffold-main)
 *   2. Hash-based navigation on initial page load
 *   3. Event forwarding for consumers that listen on window
 *
 * Wire in your root +layout.svelte:
 *
 *   <script>
 *     import { initScaffoldScrollRestoration } from '@anti049/lunar-ui/svelte';
 *     initScaffoldScrollRestoration();
 *   </script>
 */

import { onMount } from 'svelte';
import { afterNavigate, beforeNavigate } from '$app/navigation';
import { page } from '$app/state';
import { SvelteURL } from 'svelte/reactivity';

const STORAGE_KEY = 'lunar-ui:scaffold-scroll';

function getScaffoldMain(): HTMLElement | null {
	return document.querySelector('.scaffold-main');
}

function readMap(): Record<string, number> {
	if (typeof sessionStorage === 'undefined') return {};
	try {
		return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
	} catch {
		return {};
	}
}

function writeMap(map: Record<string, number>): void {
	if (typeof sessionStorage === 'undefined') return;
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
	} catch {
		/* quota exceeded or private mode — swallow */
	}
}

/**
 * Initialize scaffold scroll behaviors. Must be called during component
 * setup (uses SvelteKit lifecycle hooks and onMount).
 *
 * Handles:
 *   - Scroll position restoration on back/forward navigation
 *   - Hash-based scroll on initial page load
 *   - Forwarding scaffold scroll events as `scaffold:scroll` window events
 */
export function initScaffoldScrollRestoration(): void {
	// Save scroll position before navigating away
	beforeNavigate(() => {
		const main = getScaffoldMain();
		if (!main) return;

		const key = page.url.pathname + page.url.search;
		const map = readMap();
		map[key] = main.scrollTop;
		writeMap(map);
	});

	// Restore or reset scroll after navigating in
	afterNavigate((nav) => {
		const main = getScaffoldMain();
		if (!main) return;

		if (nav.type === 'popstate') {
			// Back/forward: restore saved position
			const key = page.url.pathname + page.url.search;
			const saved = readMap()[key];
			if (typeof saved === 'number') {
				requestAnimationFrame(() => {
					main.scrollTop = saved;
				});
				return;
			}
		}

		// Regular navigation: scroll to top
		main.scrollTop = 0;
	});

	onMount(() => {
		const main = getScaffoldMain();
		if (!main) return;

		// On first mount (e.g. page reload), apply saved scroll OR scroll to hash
		const key = page.url.pathname + page.url.search;
		const saved = readMap()[key];

		if (typeof saved === 'number') {
			requestAnimationFrame(() => {
				main.scrollTop = saved;
			});
		} else if (window.location.hash.length > 1) {
			requestAnimationFrame(() => {
				try {
					const target = document.querySelector(window.location.hash);
					if (target instanceof HTMLElement) {
						target.scrollIntoView({ behavior: 'instant', block: 'start' });
					}
				} catch {
					/* invalid selector */
				}
			});
		}

		// Forward scroll events so consumers can listen on window
		function forwardScroll() {
			window.dispatchEvent(
				new CustomEvent('scaffold:scroll', {
					detail: {
						scrollTop: main?.scrollTop,
						scrollHeight: main?.scrollHeight,
						clientHeight: main?.clientHeight
					}
				})
			);
		}
		main.addEventListener('scroll', forwardScroll, { passive: true });

		// ⚠️  ADDED: intercept in-page anchor clicks and route them through
		// scrollIntoView(), which respects .scaffold-main's scroll-padding-top.
		// Without this, SvelteKit's link handler may use window.scrollTo()
		// (bypassing scroll-padding) OR the browser's native anchor handling
		// may scroll the wrong element.
		function handleAnchorClick(e: MouseEvent) {
			// Ignore modifier keys / non-primary clicks / prevented events
			if (e.defaultPrevented || e.button !== 0) return;
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

			const link = (e.target as HTMLElement)?.closest('a[href*="#"]');
			if (!(link instanceof HTMLAnchorElement)) return;

			// Only handle same-page anchors
			const url = new SvelteURL(link.href, window.location.href);
			if (url.pathname !== window.location.pathname) return;
			if (url.search !== window.location.search) return;
			if (!url.hash || url.hash.length < 2) return;

			try {
				const target = document.querySelector(url.hash);
				if (target instanceof HTMLElement) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					// Update URL without triggering navigation
					history.pushState(null, '', url.hash);
				}
			} catch {
				/* invalid selector */
			}
		}
		document.addEventListener('click', handleAnchorClick);

		return () => {
			main.removeEventListener('scroll', forwardScroll);
			document.removeEventListener('click', handleAnchorClick);
		};
	});
}
