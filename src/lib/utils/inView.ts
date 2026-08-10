import type { Action } from 'svelte/action';

interface InViewParams {
	threshold?: number;
	once?: boolean;
	onEnter?: () => void;
	onLeave?: () => void;
}

export const inView: Action<HTMLElement, InViewParams> = (node, params = {}) => {
	const { threshold = 0.15, once = true, onEnter, onLeave } = params;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				onEnter?.();
				if (once) observer.disconnect();
			} else {
				onLeave?.();
			}
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		update(newParams) {
			// params are read once; reconnect if needed
		},
		destroy() {
			observer.disconnect();
		}
	};
};
