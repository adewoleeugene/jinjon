<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let x = $state(0);
	let y = $state(0);
	let cx = $state(0);
	let cy = $state(0);
	let label = $state('');
	let expanded = $state(false);
	let visible = $state(false);

	onMount(() => {
		if (!browser) return;

		let raf: number;

		const onMove = (e: MouseEvent) => {
			x = e.clientX;
			y = e.clientY;
			if (!visible) visible = true;
		};

		const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

		const tick = () => {
			cx = lerp(cx, x, 0.12);
			cy = lerp(cy, y, 0.12);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		const onOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const hoverable = target.closest('[data-cursor]') as HTMLElement | null;
			if (hoverable) {
				label = hoverable.dataset.cursor || '';
				expanded = true;
			} else {
				label = '';
				expanded = false;
			}
		};

		window.addEventListener('mousemove', onMove);
		document.addEventListener('mouseover', onOver);

		return () => {
			window.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseover', onOver);
			cancelAnimationFrame(raf);
		};
	});
</script>

{#if visible}
	<div
		class="cursor-dot"
		style="transform: translate({x - 4}px, {y - 4}px)"
	></div>
	<div
		class="cursor-ring"
		class:expanded
		style="transform: translate({cx - (expanded ? 40 : 20)}px, {cy - (expanded ? 40 : 20)}px)"
	>
		{#if label}
			<span class="cursor-label">{label}</span>
		{/if}
	</div>
{/if}

<style>
	.cursor-dot {
		position: fixed;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		background: var(--accent);
		border-radius: 50%;
		pointer-events: none;
		z-index: 10000;
		will-change: transform;
	}

	.cursor-ring {
		position: fixed;
		top: 0;
		left: 0;
		width: 40px;
		height: 40px;
		border: 1px solid rgba(200, 255, 0, 0.4);
		border-radius: 50%;
		pointer-events: none;
		z-index: 9999;
		will-change: transform;
		transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cursor-ring.expanded {
		width: 80px;
		height: 80px;
		border-color: var(--accent);
		background: rgba(200, 255, 0, 0.06);
	}

	.cursor-label {
		color: var(--accent);
		font-size: 0.55rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.cursor-ring.expanded .cursor-label {
		opacity: 1;
	}
</style>
