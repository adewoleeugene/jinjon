<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { inView } from '$lib/utils/inView';
	import { scrollReveal, parallax } from '$lib/utils/gsap';
	import { activeChapter } from '$lib/stores/activeChapter';

	let {
		id,
		number,
		title,
		tagline,
		children
	}: {
		id: string;
		number: string;
		title: string;
		tagline: string;
		children?: import('svelte').Snippet;
	} = $props();

	let headerVisible = $state(false);
</script>

<section
	class="chapter"
	id="chapter-{id}"
	data-chapter={id}
	use:inView={{ threshold: 0.35, once: false, onEnter: () => activeChapter.set(id) }}
>
	<!-- Header reveals with Svelte fly transition on scroll -->
	<div
		class="chapter-header"
		use:inView={{ threshold: 0.2, onEnter: () => { headerVisible = true; } }}
	>
		{#if headerVisible}
			<div class="chapter-meta" in:fly={{ x: -20, duration: 600, easing: cubicOut }}>
				<span class="chapter-num">{number}</span>
				<div class="chapter-divider"></div>
			</div>
			<div class="chapter-titles" in:fly={{ y: 30, duration: 700, delay: 80, easing: cubicOut }}>
				<h2 class="chapter-title">{title}</h2>
				<p class="chapter-tagline">{tagline}</p>
			</div>
		{/if}
	</div>

	<!-- Body: GSAP stagger-reveals all direct children -->
	<div class="chapter-body" use:scrollReveal={{ selector: ':scope > *', delay: 0.1 }}>
		{@render children?.()}
	</div>

	<!-- Ghost number parallaxes slower than content -->
	<div class="chapter-bg-num chapter-number" use:parallax={{ speed: 0.15 }}>{number}</div>
</section>

<style>
	.chapter {
		position: relative;
		padding: 8rem 2.5rem;
		min-height: 80vh;
		overflow: hidden;
	}

	.chapter-header {
		display: flex;
		align-items: flex-start;
		gap: 2rem;
		margin-bottom: 5rem;
		min-height: 9rem; /* reserve space before transition fires */
	}

	.chapter-meta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding-top: 0.5rem;
	}

	.chapter-num {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		color: var(--accent);
		font-family: 'JetBrains Mono', monospace;
	}

	.chapter-divider {
		width: 1px;
		height: 3rem;
		background: linear-gradient(to bottom, var(--accent), transparent);
	}

	.chapter-titles {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.chapter-title {
		font-size: clamp(2.5rem, 6vw, 5rem);
		font-weight: 900;
		letter-spacing: -0.02em;
		line-height: 1;
		color: var(--text);
	}

	.chapter-tagline {
		font-size: 0.9rem;
		color: var(--text-dim);
		letter-spacing: 0.05em;
		font-style: italic;
	}

	.chapter-body {
		position: relative;
		z-index: 1;
	}

	.chapter-bg-num {
		position: absolute;
		right: -1rem;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0.06;
		z-index: 0;
	}

	@media (max-width: 768px) {
		.chapter {
			padding: 5rem 1.5rem;
		}

		.chapter-header {
			flex-direction: column;
			gap: 1rem;
			min-height: auto;
		}

		.chapter-meta {
			flex-direction: row;
			align-items: center;
		}

		.chapter-divider {
			width: 2rem;
			height: 1px;
			background: linear-gradient(to right, var(--accent), transparent);
		}
	}
</style>
