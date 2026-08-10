<script lang="ts">
	import type { Project } from '$lib/data/projects';

	let { projects, accentColor = '#c8ff00' }: { projects: Project[]; accentColor?: string } = $props();

	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);

	function openLightbox(i: number) {
		lightboxIndex = i;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function prev() {
		lightboxIndex = (lightboxIndex - 1 + projects.length) % projects.length;
	}

	function next() {
		lightboxIndex = (lightboxIndex + 1) % projects.length;
	}

	function onKeydown(e: KeyboardEvent) {
		if (!lightboxOpen) return;
		if (e.key === 'Escape') closeLightbox();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<section class="photo-archive" id="chapter-photography" style="--accent-color: {accentColor}">
	<div class="contact-meta"><span>06 / SELECTED PHOTOGRAPHY / 2023—2024</span><span>CONTACT SHEET 001 / {String(projects.length).padStart(2, '0')} EXPOSURES</span></div>
	<div class="gallery">
	{#each projects as project, i (project.id)}
		<button
			class="gallery-item"
			onclick={() => openLightbox(i)}
			data-cursor="Open"
			class:featured={i === 0}
		>
			<div class="gallery-media">
				{#if project.media}
					<img src={project.media} alt={project.title} loading="lazy" />
				{:else}
					<div class="gallery-placeholder">
						<span class="gallery-num" style="color: {accentColor}">0{i + 1}</span>
					</div>
				{/if}
				<div class="gallery-hover">
					<span>VIEW FRAME</span><span>↗</span>
				</div>
			</div>
			<div class="gallery-caption">
				<div><span class="gallery-count">0{i + 1}</span><h3>{project.title}</h3></div>
				<div class="caption-meta"><span>{project.year}</span><span>{project.tags.join(' / ')}</span></div>
			</div>
		</button>
	{/each}
	</div>
	<button class="view-all" onclick={() => openLightbox(0)} data-cursor="Open">
		<span>VIEW ALL PHOTOGRAPHS</span>
		<span>{String(projects.length).padStart(2, '0')} FRAMES</span>
		<i aria-hidden="true">↗</i>
	</button>
</section>

{#if lightboxOpen}
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label="Image lightbox"
	>
		<button class="lightbox-backdrop" onclick={closeLightbox} aria-label="Close lightbox"></button>
		<div class="lightbox-content">
			<div class="lightbox-media">
				{#if projects[lightboxIndex].media}
					<img src={projects[lightboxIndex].media} alt={projects[lightboxIndex].title} />
				{:else}
					<div class="lightbox-placeholder">
						<span style="color: {accentColor}; font-size: 4rem">✦</span>
					</div>
				{/if}
			</div>
			<div class="lightbox-info">
				<span class="lightbox-num">0{lightboxIndex + 1} / 0{projects.length}</span>
				<h3 class="lightbox-title">{projects[lightboxIndex].title}</h3>
				<p class="lightbox-desc">{projects[lightboxIndex].description}</p>
			</div>
		</div>
		<button class="lightbox-prev" onclick={prev} aria-label="Previous" data-cursor="←">←</button>
		<button class="lightbox-next" onclick={next} aria-label="Next" data-cursor="→">→</button>
		<button class="lightbox-close" onclick={closeLightbox} aria-label="Close" data-cursor="Close">✕</button>
	</div>
{/if}

<style>
	.photo-archive { position:relative; left:50%; width:100vw; margin-left:-50vw; padding:clamp(2.5rem,5vw,5rem) clamp(1.25rem,4vw,4rem) clamp(6rem,12vw,12rem); background:#000; color:#eeeae2; }
	.contact-meta { display:flex; justify-content:space-between; padding:.75rem 0; border-top:1px solid #34322f; color:#77736c; font:500 .48rem 'JetBrains Mono',monospace; letter-spacing:.16em; }
	.gallery {
		display:grid;
		grid-template-columns:repeat(12,1fr);
		grid-auto-flow:dense;
		gap:clamp(1rem,2vw,2rem);
		padding:clamp(5rem,9vw,9rem) clamp(1rem,3vw,3rem) clamp(7rem,12vw,12rem);
		background-image:radial-gradient(rgba(255,255,255,.035) .7px,transparent .7px);
		background-size:7px 7px;
	}

	.gallery-item {
		position:relative;
		grid-column:span 5;
		align-self:start;
		background:#171717;
		border: none;
		padding:clamp(.55rem,1vw,1rem) clamp(.55rem,1vw,1rem) clamp(4.8rem,7vw,7rem);
		display: block;
		width:100%;
		text-align:left;
		cursor: none;
		transform:rotate(-1.2deg);
		box-shadow:0 2rem 5rem rgba(0,0,0,.7),0 .25rem .7rem rgba(0,0,0,.55);
		transition:transform .35s ease,box-shadow .35s ease;
	}
	.gallery-item:nth-child(4n + 1) { grid-column:span 7; transform:rotate(-1.2deg); }
	.gallery-item:nth-child(4n + 2) { grid-column:span 4; margin-top:clamp(5rem,9vw,9rem); transform:rotate(1.7deg); }
	.gallery-item:nth-child(4n + 3) { grid-column:2 / span 4; transform:rotate(.9deg); }
	.gallery-item:nth-child(4n) { grid-column:span 6; margin-top:clamp(3rem,6vw,6rem); transform:rotate(-1.6deg); }
	.gallery-item:hover { transform:rotate(-.4deg) translateY(-8px); box-shadow:0 2.8rem 6rem rgba(0,0,0,.8); z-index:3; }
	.gallery-item::before,.gallery-item::after { content:''; position:absolute; z-index:5; width:clamp(5rem,9vw,8.5rem); height:clamp(1.25rem,2.2vw,2rem); background:rgba(120,106,78,.58); box-shadow:0 1px 1px rgba(0,0,0,.32); pointer-events:none; backdrop-filter:blur(1px); }
	.gallery-item::before { left:8%; top:-.65rem; transform:rotate(-6deg); }
	.gallery-item::after { right:7%; top:-.45rem; transform:rotate(7deg); }
	.gallery-item:nth-child(3n + 2)::before { left:50%; transform:translateX(-50%) rotate(3deg); }
	.gallery-item:nth-child(3n + 2)::after { display:none; }

	.gallery-media {
		position: relative;
		aspect-ratio:16/10;
		border-radius: 0;
		overflow: hidden;
		border:0;
		background: #12110f;
	}
	.gallery-item:nth-child(3n + 2) .gallery-media { aspect-ratio:4/5; }
	.gallery-item:nth-child(3n) .gallery-media { aspect-ratio:1/1; }

	.gallery-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
	}

	.gallery-item:hover .gallery-media img {
		transform: scale(1.04);
	}

	.gallery-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background:linear-gradient(135deg,#050505 0 28%,#17100c 44%,#5b3b26 62%,#100d0b 82%,#020202 100%);
	}
	.gallery-item:nth-child(3n + 2) .gallery-placeholder { background:radial-gradient(circle at 67% 27%,#a86f45 0 3%,#4a2e1d 12%,#15100c 38%,#030303 72%); }
	.gallery-item:nth-child(3n) .gallery-placeholder { background:linear-gradient(118deg,#020304 0 35%,#152027 36% 48%,#a06a35 49% 51%,#111a20 52% 72%,#020202 73%); }
	.gallery-item:nth-child(4n) .gallery-placeholder { background:linear-gradient(90deg,#050505 0 19%,#342d26 20% 22%,#0a0a0a 23% 48%,#7c715f 49% 51%,#0b0b0b 52% 78%,#29231e 79% 81%,#030303 82%); }

	.gallery-num {
		font-size:clamp(8rem,24vw,24rem);
		font-weight: 900;
		letter-spacing:-.08em;
		opacity:.08;
	}

	.gallery-hover {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top,rgba(0,0,0,.88),transparent 60%);
		display: flex;
		justify-content:space-between;
		align-items:flex-start;
		padding:1rem;
		opacity: 0;
		transition: opacity 0.3s ease;
		color:#eeeae2;
		font:600 .48rem 'JetBrains Mono',monospace;
		letter-spacing:.16em;
	}

	.gallery-item:hover .gallery-hover {
		opacity: 1;
	}

	.gallery-count { color:var(--accent-color); font:600 .55rem 'JetBrains Mono',monospace; }
	.gallery-caption { position:absolute; z-index:2; left:clamp(.8rem,1.5vw,1.4rem); right:clamp(.8rem,1.5vw,1.4rem); bottom:clamp(.75rem,1.5vw,1.4rem); display:flex; justify-content:space-between; align-items:flex-end; gap:2rem; padding-top:.75rem; border-top:1px solid #343434; color:#dedad2; pointer-events:none; }
	.gallery-caption>div:first-child { display:flex; align-items:baseline; gap:1rem; }
	.gallery-caption h3 { color:#dedad2; font-family:Georgia,serif; font-style:italic; font-size:clamp(1.35rem,2.4vw,2.5rem); line-height:.9; font-weight:400; letter-spacing:-.035em; }
	.caption-meta { display:flex; flex-direction:column; align-items:flex-end; gap:.35rem; color:#77736c; font:500 .42rem 'JetBrains Mono',monospace; letter-spacing:.12em; text-transform:uppercase; }
	.view-all { width:100%; margin-top:clamp(1rem,3vw,3rem); padding:1.4rem 0; display:grid; grid-template-columns:1fr 1fr auto; align-items:center; border:0; border-top:1px solid #34322f; border-bottom:1px solid #34322f; background:transparent; color:#eeeae2; text-align:left; font:600 .55rem 'JetBrains Mono',monospace; letter-spacing:.16em; transition:color .2s ease,border-color .2s ease; }
	.view-all span:nth-child(2) { color:#716d66; }
	.view-all i { color:var(--accent-color); font-size:1.2rem; font-style:normal; }
	.view-all:hover,.view-all:focus-visible { color:var(--accent-color); border-color:var(--accent-color); outline:none; }

	/* Lightbox */
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lightbox-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0,0,0,0.92);
		border: none;
		cursor: none;
	}

	.lightbox-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		max-width: 80vw;
		max-height: 90vh;
	}
	@media(max-width:760px){.contact-meta{gap:1rem;align-items:flex-start}.contact-meta span:last-child{text-align:right}.gallery{display:flex;flex-direction:column;gap:6rem;padding:5rem .5rem 7rem}.gallery-item,.gallery-item:nth-child(n){width:94%;margin:0;align-self:flex-start;transform:rotate(-1.5deg)}.gallery-item:nth-child(even){width:82%;align-self:flex-end;transform:rotate(2deg)}.gallery-caption{gap:.75rem}.gallery-caption h3{font-size:1.5rem}.caption-meta span:last-child{display:none}.view-all{grid-template-columns:1fr auto}.view-all span:nth-child(2){display:none}.photo-archive{padding-top:2rem}.lightbox-prev{left:.75rem}.lightbox-next{right:.75rem}.lightbox-close{top:1rem;right:1rem}}

	.lightbox-media {
		max-height: 70vh;
		border-radius: 4px;
		overflow: hidden;
	}

	.lightbox-media img {
		max-height: 70vh;
		max-width: 80vw;
		object-fit: contain;
	}

	.lightbox-placeholder {
		width: 40vw;
		height: 50vh;
		background: var(--surface);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lightbox-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}

	.lightbox-num {
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		color: var(--text-dim);
		font-family: 'JetBrains Mono', monospace;
	}

	.lightbox-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text);
	}

	.lightbox-desc {
		font-size: 0.8rem;
		color: var(--text-dim);
		max-width: 40ch;
	}

	.lightbox-prev,
	.lightbox-next,
	.lightbox-close {
		position: absolute;
		background: none;
		border: 1px solid var(--border);
		color: var(--text);
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: none;
		transition: all 0.2s ease;
		z-index: 2;
	}

	.lightbox-prev:hover,
	.lightbox-next:hover,
	.lightbox-close:hover {
		background: var(--text);
		color: var(--bg);
	}

	.lightbox-prev { left: 2rem; top: 50%; transform: translateY(-50%); }
	.lightbox-next { right: 2rem; top: 50%; transform: translateY(-50%); }
	.lightbox-close { top: 2rem; right: 2rem; }
</style>
