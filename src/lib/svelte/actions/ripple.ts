import type { Action } from 'svelte/action';

export interface RippleOptions {
	/** When true, no ripple is spawned (e.g. for disabled controls). */
	disabled?: boolean;
	/** Grow / fade-in duration in ms. Default 500. */
	duration?: number;
	/** Peak (held) ripple opacity. Default 0.2, matching the pressed state layer. */
	opacity?: number;
	/**
	 * Ignore the pointer position and expand from the element's center.
	 * Keyboard activation (Enter/Space) always centers regardless of this.
	 */
	centered?: boolean;
	/**
	 * Press-and-hold mode. The ripple grows to fill the control and stays at
	 * peak opacity for as long as the pointer (or Enter/Space) is held —
	 * overriding the `.interactive` pressed/hover state layer — then fades on
	 * release. Each press still spawns its own ripple, so rapid presses stack.
	 * Without this, every press plays a single expand-and-fade ripple.
	 */
	hold?: boolean;
	/** Fade-out duration in ms for a released hold-ripple. Defaults to `duration`. */
	releaseDuration?: number;
}

const RIPPLE_CLASS = 'lunar-ripple';
const HELD_ATTR = 'data-ripple-held';
const MARKER = '--interactive';
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DEFAULT_DURATION = 500;
const DEFAULT_FADE_DURATION = 200;
const DEFAULT_OPACITY = 0.2;

/** True when the host is (or is marked) disabled. */
function isDisabled(node: HTMLElement): boolean {
	return (
		(node as HTMLButtonElement).disabled === true ||
		node.getAttribute('aria-disabled') === 'true' ||
		node.classList.contains('disabled')
	);
}

/** Respect the user's reduced-motion preference (WAAPI ignores the CSS media query). */
function prefersReducedMotion(): boolean {
	return (
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

/** Create, size, and position a ripple span on `host` at the given local point. */
function makeSpan(
	host: HTMLElement,
	clientX: number,
	clientY: number,
	centered: boolean
): HTMLElement {
	const rect = host.getBoundingClientRect();
	const x = centered ? rect.width / 2 : clientX - rect.left;
	const y = centered ? rect.height / 2 : clientY - rect.top;

	// Radius reaches the farthest corner so the ripple fully covers the host.
	const radius = Math.max(
		Math.hypot(x, y),
		Math.hypot(rect.width - x, y),
		Math.hypot(x, rect.height - y),
		Math.hypot(rect.width - x, rect.height - y)
	);

	const span = document.createElement('span');
	span.className = RIPPLE_CLASS;
	span.style.width = `${radius * 2}px`;
	span.style.height = `${radius * 2}px`;
	span.style.left = `${x - radius}px`;
	span.style.top = `${y - radius}px`;
	host.appendChild(span);
	return span;
}

/**
 * Grow to full size and fade in to `op`, holding both (transform and opacity run
 * separately so a release can fade opacity while the grow keeps its final size).
 * Returns the fade-in animation so the release can hand off from its current value.
 */
function growAndHold(span: HTMLElement, op: number, grow: number): Animation {
	span.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
		duration: grow,
		easing: EASE,
		fill: 'forwards'
	});
	return span.animate([{ opacity: 0 }, { opacity: op }], {
		duration: Math.min(grow, 250),
		easing: 'linear',
		fill: 'forwards'
	});
}

/** Fade a held span from its current opacity to 0 without flashing, then remove it. */
function fadeOut(span: HTMLElement, fadeIn: Animation, fade: number, fallbackOp: number): void {
	const current = parseFloat(getComputedStyle(span).opacity) || fallbackOp;
	// Pin the current opacity before cancelling the fade-in so there's no flash
	// back to the element's base opacity.
	span.style.opacity = String(current);
	fadeIn.cancel();
	const out = span.animate([{ opacity: current }, { opacity: 0 }], {
		duration: fade,
		easing: 'linear',
		fill: 'forwards'
	});
	out.onfinish = () => span.remove();
}

/**
 * Material 3 ripple action. Spawns an expanding, fading radial on pointer or
 * keyboard activation, originating from the point of contact.
 *
 * ```svelte
 * <button class="interactive" use:ripple>Tap ripple</button>
 * <button class="interactive" use:ripple={{ hold: true }}>Hold ripple</button>
 * <div use:ripple={{ centered: true, duration: 400 }}>...</div>
 * ```
 *
 * With `hold`, the ripple grows to fill the control and stays until release,
 * overriding the `.interactive` state layer; otherwise it plays a single
 * expand-and-fade. Either way, each press spawns its own span so ripples stack.
 *
 * The host is given a positioning context and clipped overflow (only when it
 * doesn't already have them) so the ripple stays contained. Pair with
 * `.interactive` for the full M3 state-layer + ripple treatment.
 *
 * For a class-driven, zero-wiring alternative see `initRipple` / `rippleRoot`.
 */
