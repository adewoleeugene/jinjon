<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { resolve } from '$app/paths';

	let { projects }: { projects: Project[] } = $props();
	let active = $state(0);
	let playing = $state(false);

	const runtimes = ['04:12', '00:48', '02:36'];
	const frames = ['00:01:14:08', '00:02:42:17', '00:03:09:02'];
	const labels = ['DOCUMENTARY', 'COMMERCIAL', 'EXPERIMENTAL'];

	function num(index: number) {
		return String(index + 1).padStart(2, '0');
	}
</script>

<div class="motion-archive">
	<header class="archive-head">
		<div class="head-kicker">
			<span class="rec-dot"></span>
			<span>CHAPTER 05 / MOTION ARCHIVE</span>
		</div>
		<p>Direction, editing and moving images<br />assembled frame by frame.</p>
	</header>

	<div class="wordmark" aria-hidden="true">
		<span>MO</span><span>TION</span>
	</div>

	<section class="edit-bay" class:playing aria-label="Showreel sequence">
		<div class="sprockets left" aria-hidden="true">
			{#each Array(8) as _}<i></i>{/each}
		</div>
		<div class="sprockets right" aria-hidden="true">
			{#each Array(8) as _}<i></i>{/each}
		</div>

		<div class="monitor">
			<div class="monitor-image image-{(active % 3) + 1}">
				<div class="beam"></div>
				<div class="subject"><i></i><i></i><i></i></div>
				<div class="noise"></div>
			</div>
			<div class="monitor-meta top">
				<span>CAM A</span><span>4K / 24FPS</span><span>{frames[active % frames.length]}</span>
			</div>
			<div class="monitor-meta bottom">
				<span>{projects[active]?.title ?? 'DIRECTOR’S CUT'}</span>
				<span>REC ●</span>
			</div>
			<button type="button" class="play" onclick={() => (playing = !playing)} aria-label={playing ? 'Pause sequence' : 'Play sequence'} data-cursor={playing ? 'Pause' : 'Play'}>
				<span>{playing ? 'Ⅱ' : '▶'}</span>
			</button>
		</div>

		<div class="sequence-panel">
			<div class="sequence-title">
				<span>SEQ.05</span>
				<h3>THE<br />CUT</h3>
				<p>Selected motion<br />2023—26</p>
			</div>
			<div class="sequence-list">
				{#each projects as project, i (project.id)}
					<button type="button" class:active={active === i} onclick={() => (active = i)}>
						<span>{num(i)}</span>
						<strong>{project.title}</strong>
						<small>{runtimes[i % runtimes.length]}</small>
					</button>
				{/each}
			</div>
		</div>
	</section>

	<div class="timeline" aria-label="Edit timeline">
		<div class="timeline-ruler">
			<span>00:00</span><span>00:08</span><span>00:16</span><span>00:24</span><span>00:32</span>
		</div>
		<div class="playhead" class:moving={playing}><i></i></div>
		<div class="track"><b>V1</b><span class="clip clip-a">INTRO_05</span><span class="clip clip-b">MAIN_SEQUENCE</span><span class="clip clip-c">OUTRO</span></div>
		<div class="track audio"><b>A1</b><span class="wave">▂▅▃▇▂▄▆▃▅▂▇▄▂▆▃▅▂▇▄▃▆▂▅▃▇▂▄▆▃▅▂▇▄▂▆</span></div>
	</div>

	<div class="project-head">
		<span>SELECTED TAKES</span>
		<span>{String(projects.length).padStart(2, '0')} / {new Date().getFullYear()}</span>
	</div>

	<div class="takes">
		{#each projects as project, i (project.id)}
			<a href={resolve('/work/[slug]', { slug: project.slug })} class="take" data-cursor="View film →">
				<div class="take-frame frame-{(i % 3) + 1}">
					{#if project.media}
						{#if project.mediaType === 'video'}
							<video src={project.media} muted playsinline preload="metadata" aria-label={project.title}></video>
						{:else}
							<img src={project.media} alt="" />
						{/if}
					{:else}
						<div class="take-art"><i></i><i></i></div>
					{/if}
					<span class="take-code">{frames[i % frames.length]}</span>
					<span class="take-no">TAKE {num(i)}</span>
				</div>
				<div class="take-info">
					<div><span>{labels[i % labels.length]} / {project.year}</span><h4>{project.title}</h4></div>
					<p>{project.tags.join(' · ')}</p>
					<b>↗</b>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.motion-archive { --film: #ff4d00; position: relative; color: #efefeb; }
	.archive-head { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 1.2rem; border-bottom: 1px solid #292929; }
	.head-kicker { display: flex; gap: .7rem; align-items: center; font: 600 .58rem 'JetBrains Mono', monospace; letter-spacing: .16em; }
	.rec-dot { width: .48rem; height: .48rem; border-radius: 50%; background: var(--film); box-shadow: 0 0 12px var(--film); }
	.archive-head p { text-align: right; color: #777; font-size: .7rem; line-height: 1.5; }

	.wordmark { display: flex; justify-content: space-between; margin: .5rem 0 -2.8vw; font-size: clamp(6rem, 17.4vw, 17rem); line-height: .8; font-weight: 950; letter-spacing: -.09em; color: #e9e9e4; pointer-events: none; }
	.wordmark span:last-child { color: transparent; -webkit-text-stroke: 1px #3b3b39; }

	.edit-bay { position: relative; display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(15rem, .45fr); min-height: 34rem; background: #080808; border-block: 1px solid #2b2b2b; overflow: hidden; }
	.monitor { position: relative; margin: 1.1rem 0 1.1rem 2.5rem; overflow: hidden; background: #160904; }
	.monitor-image { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(circle at 64% 32%, #f2a56d 0 1%, #9e3b18 2%, #39130a 16%, #090504 54%); transition: background 500ms ease; }
	.monitor-image.image-2 { background: linear-gradient(118deg, #080808 0 38%, #8e2c0c 38% 41%, #170805 41% 70%, #df7238 70% 71%, #090606 71%); }
	.monitor-image.image-3 { background: radial-gradient(ellipse at 50% 53%, #f5a16a 0 2%, #762811 3% 11%, #0b0504 12% 30%, #451208 31% 43%, #050303 44%); }
	.subject { position: absolute; left: 19%; bottom: 0; width: 29%; height: 75%; filter: blur(.4px); }
	.subject i:first-child { position: absolute; width: 45%; aspect-ratio: 1; left: 28%; top: 0; border-radius: 50%; background: #070504; }
	.subject i:nth-child(2) { position: absolute; inset: 25% 5% 0; border-radius: 46% 46% 0 0; background: #050404; }
	.subject i:last-child { position: absolute; width: 130%; height: 5%; top: 37%; left: -18%; transform: rotate(-12deg); background: #110604; }
	.beam { position: absolute; width: 63%; height: 140%; right: -13%; top: -28%; background: linear-gradient(105deg, transparent 20%, rgba(255,120,56,.32) 49%, transparent 70%); transform: rotate(-9deg); }
	.noise { position: absolute; inset: -40%; opacity: .12; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); animation: noise .18s steps(2) infinite; }
	@keyframes noise { 0%{transform:translate(0)} 33%{transform:translate(2%,-3%)} 66%{transform:translate(-3%,2%)} }
	.monitor-meta { position: absolute; left: 1rem; right: 1rem; display: flex; justify-content: space-between; font: 600 .52rem 'JetBrains Mono', monospace; letter-spacing: .12em; color: rgba(255,255,255,.66); z-index: 2; }
	.monitor-meta.top { top: 1rem; } .monitor-meta.bottom { bottom: 1rem; }
	.play { position: absolute; inset: 0; width: 100%; border: 0; background: transparent; color: #fff; display: grid; place-items: center; }
	.play span { display: grid; place-items: center; width: 5rem; height: 5rem; border-radius: 50%; border: 1px solid rgba(255,255,255,.52); background: rgba(0,0,0,.12); backdrop-filter: blur(5px); transition: .25s ease; }
	.play:hover span { background: var(--film); border-color: var(--film); transform: scale(1.08); }
	.playing .beam { animation: beam 3s ease-in-out infinite alternate; }
	@keyframes beam { to { transform: translateX(-12%) rotate(-5deg); opacity: .6; } }

	.sequence-panel { padding: 2rem 1.5rem; border-left: 1px solid #292929; display: flex; flex-direction: column; justify-content: space-between; }
	.sequence-title > span { font: .55rem 'JetBrains Mono', monospace; color: var(--film); letter-spacing: .14em; }
	.sequence-title h3 { margin: 1.4rem 0; font-size: clamp(3.5rem, 6vw, 6rem); line-height: .72; letter-spacing: -.08em; }
	.sequence-title p { color: #737373; font: .58rem/1.6 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: .1em; }
	.sequence-list button { width: 100%; display: grid; grid-template-columns: 2rem 1fr auto; gap: .5rem; align-items: center; padding: .85rem 0; border: 0; border-top: 1px solid #272727; background: none; color: #777; text-align: left; }
	.sequence-list button span, .sequence-list small { font: .52rem 'JetBrains Mono', monospace; letter-spacing: .1em; }
	.sequence-list strong { font-size: .68rem; text-transform: uppercase; }
	.sequence-list button.active { color: #eee; } .sequence-list button.active span { color: var(--film); }

	.sprockets { position: absolute; top: 0; bottom: 0; z-index: 5; display: flex; flex-direction: column; justify-content: space-around; padding: .6rem .45rem; background: #050505; }
	.sprockets.left { left: 0; } .sprockets.right { right: 0; }
	.sprockets i { display: block; width: .65rem; height: 1.3rem; border: 1px solid #353535; border-radius: 1px; }

	.timeline { position: relative; margin: 1rem 0 5rem; padding: .8rem 0 .6rem 2.5rem; background: #0b0b0b; border: 1px solid #292929; overflow: hidden; }
	.timeline-ruler { display: flex; justify-content: space-between; padding: 0 .7rem .6rem; border-bottom: 1px solid #252525; color: #666; font: .48rem 'JetBrains Mono', monospace; }
	.track { height: 2rem; display: flex; gap: 2px; margin-top: 3px; }
	.track b { position: absolute; left: .5rem; color: #666; font: .5rem 'JetBrains Mono', monospace; padding-top: .7rem; }
	.clip { display: flex; align-items: center; padding-left: .5rem; background: #482114; border-left: 2px solid var(--film); color: #c98568; font: .47rem 'JetBrains Mono', monospace; overflow: hidden; }
	.clip-a { width: 24%; } .clip-b { width: 51%; } .clip-c { width: 25%; }
	.audio { height: 1.5rem; background: #17261d; color: #5a9871; overflow: hidden; }
	.wave { width: 100%; letter-spacing: .45em; white-space: nowrap; font-size: .7rem; opacity: .7; }
	.playhead { position: absolute; z-index: 3; left: 37%; top: .35rem; bottom: 0; width: 1px; background: var(--film); }
	.playhead i { position: absolute; top: 0; left: -4px; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 6px solid var(--film); }
	.playhead.moving { animation: scrub 6s linear infinite; }
	@keyframes scrub { from { left: 3%; } to { left: 98%; } }

	.project-head { display: flex; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid #2b2b2b; font: .58rem 'JetBrains Mono', monospace; letter-spacing: .15em; color: #777; }
	.takes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4rem 1.2rem; padding-top: 1.2rem; }
	.take:nth-child(even) { margin-top: 7rem; }
	.take-frame { position: relative; aspect-ratio: 16/10; overflow: hidden; background: #150905; }
	.take-frame img, .take-frame video { width: 100%; height: 100%; object-fit: cover; }
	.take-art { position: absolute; inset: 0; background: radial-gradient(circle at 60% 34%, #d8652c, #47180b 12%, #080403 55%); transition: transform .7s ease; }
	.frame-2 .take-art { background: linear-gradient(123deg,#070707 33%,#b13a15 34% 36%,#190806 37% 68%,#ed844b 69% 70%,#060606 71%); }
	.frame-3 .take-art { background: repeating-radial-gradient(circle at 52% 52%,#d65c26 0 2px,#381108 3px 22px,#050303 23px 44px); }
	.take-art i:first-child { position: absolute; width: 18%; height: 60%; left: 24%; bottom: 0; background: #050303; border-radius: 50% 50% 0 0; }
	.take-art i:last-child { position: absolute; width: 55%; height: 2px; right: 8%; top: 38%; background: rgba(255,180,130,.4); transform: rotate(-17deg); }
	.take:hover .take-art { transform: scale(1.06); }
	.take-code, .take-no { position: absolute; top: .7rem; font: .5rem 'JetBrains Mono', monospace; letter-spacing: .1em; }
	.take-code { left: .7rem; } .take-no { right: .7rem; color: var(--film); }
	.take-info { display: grid; grid-template-columns: 1fr auto; gap: 1rem; padding-top: 1rem; }
	.take-info span, .take-info p { font: .52rem/1.5 'JetBrains Mono', monospace; color: #737373; letter-spacing: .1em; text-transform: uppercase; }
	.take-info h4 { margin-top: .55rem; font-size: clamp(1.7rem, 3vw, 3.2rem); line-height: .9; letter-spacing: -.05em; }
	.take-info p { grid-column: 1; } .take-info b { grid-column: 2; grid-row: 1; font-size: 1.3rem; color: #777; transition: .2s; }
	.take:hover .take-info b { color: var(--film); transform: translate(3px,-3px); }

	@media (max-width: 760px) {
		.archive-head p { display: none; }
		.wordmark { margin-block: 1.5rem .2rem; }
		.edit-bay { grid-template-columns: 1fr; min-height: auto; }
		.monitor { height: 25rem; margin: .7rem 1.6rem; }
		.sequence-panel { border-left: 0; border-top: 1px solid #292929; }
		.sequence-title { display: flex; justify-content: space-between; align-items: flex-end; }
		.sequence-title h3 { margin: 1rem 0; }
		.timeline { margin-bottom: 3rem; }
		.takes { grid-template-columns: 1fr; gap: 3rem; }
		.take:nth-child(even) { margin-top: 0; }
	}

	@media (prefers-reduced-motion: reduce) {
		.noise, .playing .beam, .playhead.moving { animation: none; }
	}
</style>
