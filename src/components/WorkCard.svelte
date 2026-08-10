<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { resolve } from '$app/paths';

	let { project, index = 0 }: { project: Project; index?: number } = $props();

	const disciplineColors: Record<string, string> = {
		engineering: '#00d4ff',
		design: '#ff6b9d',
		film: '#ff6b35',
		art: '#a855f7',
		photography: '#f59e0b',
		marketing: '#10b981'
	};

	const gradients: Record<string, string> = {
		engineering: 'linear-gradient(135deg, #0a0f1e 0%, #001a33 50%, #003366 100%)',
		design: 'linear-gradient(135deg, #1a0a1e 0%, #33001a 50%, #660033 100%)',
		film: 'linear-gradient(135deg, #1a0f0a 0%, #331a00 50%, #663300 100%)',
		art: 'linear-gradient(135deg, #110a1e 0%, #1e0033 50%, #3d0066 100%)',
		photography: 'linear-gradient(135deg, #1a1a0a 0%, #333300 50%, #4d4d00 100%)',
		marketing: 'linear-gradient(135deg, #0a1a0f 0%, #00331a 50%, #006633 100%)'
	};

	const color = $derived(disciplineColors[project.discipline] || '#c8ff00');
	const gradient = $derived(gradients[project.discipline] || 'linear-gradient(135deg, #0a0a0a, #1a1a1a)');
</script>

<article
	class="work-card"
	style="animation-delay: {index * 0.1}s"
	data-cursor="View →"
>
	<a href={resolve('/work/[slug]', { slug: project.slug })} class="card-link">
		<div class="card-media" style="background: {gradient}">
			{#if project.media}
				<img src={project.media} alt={project.title} loading="lazy" />
			{:else}
				<div class="card-placeholder">
					<span class="placeholder-icon" style="color: {color}">
						{project.discipline === 'engineering' ? '</>' :
						 project.discipline === 'film' ? '▶' :
						 project.discipline === 'photography' ? '◎' : '✦'}
					</span>
				</div>
			{/if}

			<div class="card-overlay">
				<div class="card-info">
					<div class="card-tags">
						{#each project.tags.slice(0, 2) as tag (tag)}
							<span class="tag">{tag}</span>
						{/each}
					</div>
					<h3 class="card-title">{project.title}</h3>
					<p class="card-desc">{project.description}</p>
				</div>
				<div class="card-footer">
					<span class="card-discipline" style="color: {color}">{project.discipline}</span>
					<span class="card-year">{project.year}</span>
				</div>
			</div>
		</div>

		<div class="card-bottom">
			<span class="card-title-small">{project.title}</span>
			<span class="card-arrow" style="color: {color}">→</span>
		</div>
	</a>
</article>

<style>
	/* initial state set by GSAP scrollReveal action in WorkGrid */
	.work-card {
		opacity: 0;
	}

	.card-link {
		display: block;
		text-decoration: none;
	}

	.card-media {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid var(--border);
	}

	.card-media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.card-link:hover .card-media img {
		transform: scale(1.04);
	}

	.card-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder-icon {
		font-size: 3rem;
		opacity: 0.3;
	}

	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.card-link:hover .card-overlay {
		opacity: 1;
	}

	.card-info {
		transform: translateY(8px);
		transition: transform 0.3s ease;
	}

	.card-link:hover .card-info {
		transform: translateY(0);
	}

	.card-tags {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.tag {
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: rgba(255,255,255,0.1);
		padding: 0.2rem 0.5rem;
		border-radius: 2px;
		color: var(--text-dim);
	}

	.card-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 0.4rem;
	}

	.card-desc {
		font-size: 0.75rem;
		color: var(--text-dim);
		line-height: 1.5;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}

	.card-discipline {
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.card-year {
		font-size: 0.65rem;
		color: var(--muted);
		font-family: 'JetBrains Mono', monospace;
	}

	.card-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0 0;
	}

	.card-title-small {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-dim);
		letter-spacing: 0.02em;
	}

	.card-arrow {
		font-size: 0.9rem;
		transition: transform 0.2s ease;
	}

	.card-link:hover .card-arrow {
		transform: translateX(4px);
	}
</style>
