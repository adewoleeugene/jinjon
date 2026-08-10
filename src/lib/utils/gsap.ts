import { browser } from '$app/environment';
import type { Action } from 'svelte/action';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

type GsapBundle = {
	gsap: typeof import('gsap').gsap;
	ScrollTrigger: typeof ScrollTriggerType;
};

let _cache: GsapBundle | null = null;

async function loadGSAP(): Promise<GsapBundle | null> {
	if (!browser) return null;
	if (_cache) return _cache;
	const [{ gsap }, { ScrollTrigger }] = await Promise.all([
		import('gsap'),
		import('gsap/ScrollTrigger')
	]);
	gsap.registerPlugin(ScrollTrigger);
	_cache = { gsap, ScrollTrigger };
	return _cache;
}

function killTriggers(ScrollTrigger: typeof ScrollTriggerType, trigger: Element) {
	ScrollTrigger.getAll()
		.filter((st: ScrollTriggerType) => st.vars?.trigger === trigger)
		.forEach((st: ScrollTriggerType) => st.kill());
}

/** Svelte action: GSAP stagger-animates children into view on scroll */
export const scrollReveal: Action<HTMLElement, { selector?: string; delay?: number }> = (
	node,
	params = {}
) => {
	if (!browser) return {};
	const { selector = ':scope > *', delay = 0 } = params;
	let cleanup: (() => void) | undefined;

	loadGSAP().then((bundle) => {
		if (!bundle) return;
		const { gsap, ScrollTrigger } = bundle;
		const targets = node.querySelectorAll(selector);
		if (!targets.length) return;

		gsap.set(targets, { opacity: 0, y: 50 });
		const tween = gsap.to(targets, {
			opacity: 1,
			y: 0,
			duration: 0.8,
			ease: 'power3.out',
			stagger: 0.12,
			delay,
			scrollTrigger: { trigger: node, start: 'top 80%', once: true }
		});

		cleanup = () => { tween.kill(); killTriggers(ScrollTrigger, node); };
	});

	return { destroy() { cleanup?.(); } };
};

/** Svelte action: GSAP parallax on scroll */
export const parallax: Action<HTMLElement, { speed?: number }> = (node, params = {}) => {
	if (!browser) return {};
	const { speed = 0.3 } = params;
	let cleanup: (() => void) | undefined;

	loadGSAP().then((bundle) => {
		if (!bundle) return;
		const { gsap, ScrollTrigger } = bundle;
		const tween = gsap.to(node, {
			y: () => node.offsetHeight * speed,
			ease: 'none',
			scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true }
		});

		cleanup = () => { tween.kill(); killTriggers(ScrollTrigger, node); };
	});

	return { destroy() { cleanup?.(); } };
};

/** Svelte action: GSAP character-by-character title reveal on scroll */
export const splitTextReveal: Action<HTMLElement, { delay?: number }> = (node, params = {}) => {
	if (!browser) return {};
	const { delay = 0 } = params;

	const originalText = node.textContent || '';
	const chars = originalText.split('').map((ch) => {
		const span = document.createElement('span');
		span.textContent = ch === ' ' ? ' ' : ch;
		span.style.display = 'inline-block';
		return span;
	});
	node.textContent = '';
	chars.forEach((s) => node.appendChild(s));

	let cleanup: (() => void) | undefined;

	loadGSAP().then((bundle) => {
		if (!bundle) return;
		const { gsap, ScrollTrigger } = bundle;
		gsap.set(chars, { opacity: 0, y: 30 });
		const tween = gsap.to(chars, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			ease: 'power2.out',
			stagger: 0.03,
			delay,
			scrollTrigger: { trigger: node, start: 'top 85%', once: true }
		});

		cleanup = () => { tween.kill(); killTriggers(ScrollTrigger, node); };
	});

	return { destroy() { cleanup?.(); } };
};
