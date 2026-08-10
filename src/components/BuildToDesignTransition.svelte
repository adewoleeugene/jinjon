<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { designReveal } from '$lib/stores/designReveal';

	let section: HTMLElement;
	let progress = $state(0);

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
			designReveal.set(progress >= 0.965);
		};
		const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (raf) cancelAnimationFrame(raf);
			designReveal.set(false);
		};
	});
</script>

<section bind:this={section} class="design-transition" id="build-to-design" aria-label="Transition from engineering to design">
	<div class="transition-stage" style="--p:{progress};">
		<div class="transition-meta" aria-hidden="true">
			<span>AEJ / DISCIPLINE TRANSFER</span>
			<span>BUILD → DESIGN</span>
			<span>{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
		</div>

		<div class="beats">
			<p class="beat" style="opacity:{1 - range(progress, 0.19, 0.29)}">
				Every system begins<br />with <em>structure.</em>
			</p>
			<p class="beat" style="opacity:{hold(progress, 0.26, 0.5)}">
				But function alone<br />is not <em>enough.</em>
			</p>
			<p class="beat" style="opacity:{hold(progress, 0.48, 0.72)}">
				Design gives an idea<br />a <em>voice.</em>
			</p>
			<p class="beat final-beat" style="opacity:{hold(progress, 0.7, 0.9)}">
				Symbols. Type. Colour.<br /><em>Memory.</em>
			</p>
		</div>

		<div
			class="output"
			style="opacity:{range(progress, 0.84, 0.92) * (1 - range(progress, 0.965, 1))}"
		>
			<div class="output-mark">Ds</div>
			<div>
				<p>CREATIVE WORKSPACE FOUND</p>
				<p>OPENING DESIGN STUDIO<span class="dots">...</span></p>
			</div>
			<div class="output-line"><span style="width:{range(progress, 0.87, 0.98) * 100}%"></span></div>
		</div>

		<div class="scanlines" aria-hidden="true"></div>
	</div>
</section>

<style>
	.design-transition { position:relative; left:50%; width:100vw; height:330vh; margin-left:-50vw; background:var(--bg); }
	.transition-stage { position:sticky; top:0; height:100svh; overflow:hidden; display:grid; place-items:center; background:var(--bg); }
	.transition-meta { position:absolute; left:clamp(1rem,3vw,3rem); right:clamp(1rem,3vw,3rem); top:2rem; display:grid; grid-template-columns:1fr auto 1fr; font-family:'JetBrains Mono',monospace; font-size:.5rem; letter-spacing:.15em; color:rgba(193,255,46,.55); }
	.transition-meta span:nth-child(2){text-align:center}.transition-meta span:last-child{text-align:right}
	.beats { position:absolute; inset:0; z-index:2; display:grid; place-items:center; }
	.beat { position:absolute; max-width:1050px; padding:2rem; font-size:clamp(2.8rem,7vw,7.3rem); font-weight:800; line-height:.94; letter-spacing:-.06em; text-align:center; text-wrap:balance; color:#e8e8e8; }
	.beat em { font-family:'Playfair Display',Georgia,serif; font-weight:400; color:var(--accent); }
	.final-beat { text-transform:none; }
	.output { position:absolute; z-index:3; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; background:var(--bg); font-family:'JetBrains Mono',monospace; font-size:clamp(.62rem,1vw,.8rem); line-height:1.9; letter-spacing:.13em; text-align:center; color:#818978; }
	.output-mark { width:70px; height:70px; display:grid; place-items:center; border:1px solid var(--accent); color:var(--accent); font-family:'Satoshi',sans-serif; font-size:2rem; font-weight:700; box-shadow:0 0 35px rgba(193,255,46,.1); }
	.output p:last-child { color:var(--accent); }
	.output-line { width:min(430px,70vw); height:2px; background:rgba(193,255,46,.12); }
	.output-line span { display:block; height:100%; background:var(--accent); box-shadow:0 0 10px var(--accent); }
	.dots { animation:dots .8s steps(2) infinite; }
	@keyframes dots { 50%{opacity:.2} }
	.scanlines { position:absolute; inset:0; pointer-events:none; opacity:calc((1 - var(--p)) * .08); background:repeating-linear-gradient(to bottom,transparent 0 3px,rgba(0,0,0,.7) 4px); }
	@media(max-width:650px){
		.design-transition{height:290vh}.transition-meta{grid-template-columns:1fr auto}.transition-meta span:first-child{display:none}.beat{font-size:clamp(2.5rem,12vw,4.8rem)}
	}
	@media(prefers-reduced-motion:reduce){.design-transition{height:130vh}.dots{animation:none}}
</style>
