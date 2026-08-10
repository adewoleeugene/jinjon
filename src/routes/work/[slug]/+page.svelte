<script lang="ts">
	import type { PageData } from './$types';
	import { chapters } from '$lib/data/projects';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	const disciplineColors: Record<string, string> = {
		engineering: '#00d4ff',
		design: '#ff6b9d',
		film: '#ff6b35',
		art: '#a855f7',
		photography: '#f59e0b',
		marketing: '#10b981'
	};

	const project = $derived(data.project);
	const chapter = $derived(chapters.find((c) => c.id === project.discipline));
	const color = $derived(disciplineColors[project.discipline] || '#c8ff00');
</script>

<svelte:head>
	<title>{project.title} — Your Name</title>
	<meta name="description" content={project.description} />
</svelte:head>

<div class="project-page">
	<header class="project-header">
		<a href={resolve('/')} class="back-link" data-cursor="Back">
			<span>←</span>
			<span>Back</span>
		</a>

		<div class="project-meta">
			<span class="project-discipline" style="color: {color}">
				{chapter?.number} — {project.discipline}
			</span>
			<span class="project-year" style="font-family: 'JetBrains Mono', monospace">{project.year}</span>
		</div>
	</header>

	<div class="project-hero">
		<h1 class="project-title">{project.title}</h1>
		<p class="project-desc">{project.description}</p>

		<div class="project-tags">
			{#each project.tags as tag (tag)}
				<span class="project-tag">{tag}</span>
			{/each}
		</div>
	</div>

	<div class="project-media">
		{#if project.media}
			{#if project.mediaType === 'video'}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={project.media} controls class="project-video"></video>
			{:else}
				<img src={project.media} alt={project.title} class="project-image" />
			{/if}
		{:else}
			<div class="project-placeholder" style="background: linear-gradient(135deg, #0a0a0a, {color}22)">
				<span style="color: {color}; font-size: 4rem; opacity: 0.3">✦</span>
				<p style="color: var(--text-dim); margin-top: 1rem; font-size: 0.8rem">Media coming soon</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.project-page {
		min-height: 100vh;
		padding: 2rem 2.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 5rem;
		margin-bottom: 4rem;
	}

	.back-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-dim);
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--accent);
	}

	.project-meta {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.project-discipline {
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.project-year {
		font-size: 0.65rem;
		color: var(--text-dim);
		letter-spacing: 0.1em;
	}

	.project-hero {
		margin-bottom: 4rem;
	}

	.project-title {
		font-size: clamp(3rem, 8vw, 7rem);
		font-weight: 900;
		letter-spacing: -0.03em;
		line-height: 1;
		color: var(--text);
		margin-bottom: 1.5rem;
	}

	.project-desc {
		font-size: 1.1rem;
		color: var(--text-dim);
		line-height: 1.7;
		max-width: 60ch;
		margin-bottom: 2rem;
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.project-tag {
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 0.35rem 0.75rem;
		border-radius: 2px;
		color: var(--text-dim);
	}

	.project-media {
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid var(--border);
	}

	.project-image {
		width: 100%;
		display: block;
	}

	.project-video {
		width: 100%;
		display: block;
	}

	.project-placeholder {
		aspect-ratio: 16 / 9;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.project-page {
			padding: 1.5rem;
		}
	}
</style>
