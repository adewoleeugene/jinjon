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

<div class="gallery">
	{#each projects as project, i (project.id)}
		<button
			class="gallery-item"
			onclick={() => openLightbox(i)}
			data-cursor="Open"
			style="--accent-color: {accentColor}"
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
					<span class="gallery-item-title">{project.title}</span>
				</div>
			</div>
		</button>
	{/each}
</div>

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
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.gallery-item {
		background: none;
		border: none;
		padding: 0;
		display: block;
		cursor: none;
	}

	.gallery-media {
		position: relative;
		aspect-ratio: 3 / 4;
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid var(--border);
		background: var(--surface);
	}

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
		background: linear-gradient(135deg, #0a0a0a, #111111);
	}

	.gallery-num {
		font-size: 3rem;
		font-weight: 900;
		opacity: 0.4;
	}

	.gallery-hover {
		position: absolute;
		inset: 0;
		background: rgba(0,0,0,0.6);
		display: flex;
		align-items: flex-end;
		padding: 1rem;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.gallery-item:hover .gallery-hover {
		opacity: 1;
	}

	.gallery-item-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text);
	}

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