export const ripple: Action<HTMLElement, RippleOptions | undefined> = (node, options) => {
	let opts: RippleOptions = options ?? {};

	// Held ripples awaiting release (hold mode). Each keeps its fade-in animation
	// so release() can read the current opacity and hand off smoothly.
	const held: Array<{ span: HTMLElement; fadeIn: Animation }> = [];

	// Ensure the host contains and clips the ripple, remembering any inline
	// values we override so destroy() can restore them.
	const prevPosition = node.style.position;
	const prevOverflow = node.style.overflow;
	const computed = getComputedStyle(node);
	const setPosition = computed.position === 'static';
	const setOverflow = computed.overflow === 'visible';
	if (setPosition) node.style.position = 'relative';
	if (setOverflow) node.style.overflow = 'hidden';

	function press(clientX: number, clientY: number, centered: boolean) {
		if (opts.disabled || isDisabled(node)) return;

		const op = opts.opacity ?? DEFAULT_OPACITY;
		const grow = prefersReducedMotion() ? 1 : (opts.duration ?? DEFAULT_DURATION);
		const span = makeSpan(node, clientX, clientY, centered);

		if (opts.hold) {
			// Grow to fill and hold at peak opacity until release.
			const fadeIn = growAndHold(span, op, grow);
			held.push({ span, fadeIn });
			node.setAttribute(HELD_ATTR, '');
		} else {
			// One-shot: expand while fading out, then clean up.
			const anim = span.animate(
				[
					{ transform: 'scale(0)', opacity: op },
					{ transform: 'scale(1)', opacity: 0 }
				],
				{ duration: grow, easing: EASE, fill: 'forwards' }
			);
			anim.onfinish = () => span.remove();
		}
	}

	/** Release every held ripple: fade from its current opacity, then remove. */
	function release() {
		if (held.length === 0) return;

		const fade = prefersReducedMotion()
			? 1
			: (opts.releaseDuration ?? opts.duration ?? DEFAULT_FADE_DURATION);

		for (const { span, fadeIn } of held) {
			fadeOut(span, fadeIn, fade, opts.opacity ?? DEFAULT_OPACITY);
		}

		held.length = 0;
		node.removeAttribute(HELD_ATTR);
	}

	function onPointerDown(event: PointerEvent) {
		// Primary button / touch / pen only.
		if (event.button !== 0) return;
		press(event.clientX, event.clientY, opts.centered ?? false);
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;
		if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
		press(0, 0, true);
	}

	function onKeyUp(event: KeyboardEvent) {
		if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
		release();
	}

	node.addEventListener('pointerdown', onPointerDown);
	node.addEventListener('keydown', onKeyDown);
	node.addEventListener('keyup', onKeyUp);
	// Release from anywhere so a hold survives dragging off the control.
	window.addEventListener('pointerup', release);
	window.addEventListener('pointercancel', release);

	return {
		update(next?: RippleOptions) {
			opts = next ?? {};
		},
		destroy() {
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('keydown', onKeyDown);
			node.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('pointerup', release);
			window.removeEventListener('pointercancel', release);
			node.removeAttribute(HELD_ATTR);
			if (setPosition) node.style.position = prevPosition;
			if (setOverflow) node.style.overflow = prevOverflow;
		}
	};
};

export interface RippleDelegateOptions {
	/**
	 * Class selector to match hosts by. When omitted (default), hosts are found
	 * via the `--interactive` marker, which also covers utilities that `@apply
	 * interactive` indirectly (e.g. `.button`). Set this to match a plain class.
	 */
	selector?: string;
	/** Selector that opts an element (or whole subtree) out. Default `.ripple-none`. */
	exclude?: string;
	/** Grow / fade-in duration in ms. Default 500. */
	duration?: number;
	/** Peak ripple opacity. Default 0.2, matching the pressed state layer. */
	opacity?: number;
	/** Fade-out duration in ms on release. Defaults to `duration`. */
	releaseDuration?: number;
}

/** Per-element config, merged from delegate options and `data-ripple-*` overrides. */
function readConfig(host: HTMLElement, options: RippleDelegateOptions) {
	const d = host.dataset.rippleDuration;
	const o = host.dataset.rippleOpacity;
	const duration = d != null ? Number(d) : (options.duration ?? DEFAULT_DURATION);
	const opacity = o != null ? Number(o) : (options.opacity ?? DEFAULT_OPACITY);
	return {
		duration,
		opacity,
		releaseDuration: options.releaseDuration ?? duration,
		centered: host.dataset.rippleCentered != null
	};
}

