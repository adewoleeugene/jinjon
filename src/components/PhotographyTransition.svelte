<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let section: HTMLElement;
	let progress = $state(0);

	const range = (value: number, start: number, end: number) =>
		Math.min(Math.max((value - start) / (end - start), 0), 1);

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

<section bind:this={section} class="photo-transition" aria-label="Transition from moving image to photography">
	<div class="stage" style="--p:{progress}; --close:{range(progress, .06, .42)}; --aperture-out:{range(progress, .46, .56)}; --flash:{range(progress, .43, .48) * (1 - range(progress, .48, .54))}; --reveal:{range(progress, .49, .76)};">
		<div class="film-strip" aria-hidden="true">
			{#each Array(7) as _, i}
				<span style="--i:{i}"></span>
			{/each}
		</div>

		<div class="intro">
			<p>Motion is made<br />of many frames.</p>
			<span>24 / SECOND</span>
		</div>

		<div class="aperture" aria-hidden="true">
			<div class="blade b1"></div><div class="blade b2"></div><div class="blade b3"></div>
			<div class="blade b4"></div><div class="blade b5"></div><div class="blade b6"></div>
			<div class="iris"></div>
		</div>

		<div class="flash" aria-hidden="true"></div>

		<div class="final-frame">
			<div class="portrait" aria-hidden="true">
				<div class="light"></div><div class="figure"></div><div class="grain"></div>
			</div>
			<div class="title-lockup">
				<span>CHAPTER 06 / THE STILL IMAGE</span>
				<h2>ONE FRAME<br /><em>is enough.</em></h2>
				<p>Light. Instinct. A fraction of a second.</p>
			</div>
		</div>

		<div class="hud" aria-hidden="true"><span>AEJ / PHOTO ARCHIVE</span><span>1 / 125 &nbsp; ƒ2.8 &nbsp; ISO 400</span></div>
	</div>
</section>

<style>
	.photo-transition { position:relative; left:50%; width:100vw; height:280vh; margin-left:-50vw; background:#020202; }
	.stage { position:sticky; top:0; height:100svh; overflow:hidden; background:#030303; color:#f2eee6; }
	.film-strip { position:absolute; inset:0; display:flex; gap:1.2vw; align-items:center; transform:translateX(calc(var(--close) * -32vw)); opacity:calc(1 - var(--close)); }
	.film-strip span { flex:0 0 24vw; height:45vh; border:1px solid #3a3935; background:linear-gradient(145deg,#120b08,#54301d 45%,#100c0a); box-shadow:inset 0 0 0 1.1rem #080808; }
	.film-strip span:nth-child(even) { background:linear-gradient(28deg,#111 0 35%,#9a684a 36% 38%,#25201d 39% 70%,#0b0b0b 71%); }
	.intro { position:absolute; inset:0; z-index:2; display:grid; place-content:center; text-align:center; opacity:calc(1 - var(--close)); }
	.intro p { font-size:clamp(3rem,8vw,8rem); font-weight:850; line-height:.86; letter-spacing:-.07em; }
	.intro span,.title-lockup>span,.hud { font:600 .52rem 'JetBrains Mono',monospace; letter-spacing:.18em; }
	.intro span { margin-top:1.5rem; color:#d6a15b; }
	.aperture { position:absolute; z-index:4; left:50%; top:50%; width:min(72vw,42rem); aspect-ratio:1; transform:translate(-50%,-50%) scale(calc(.2 + var(--close) * .8 + var(--aperture-out) * .35)); border:1px solid #2c2c2c; border-radius:50%; opacity:calc(var(--close) * (1 - var(--aperture-out))); overflow:hidden; background:#080808; }
	.blade { position:absolute; width:62%; height:62%; left:19%; top:-4%; transform-origin:50% 87%; background:#171717; clip-path:polygon(0 0,100% 0,70% 100%,0 72%); transform:rotate(calc(var(--r) + var(--close) * 24deg)); border-bottom:1px solid #333; }
	.b1{--r:0deg}.b2{--r:60deg}.b3{--r:120deg}.b4{--r:180deg}.b5{--r:240deg}.b6{--r:300deg}
	.iris { position:absolute; inset:calc(13% + var(--close) * 29%); border-radius:50%; background:#000; box-shadow:0 0 0 2px #242424; }
	.flash { position:absolute; inset:0; z-index:6; background:#fff; opacity:var(--flash); }
	.final-frame { position:absolute; inset:0; opacity:var(--reveal); transform:scale(calc(1.08 - var(--reveal) * .08)); }
	.portrait { position:absolute; inset:0; overflow:hidden; background:radial-gradient(circle at 66% 38%,#b88756 0 3%,#49311f 10%,#100d0b 36%,#030303 67%); }
	.light { position:absolute; width:48vw; height:120vh; left:28%; top:-20%; background:linear-gradient(100deg,transparent,#d8a26855,transparent 62%); transform:rotate(-12deg); filter:blur(12px); }
	.figure { position:absolute; left:55%; bottom:-15%; width:min(34vw,28rem); height:82vh; border-radius:48% 48% 8% 8%; background:#030303; box-shadow:-2rem -3rem 7rem #aa74424d; transform:translateX(-50%); }
	.grain { position:absolute; inset:-30%; opacity:.12; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
	.title-lockup { position:absolute; z-index:2; left:clamp(1.5rem,7vw,7rem); bottom:clamp(4rem,10vh,8rem); }
	.title-lockup>span { color:#d6a15b; }
	.title-lockup h2 { margin:.8rem 0 1rem; font-size:clamp(4rem,11vw,11rem); line-height:.72; letter-spacing:-.085em; }
	.title-lockup em { font-family:Georgia,serif; font-weight:400; color:#d6a15b; }
	.title-lockup p { max-width:28rem; color:#aaa39a; font-size:clamp(.8rem,1.1vw,1rem); }
	.hud { position:absolute; z-index:8; top:1.5rem; left:2rem; right:2rem; display:flex; justify-content:space-between; color:#d6a15b; opacity:var(--reveal); }
	@media(max-width:650px){.photo-transition{height:240vh}.film-strip span{flex-basis:58vw}.final-frame .figure{width:68vw;left:68%}.title-lockup{left:1.25rem;bottom:5rem}.title-lockup h2{font-size:clamp(4rem,19vw,7rem)}.hud{left:1rem;right:1rem}.hud span:first-child{display:none}.hud{justify-content:flex-end}}
	@media(prefers-reduced-motion:reduce){.photo-transition{height:130vh}.grain{display:none}}
</style>
