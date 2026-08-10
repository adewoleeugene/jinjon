<script lang="ts">
	import { fly } from 'svelte/transition';
	import { activeChapter } from '$lib/stores/activeChapter';
	import { browser } from '$app/environment';

	const destinations = [
		{ id: 'illustration-museum', activeId: 'art', number: '01', title: 'Illustration Museum' },
		{ id: 'the-build', activeId: 'engineering', number: '03', title: 'The Build' },
		{ id: 'chapter-design', activeId: 'design', number: '04', title: 'Design Studio' },
		{ id: 'chapter-film', activeId: 'film', number: '05', title: 'Film & Video' },
		{ id: 'chapter-photography', activeId: 'photography', number: '06', title: 'Photography' },
		{ id: 'chapter-marketing', activeId: 'marketing', number: '07', title: 'Marketing' }
	];

	function scrollTo(id: string) {
		if (!browser) return;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<nav class="nav">
	<div class="nav-inner">
		<a
			href="/"
			class="nav-name"
			data-cursor="Home"
			onclick={(e) => {
				e.preventDefault();
				if (browser) window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
		>
			<span class="name-text">Adewole</span>
			<span class="name-sub">Portfolio</span>
		</a>

		<div class="nav-chapters">
			{#each destinations as destination (destination.id)}
				<button
					class="chapter-dot"
					class:active={$activeChapter === destination.activeId}
					onclick={() => scrollTo(destination.id)}
					data-cursor={destination.number}
					title={destination.title}
				>
					<span class="dot-inner"></span>
					<span class="dot-label">{destination.number} {destination.title}</span>
				</button>
			{/each}
		</div>

		<a href="mailto:eng@christex.foundation" class="nav-cta" data-cursor="Email">
			Let's talk
		</a>
	</div>
</nav>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 1.5rem 2.5rem;
		background: rgba(0, 0, 0, 0.96);
	}

	.nav-inner {
		width: min(100%, 1600px);
		max-width: 1600px;
		margin-inline: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-name {
		display: flex;
		flex-direction: column;
		line-height: 1;
	}

	.name-text {
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--text);
	}

	.name-sub {
		font-size: 0.6rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-dim);
		margin-top: 2px;
	}

	.nav-chapters {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.chapter-dot {
		background: none;
		border: none;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0;
	}

	.dot-inner {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		border: 1px solid var(--muted);
		transition: all 0.3s ease;
	}

	.chapter-dot.active .dot-inner,
	.chapter-dot:hover .dot-inner {
		background: var(--accent);
		border-color: var(--accent);
		box-shadow: 0 0 8px var(--accent);
	}

	.dot-label {
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-dim);
		opacity: 0;
		transform: translateX(-4px);
		transition: all 0.2s ease;
		pointer-events: none;
		white-space: nowrap;
	}

	.chapter-dot:hover .dot-label,
	.chapter-dot.active .dot-label {
		opacity: 1;
		transform: translateX(0);
		color: var(--text);
	}

	.nav-cta {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
		border: 1px solid rgba(200, 255, 0, 0.3);
		padding: 0.5rem 1rem;
		border-radius: 2px;
		transition: all 0.2s ease;
	}

	.nav-cta:hover {
		background: var(--accent);
		color: var(--bg);
	}

	@media (max-width: 768px) {
		.nav {
			padding: 1.25rem 1.5rem;
		}

		.nav-chapters {
			display: none;
		}
	}
</style>