/**
 * Enable class-driven ripples across a subtree via event delegation. Every
 * interactive host gets the unified tap-and-hold ripple automatically — no
 * per-element wiring, and dynamically added elements just work. Hosts are
 * detected by the `--interactive` marker, so utilities that `@apply interactive`
 * indirectly (e.g. `.button`) are covered too. Opt an element or whole subtree
 * out with `.ripple-none`; its hover/focus/pressed state layers stay intact.
 *
 * The behavior combines both gestures: every press grows a ripple that fills the
 * control and holds at peak opacity while pressed (overriding the `.interactive`
 * pressed/hover state layer), then fades on release — so a quick tap reads as a
 * quick ripple and a hold stays. Presses stack. Per-element tuning via
 * `data-ripple-duration`, `data-ripple-opacity`, `data-ripple-centered`.
 *
 * ```ts
 * // in a root layout's onMount:
 * const stop = initRipple();
 * onDestroy(stop);
 * ```
 *
 * Containment comes from `.interactive` itself (`relative overflow-clip`), so
 * hosts need only that class (directly or via `@apply`). Returns a cleanup function.
 */
export function initRipple(
	target: Document | HTMLElement = document,
	options: RippleDelegateOptions = {}
): () => void {
	const selector = options.selector;
	const exclude = options.exclude ?? '.ripple-none';
	// Hosts with at least one still-pressed ripple, mapped to their held spans.
	const active = new Map<HTMLElement, Array<{ span: HTMLElement; fadeIn: Animation }>>();

	function hostFrom(event: Event): HTMLElement | null {
		let el: Element | null = event.target as Element | null;

		if (selector) {
			el = el?.closest?.(selector) ?? null;
			if (!(el instanceof HTMLElement) || isDisabled(el) || el.closest(exclude)) return null;
			return el;
		}

		// Marker-based: climb to the nearest element whose `--interactive` marker
		// resolves, covering both `.interactive` and composites that @apply it.
		while (el instanceof HTMLElement) {
			if (getComputedStyle(el).getPropertyValue(MARKER).trim() !== '') {
				return isDisabled(el) || el.closest(exclude) ? null : el;
			}
			el = el.parentElement;
		}
		return null;
	}

	function pressHost(host: HTMLElement, clientX: number, clientY: number, centered: boolean) {
		const cfg = readConfig(host, options);
		const grow = prefersReducedMotion() ? 1 : cfg.duration;
		const span = makeSpan(host, clientX, clientY, centered || cfg.centered);
		const fadeIn = growAndHold(span, cfg.opacity, grow);
		const list = active.get(host) ?? [];
		list.push({ span, fadeIn });
		active.set(host, list);
		host.setAttribute(HELD_ATTR, '');
	}

	function releaseHost(host: HTMLElement) {
		const list = active.get(host);
		if (!list) return;
		const cfg = readConfig(host, options);
		const fade = prefersReducedMotion() ? 1 : cfg.releaseDuration;
		for (const { span, fadeIn } of list) fadeOut(span, fadeIn, fade, cfg.opacity);
		active.delete(host);
		host.removeAttribute(HELD_ATTR);
	}

	function releaseAll() {
		for (const host of [...active.keys()]) releaseHost(host);
	}

	function onPointerDown(event: PointerEvent) {
		if (event.button !== 0) return;
		const host = hostFrom(event);
		if (host) pressHost(host, event.clientX, event.clientY, false);
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;
		if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
		const host = hostFrom(event);
		if (host) pressHost(host, 0, 0, true);
	}

	function onKeyUp(event: KeyboardEvent) {
		if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
		const host = hostFrom(event);
		if (host) releaseHost(host);
	}

	target.addEventListener('pointerdown', onPointerDown as EventListener);
	target.addEventListener('keydown', onKeyDown as EventListener);
	target.addEventListener('keyup', onKeyUp as EventListener);
	window.addEventListener('pointerup', releaseAll);
	window.addEventListener('pointercancel', releaseAll);

	return () => {
		target.removeEventListener('pointerdown', onPointerDown as EventListener);
		target.removeEventListener('keydown', onKeyDown as EventListener);
		target.removeEventListener('keyup', onKeyUp as EventListener);
		window.removeEventListener('pointerup', releaseAll);
		window.removeEventListener('pointercancel', releaseAll);
		releaseAll();
	};
}

/**
 * Svelte action wrapper around `initRipple`. Put it on a container (e.g. a root
 * layout element) to enable class-driven ripples for every `.ripple` descendant.
 *
 * ```svelte
 * <div use:rippleRoot>
 *   <button class="interactive">Auto ripple</button>
 *   <button class="interactive ripple-none">No ripple</button>
 * </div>
 * ```
 */
export const rippleRoot: Action<HTMLElement, RippleDelegateOptions | undefined> = (
	node,
	options
) => {
	let stop = initRipple(node, options ?? {});
	return {
		update(next?: RippleDelegateOptions) {
			stop();
			stop = initRipple(node, next ?? {});
		},
		destroy() {
			stop();
		}
	};
};
