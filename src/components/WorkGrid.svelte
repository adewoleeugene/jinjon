<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import WorkCard from './WorkCard.svelte';
	import { scrollReveal } from '$lib/utils/gsap';

	let { projects }: { projects: Project[] } = $props();
</script>

<!-- GSAP stagger-reveals each WorkCard as the grid enters the viewport -->
<div class="work-grid" use:scrollReveal={{ selector: '.work-card' }}>
	{#each projects as project, i (project.id)}
		<WorkCard {project} index={i} />
	{/each}
</div>

<style>
	.work-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	@media (min-width: 900px) {
		.work-grid :global(.work-card:first-child) {
			grid-column: span 2;
		}

		.work-grid :global(.work-card:first-child .card-media) {
			aspect-ratio: 16 / 7;
		}
	}
</style>
