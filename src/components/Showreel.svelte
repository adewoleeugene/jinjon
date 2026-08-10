<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { resolve } from '$app/paths';

	let { projects }: { projects: Project[] } = $props();

	let playing = $state(false);

	function togglePlay() {
		playing = !playing;
	}
</script>

<div class="showreel">
	<div class="reel-hero" data-cursor={playing ? 'Pause ⏸' : 'Play ▶'}>
		<button class="reel-bg" onclick={togglePlay} aria-label={playing ? 'Pause showreel' : 'Play showreel'}>
			<div class="reel-gradient"></div>
			<div class="play-btn" class:playing>
				<span class="play-icon">{playing ? '⏸' : '▶'}</span>
			</div>
			<div class="reel-label">
				<span class="reel-title">Showreel</span>
				<span class="reel-year">2024</span>
			</div>
		</button>
	</div>

	{#if projects.length > 1}
		<div class="reel-projects">
			{#each projects.slice(1) as project, i (project.id)}
				<a href={resolve('/work/[slug]', { slug: project.slug })} class="reel-card" data-cursor="View →">
					<div class="reel-card-media" style="background: linear-gradient(135deg, #1a0f0a, #663300)">
						<span class="reel-card-num">0{i + 1}</span>
					</div>
					<div class="reel-card-info">
						<span class="reel-card-title">{project.title}</span>
						<span class="reel-card-tags">{project.tags.join(' · ')}</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.showreel {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.reel-hero {
		position: relative;
	}

	.reel-bg {
		width: 100%;
		aspect-ratio: 16 / 7;
		border-radius: 4px;
		border: 1px solid var(--border);
		overflow: hidden;
		position: relative;
		background: #0d0d0d;
		cursor: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.reel-gradient {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%);
	}

	.play-btn {
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		border: 1px solid rgba(255, 107, 53, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		position: relative;
		z-index: 1;
	}

	.reel-bg:hover .play-btn {
		background: var(--accent-warm);
		border-color: var(--accent-warm);
		transform: scale(1.1);
	}

	.play-icon {
		font-size: 1.5rem;
		color: var(--text);
	}

	.reel-label {
		position: absolute;
		bottom: 1.5rem;
		left: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.reel-title {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text);
		letter-spacing: -0.02em;
	}

	.reel-year {
		font-size: 0.65rem;
		color: var(--text-dim);
		font-family: 'JetBrains Mono', monospace;
		letter-spacing: 0.1em;
	}

	.reel-projects {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 1rem;
	}

	.reel-card {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		transition: border-color 0.2s ease;
	}

	.reel-card:hover {
		border-color: var(--accent-warm);
	}

	.reel-card-media {
		width: 4rem;
		height: 3rem;
		border-radius: 2px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.reel-card-num {
		font-size: 0.7rem;
		font-weight: 700;
		color: rgba(255, 107, 53, 0.6);
		font-family: 'JetBrains Mono', monospace;
	}

	.reel-card-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.reel-card-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text);
	}

	.reel-card-tags {
		font-size: 0.65rem;
		color: var(--text-dim);
		letter-spacing: 0.05em;
	}
</style>
