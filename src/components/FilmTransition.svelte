<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import type { Project } from '$lib/data/projects';

	let { projects = [] }: { projects?: Project[] } = $props();

	let section: HTMLElement;
	let progress = $state(0);

	function range(value: number, start: number, end: number) {
		return Math.min(Math.max((value - start) / (end - start), 0), 1);
	}

	function hold(value: number, enter: number, leave: number) {
		return range(value, enter, enter + 0.07) * (1 - range(value, leave - 0.07, leave));
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
		const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
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

<section bind:this={section} class="film-transition" id="chapter-film" aria-label="Transition from design to film and video">
	<div class="stage" style="--p:{progress}; --frame:{range(progress, .08, .58)}; --cut:{range(progress, .7, .9)};">
		<div class="design-plane" aria-hidden="true">
			<div class="grid"></div>
			<span class="swatch swatch-a"></span>
			<span class="swatch swatch-b"></span>
			<span class="swatch swatch-c"></span>
			<span class="type-line line-a">Aa</span>
			<span class="type-line line-b">DESIGN</span>
			<span class="type-line line-c">FORM / COLOUR / TYPE</span>
		</div>

		<div class="frame-gate" aria-hidden="true">
			<div class="corner tl"></div><div class="corner tr"></div>
			<div class="corner bl"></div><div class="corner br"></div>
			<span class="gate-code">FRAME 005 — 24 FPS</span>
			<span class="gate-rec">● REC</span>
		</div>

		<div class="copy">
			<p style="opacity:{1 - range(progress, .16, .27)}">Design holds<br />an idea <em>still.</em></p>
			<p style="opacity:{hold(progress, .25, .45)}">Then time<br />enters the frame.</p>
			<p style="opacity:{hold(progress, .44, .65)}">One image becomes<br /><em>twenty-four.</em></p>
		</div>

		<div class="countdown" style="opacity:{hold(progress, .62, .82)}" aria-hidden="true">
			<div class="count-ring"><span>{progress < .685 ? '3' : progress < .745 ? '2' : '1'}</span></div>
			<i></i>
		</div>

		<div class="shutter top" aria-hidden="true"></div>
		<div class="shutter bottom" aria-hidden="true"></div>

		<div class="slate" style="opacity:{range(progress, .88, .96)}">
			<div class="slate-rule"><span></span><span></span><span></span><span></span><span></span></div>
			<p>AEJ MOTION UNIT</p>
			<h2>ROLL<br />CAMERA.</h2>
			<div class="slate-meta"><span>CHAPTER 05</span><span>TAKE 01</span><span>2026</span></div>

			{#if projects.length}
				<nav class="selected-works" aria-label="Selected film works">
					<p>SELECTED WORKS</p>
					<div class="thumbnail-strip">
						{#each projects as project, i (project.id)}
							<a href={resolve('/work/[slug]', { slug: project.slug })} class="thumbnail" data-cursor="View →">
								<span class="thumbnail-image thumb-{(i % 3) + 1}">
									{#if project.media}
										{#if project.mediaType === 'video'}
											<video src={project.media} muted playsinline preload="metadata" aria-hidden="true"></video>
										{:else}
											<img src={project.media} alt="" />
										{/if}
									{:else}
										<i></i>
									{/if}
									<small>0{i + 1}</small>
								</span>
								<strong>{project.title}</strong>
								<em>{project.year}</em>
							</a>
						{/each}
					</div>
				</nav>
			{/if}
		</div>

		<div class="hud" aria-hidden="true">
			<span>DESIGN → MOTION</span>
			<span>{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
		</div>
		<div class="grain" aria-hidden="true"></div>
	</div>
</section>

<style>
	.film-transition { position: relative; left: 50%; width: 100vw; height: 340vh; margin-left: -50vw; background: #050505; }
	.stage { position: sticky; top: 0; height: 100svh; overflow: hidden; background: #000; color: #e8e8e8; }
	.design-plane { position: absolute; inset: 0; opacity: calc(1 - var(--cut)); transform: scale(calc(1 - var(--frame) * .16)); }
	.grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px); background-size: 6vw 6vw; }
	.swatch { position: absolute; width: clamp(5rem, 10vw, 9rem); aspect-ratio: 1; transform: translate(calc(var(--frame) * -18vw),calc(var(--frame) * 16vh)) rotate(calc(var(--frame) * -18deg)); }
	.swatch-a { left: 8%; top: 15%; background: var(--accent); box-shadow: 0 0 70px rgba(200,255,0,.08); } .swatch-b { right: 10%; top: 19%; background: #ff4d00; box-shadow: 0 0 70px rgba(255,77,0,.1); transform: translate(calc(var(--frame) * 20vw),calc(var(--frame) * -12vh)) rotate(calc(var(--frame) * 22deg)); }
	.swatch-c { left: 18%; bottom: 10%; width: clamp(2rem,5vw,5rem); background: #e8e8e8; }
	.type-line { position: absolute; font-weight: 900; line-height: .8; letter-spacing: -.07em; }
	.line-a { right: 15%; bottom: 9%; font-family: Georgia,serif; font-size: clamp(5rem,14vw,13rem); font-weight: 400; font-style: italic; }
	.line-b { left: 50%; top: 45%; transform: translate(-50%,-50%) scale(calc(1 + var(--frame) * 1.8)); font-size: clamp(5rem,16vw,15rem); color: transparent; -webkit-text-stroke: 1px #343434; opacity: calc(1 - var(--frame)); }
	.line-c { left: 4%; bottom: 4%; font: 600 .55rem 'JetBrains Mono',monospace; letter-spacing: .16em; }

	.frame-gate { position: absolute; inset: clamp(1.5rem,5vw,5rem); color: #ff4d00; opacity: var(--frame); transform: scale(calc(1.15 - var(--frame) * .15)); }
	.corner { position: absolute; width: 4rem; height: 4rem; border-color: currentColor; }
	.tl { left:0;top:0;border-left:2px solid;border-top:2px solid }.tr { right:0;top:0;border-right:2px solid;border-top:2px solid }
	.bl { left:0;bottom:0;border-left:2px solid;border-bottom:2px solid }.br { right:0;bottom:0;border-right:2px solid;border-bottom:2px solid }
	.gate-code,.gate-rec { position:absolute; top:1rem; font:600 .52rem 'JetBrains Mono',monospace; letter-spacing:.14em }.gate-code{left:1rem}.gate-rec{right:1rem}

	.copy { position: absolute; inset: 0; display: grid; place-items: center; z-index: 2; }
	.copy p { position: absolute; padding: 2rem; font-size: clamp(3rem,7.5vw,7.8rem); font-weight: 850; line-height: .9; letter-spacing: -.06em; text-align: center; text-wrap: balance; }
	.copy em { color: #ff4d00; font-family: Georgia,serif; font-weight: 400; }

	.countdown { position: absolute; inset: 0; z-index: 4; display: grid; place-items: center; background: #080808; color: #e8e8e8; }
	.countdown::before,.countdown::after { content:'';position:absolute;background:#303030 }.countdown::before{width:100%;height:1px}.countdown::after{height:100%;width:1px}
	.count-ring { width: min(48vw,30rem); aspect-ratio:1; border:2px solid #444; border-radius:50%; display:grid;place-items:center; }
	.count-ring span { font: 800 clamp(9rem,26vw,23rem)/1 'JetBrains Mono',monospace; }
	.countdown i { position:absolute;width:min(48vw,30rem);height:min(48vw,30rem);border-radius:50%;background:conic-gradient(rgba(255,77,0,.22) calc(var(--p) * 720deg),transparent 0); }

	.shutter { position:absolute;left:0;right:0;height:51%;z-index:5;background:#030303;transform:scaleY(var(--cut)); }
	.shutter.top { top:0;transform-origin:top }.shutter.bottom{bottom:0;transform-origin:bottom}
	.slate { position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050505;color:#eee;text-align:center; }
	.slate-rule { position:absolute;top:0;left:0;right:0;height:3rem;display:flex;overflow:hidden }.slate-rule span{flex:1;background:#eee;transform:skewX(-30deg);margin-right:3rem}.slate-rule span:nth-child(even){background:#ff4d00}
	.slate p { font:600 .6rem 'JetBrains Mono',monospace;letter-spacing:.22em;color:#ff4d00 }
	.slate h2 { margin:1.3rem 0 2rem;font-size:clamp(5rem,15vw,14rem);line-height:.72;letter-spacing:-.09em }
	.slate-meta { width:min(42rem,80vw);display:flex;justify-content:space-between;padding-top:1rem;border-top:1px solid #333;font:500 .55rem 'JetBrains Mono',monospace;letter-spacing:.15em;color:#777 }
	.selected-works { position:absolute; z-index:9; left:50%; bottom:3rem; width:min(42rem,80vw); transform:translateX(-50%); text-align:left; }
	.selected-works > p { margin:0 0 .55rem; color:#777; font:600 .48rem 'JetBrains Mono',monospace; letter-spacing:.18em; }
	.thumbnail-strip { display:grid; grid-template-columns:repeat(auto-fit,minmax(8rem,1fr)); gap:.55rem; }
	.thumbnail { min-width:0; display:grid; grid-template-columns:3.8rem 1fr auto; align-items:center; gap:.65rem; padding:.38rem; border:1px solid #292929; background:rgba(5,5,5,.84); color:#aaa; text-align:left; transition:border-color .2s ease,color .2s ease,transform .2s ease; }
	.thumbnail:hover,.thumbnail:focus-visible { color:#eee; border-color:#ff4d00; transform:translateY(-2px); outline:none; }
	.thumbnail-image { position:relative; display:block; width:3.8rem; aspect-ratio:16/10; overflow:hidden; background:radial-gradient(circle at 65% 35%,#df7441 0 3%,#6d210d 4% 15%,#100604 48%,#020202 100%); }
	.thumbnail-image.thumb-2 { background:linear-gradient(120deg,#080808 0 38%,#a13312 39% 42%,#1c0905 43% 72%,#e5773d 73% 75%,#050505 76%); }
	.thumbnail-image.thumb-3 { background:repeating-radial-gradient(circle at 50% 50%,#d45b26 0 2px,#321007 3px 10px,#050303 11px 20px); }
	.thumbnail-image img,.thumbnail-image video { width:100%;height:100%;object-fit:cover; }
	.thumbnail-image i { position:absolute;left:24%;bottom:0;width:24%;height:68%;border-radius:50% 50% 0 0;background:#050303; }
	.thumbnail-image small { position:absolute;right:.25rem;top:.2rem;color:#fff;font:500 .4rem 'JetBrains Mono',monospace; }
	.thumbnail strong { overflow:hidden; font-size:.58rem; font-style:normal; text-overflow:ellipsis; text-transform:uppercase; white-space:nowrap; }
	.thumbnail em { color:#666; font:500 .45rem 'JetBrains Mono',monospace; font-style:normal; }

	.hud { position:absolute;z-index:8;left:2rem;right:2rem;bottom:1.5rem;display:flex;justify-content:space-between;font:600 .5rem 'JetBrains Mono',monospace;letter-spacing:.16em;color:#ff4d00 }
	.grain { position:absolute;inset:-40%;z-index:7;pointer-events:none;opacity:.06;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");animation:grain .2s steps(2) infinite }
	@keyframes grain{50%{transform:translate(3%,-2%)}}
	@media(max-width:650px){.film-transition{height:300vh}.frame-gate{inset:1.2rem}.swatch{width:4rem}.hud{left:1rem;right:1rem}.copy p{font-size:clamp(3rem,14vw,5rem)}.slate{justify-content:flex-start;padding-top:18vh}.slate h2{font-size:clamp(4rem,22vw,7rem)}.selected-works{bottom:3.2rem;width:calc(100vw - 2rem)}.thumbnail-strip{display:flex;overflow-x:auto;scroll-snap-type:x mandatory}.thumbnail{flex:0 0 min(17rem,78vw);scroll-snap-align:start}.slate-meta{width:calc(100vw - 2rem)}}
	@media(prefers-reduced-motion:reduce){.film-transition{height:150vh}.grain{animation:none}}
</style>
