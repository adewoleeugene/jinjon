<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let section: HTMLElement;
	let progress = $state(0);

	const year = $derived(Math.round(2026 - progress * 42));
	const tunnelDepth = $derived(Math.min(Math.max((progress - 0.08) / 0.72, 0), 1));
	const bootProgress = $derived(Math.min(Math.max((progress - 0.78) / 0.2, 0), 1));

	function range(p: number, start: number, end: number) {
		return Math.min(Math.max((p - start) / (end - start), 0), 1);
	}

	function hold(p: number, enter: number, leave: number) {
		return range(p, enter, enter + 0.08) * (1 - range(p, leave - 0.08, leave));
	}

	onMount(() => {
		if (!browser) return;
		let raf = 0;

		const update = () => {
			raf = 0;
			const rect = section.getBoundingClientRect();
			const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
			progress = Math.min(Math.max(-rect.top / distance, 0), 1);
		};

		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	});
</script>

<section bind:this={section} class="time-travel" id="time-travel" aria-label="Travel to the computer lab">
	<div class="sticky-scene" style="--travel:{tunnelDepth}; --boot:{bootProgress};">
		<div class="time-tunnel" aria-hidden="true">
			{#each Array(9) as _, i (i)}
				<div class="tunnel-frame" style="--i:{i}"></div>
			{/each}
			<div class="floor-grid"></div>
		</div>

		<div class="travel-hud" aria-hidden="true">
			<span>AEJ / TEMPORAL ARCHIVE</span>
			<span>TRAVEL: {String(Math.round(progress * 100)).padStart(3, '0')}%</span>
		</div>

		<div class="year" aria-hidden="true">{year}</div>

		<div class="narrative">
			<p class="beat beat-one" style="opacity:{1 - range(progress, 0.18, 0.28)}">
				Before everything became <em>seamless,</em>
			</p>
			<p class="beat beat-two" style="opacity:{hold(progress, 0.27, 0.5)}">
				technology felt <em>physical.</em>
			</p>
			<p class="beat beat-three" style="opacity:{hold(progress, 0.49, 0.7)}">
				Machines had switches.<br />Software had personality.
			</p>
			<p class="beat beat-four" style="opacity:{hold(progress, 0.69, 0.87)}">
				Building felt like <em>discovery.</em>
			</p>
		</div>

		<div class="boot-screen" style="opacity:{bootProgress}">
			<p>AEJ SYSTEMS ARCHIVE</p>
			<p>INITIALISING PRODUCT RECORDS<span class="ellipsis">...</span></p>
			<div class="boot-track"><span style="width:{bootProgress * 100}%"></span></div>
			<p class="found" class:visible={bootProgress > 0.82}>03 BUILDS FOUND</p>
		</div>

		<div class="scanlines" aria-hidden="true"></div>
	</div>
</section>

<style>
	.time-travel {
		position: relative;
		height: 360vh;
		background: var(--bg);
	}

	.sticky-scene {
		position: sticky;
		top: 0;
		height: 100svh;
		overflow: hidden;
		background: var(--bg);
		perspective: 700px;
	}

	.time-tunnel { position: absolute; inset: 0; transform-style: preserve-3d; }
	.tunnel-frame {
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(86vw, 1050px);
		height: 72vh;
		border: 1px solid rgba(193, 255, 46, calc(0.08 + var(--travel) * 0.16));
		transform:
			translate(-50%, -50%)
			translateZ(calc((var(--i) * -155px) + (var(--travel) * 720px)))
			scale(calc(1 - var(--i) * 0.035));
		opacity: calc(var(--travel) * (1 - var(--i) * 0.07));
		box-shadow: inset 0 0 24px rgba(193, 255, 46, 0.025);
	}

	.floor-grid {
		position: absolute;
		left: -20%;
		right: -20%;
		bottom: -22%;
		height: 67%;
		background-image:
			linear-gradient(rgba(193, 255, 46, 0.16) 1px, transparent 1px),
			linear-gradient(90deg, rgba(193, 255, 46, 0.13) 1px, transparent 1px);
		background-size: 55px 34px;
		transform: rotateX(68deg) translateY(calc(var(--travel) * 85px));
		transform-origin: center top;
		opacity: calc(var(--travel) * 0.7);
		mask-image: linear-gradient(to bottom, transparent, #000 35%);
	}

	.travel-hud {
		position: absolute;
		left: 3rem;
		right: 3rem;
		top: 2rem;
		display: flex;
		justify-content: space-between;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.52rem;
		letter-spacing: 0.16em;
		color: rgba(193, 255, 46, calc(var(--travel) * 0.65));
	}

	.year {
		position: absolute;
		right: clamp(1rem, 5vw, 5rem);
		bottom: clamp(1rem, 5vw, 4rem);
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(3rem, 9vw, 8rem);
		font-weight: 700;
		line-height: 1;
		color: rgba(193, 255, 46, calc(var(--travel) * 0.13));
		font-variant-numeric: tabular-nums;
	}

	.narrative { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; }
	.beat {
		position: absolute;
		max-width: 850px;
		padding: 2rem;
		font-size: clamp(2.1rem, 5.5vw, 5.6rem);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: -0.045em;
		text-align: center;
		color: #e8e8e8;
		transform: translateY(calc((1 - var(--travel)) * 24px));
		text-wrap: balance;
	}
	.beat em { color: var(--accent); font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; }

	.boot-screen {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
		background: var(--bg);
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(0.66rem, 1vw, 0.85rem);
		letter-spacing: 0.14em;
		color: var(--accent);
		text-align: center;
	}
	.boot-track { width: min(420px, 72vw); height: 2px; margin-top: 0.8rem; background: rgba(193, 255, 46, 0.15); }
	.boot-track span { display: block; height: 100%; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
	.found { opacity: 0; color: #e8e8e8; transition: opacity 0.2s ease; }
	.found.visible { opacity: 1; }
	.ellipsis { animation: pulseDots 0.8s steps(2) infinite; }
	@keyframes pulseDots { 50% { opacity: 0.25; } }

	.scanlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: calc(var(--travel) * 0.12);
		background: repeating-linear-gradient(to bottom, transparent 0 3px, rgba(0, 0, 0, 0.7) 4px);
	}

	@media (max-width: 700px) {
		.time-travel { height: 320vh; }
		.travel-hud { left: 1rem; right: 1rem; top: 1.25rem; }
		.travel-hud span:first-child { display: none; }
		.travel-hud { justify-content: flex-end; }
		.tunnel-frame { width: 92vw; height: 67vh; }
	}

	@media (prefers-reduced-motion: reduce) {
		.time-travel { height: 130vh; }
		.ellipsis { animation: none; }
		.tunnel-frame { transform: translate(-50%, -50%) translateZ(calc(var(--i) * -80px)); }
	}
</style>
