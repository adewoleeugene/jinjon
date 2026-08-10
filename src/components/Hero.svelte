<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const disciplines = ['Creative Director', 'Creative Technologist', 'Storyteller'];
	const name = 'ADEWOLE EUGENE JOHN';

	let chars = $state<string[]>([]);
	let bodyVisible = $state(false);
	let scrollHint = $state(false);

	const slides = [
		{ src: '/media/Character.png', scale: 1 },
		{ src: '/media/Character2.png', scale: 1 },
		{ src: '/media/Character3.png', scale: 1.4 },
		{ src: '/media/Character4.png', scale: 1 }
	];
	let slide = $state(0);

	type WordGroup = { chars: string[]; offset: number };

	// Group progressive chars into word-spans so the browser can't break mid-word
	const wordGroups = $derived.by((): WordGroup[] => {
		const groups: WordGroup[] = [];
		let current: string[] = [];
		let wordStart = 0;
		for (let i = 0; i < chars.length; i++) {
			if (chars[i] === ' ') {
				if (current.length) groups.push({ chars: current, offset: wordStart });
				current = [];
				wordStart = i + 1;
			} else {
				current.push(chars[i]);
			}
		}
		if (current.length) groups.push({ chars: current, offset: wordStart });
		return groups;
	});

	onMount(() => {
		if (!browser) return;

		const nameChars = name.split('');
		let i = 0;
		const interval = setInterval(() => {
			if (i < nameChars.length) {
				chars = nameChars.slice(0, i + 1);
				i++;
			} else {
				clearInterval(interval);
				setTimeout(() => { bodyVisible = true; }, 150);
				setTimeout(() => { scrollHint = true; }, 700);
			}
		}, 45);

		const slideTimer = setInterval(() => {
			slide = (slide + 1) % slides.length;
		}, 4000);

		return () => {
			clearInterval(interval);
			clearInterval(slideTimer);
		};
	});
</script>

<section class="hero" id="hero">
	<div class="hero-content">

		<h1 class="hero-name" aria-label={name}>
			{#each wordGroups as group, wi (wi)}<!--
				--><span class="word">{#each group.chars as char, ci (group.offset + ci)}<span class="char">{char}</span>{/each}</span><!--
				-->{#if wi < wordGroups.length - 1}<span class="word-space"> </span>{/if}<!--
			-->{/each}<span class="cursor-blink">_</span>
		</h1>

		<div class="hero-body" class:visible={bodyVisible}>

			<p class="hero-tagline">
				<span class="tagline-script">Design</span>
				Beyond<br />
				<span class="tagline-screens">Screens</span>
			</p>

			<div class="hero-figure">
				{#each slides as s, i (s.src)}
					<div class="hero-slide" class:active={i === slide} style="--s:{s.scale}">
						<img src={s.src} alt="Illustrated character" />
					</div>
				{/each}
			</div>

			<p class="hero-desc">
				Creating thoughtful systems and<br />
				digital experiences for modern culture.
			</p>

			<div class="hero-ctas">
				<a
					href="#the-build"
					class="hero-cta"
					data-cursor="View"
					onclick={(e) => {
						e.preventDefault();
						document.getElementById('the-build')?.scrollIntoView({ behavior: 'smooth' });
					}}
				>[ View Systems ]</a>
				<a
					href="#chapter-design"
					class="hero-cta"
					data-cursor="Read"
					onclick={(e) => {
						e.preventDefault();
						document.getElementById('chapter-design')?.scrollIntoView({ behavior: 'smooth' });
					}}
				>[ Read Notes ]</a>
			</div>


		</div>
	</div>

	<div class="hero-footer">
		<div class="scroll-hint" class:visible={scrollHint}>
			<span class="scroll-label">Scroll</span>
			<div class="scroll-line">
				<div class="scroll-line-inner"></div>
			</div>
		</div>
		<div class="hero-building" class:visible={bodyVisible}>
			<span class="building-label">Currently building:</span>
			<span class="building-items">
				<span>Lyv</span>
				<span class="building-sep">//</span>
				<span>AI Workshops</span>
				<span class="building-sep">/</span>
				<span>Participation Infrastructure</span>
			</span>
		</div>
	</div>

	<div class="hero-name-side" class:visible={bodyVisible}>{name}</div>

	<div class="hero-disciplines" class:visible={bodyVisible}>
		{#each disciplines as d, i (i)}
			<span class="discipline" style="animation-delay: {i * 0.07}s">{d}</span>
			{#if i < disciplines.length - 1}
				<span class="discipline-sep">/</span>
			{/if}
		{/each}
	</div>
</section>

<style>
	.hero {
		position: relative;
		--side-rail-height: clamp(20rem, 63vh, 34rem);
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem 2.5rem;
		overflow: hidden;
		background: var(--bg);
	}

	.hero > * {
		position: relative;
		z-index: 1;
	}

	.hero-content {
		max-width: 900px;
		margin-inline: auto;
		text-align: center;
	}

	/* ── Name ─────────────────────────────── */
	.hero-name {
		display: none;
		font-size: clamp(0.75rem, 1vw, 1rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-dim);
		margin-bottom: 1.5rem;
		word-break: normal;
		overflow-wrap: normal;
	}

	/* each word is a non-breaking inline block */
	.word {
		display: inline-block;
		white-space: nowrap;
	}

	.word-space {
		display: inline-block;
		min-width: 0.35em;
	}

	.char {
		display: inline-block;
		animation: charIn 0.3s ease forwards;
	}

	@keyframes charIn {
		from { opacity: 0; transform: translateY(16px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.cursor-blink {
		display: inline-block;
		color: var(--accent);
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0; }
	}

	/* ── Body — stacked ───────────────────── */
	.hero-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.7s ease, transform 0.7s ease;
	}

	.hero-body.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-tagline {
		font-size: clamp(3.5rem, 9.5vw, 10.5rem);
		font-weight: 900;
		line-height: 0.82;
		letter-spacing: -0.01em;
		text-transform: uppercase;
		color: var(--text);
		white-space: nowrap;
	}

	.hero-figure {
		position: relative;
		z-index: 2;
		width: min(400px, 62vw);
		height: 38vh;
		margin: clamp(-7rem, -7vw, -3.5rem) auto 0;
	}

	.hero-slide {
		position: absolute;
		inset: 0;
		opacity: 0;
		transform: translateX(-45%) scale(var(--s, 1));
		transform-origin: center bottom;
		transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
		pointer-events: none;
	}

	.hero-slide.active {
		opacity: 1;
		transform: translateX(0) scale(var(--s, 1));
		pointer-events: auto;
	}

	.hero-slide img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
	}

	.tagline-script {
		display: block;
		font-family: 'Playfair Display', serif;
		font-style: italic;
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
		color: var(--accent);
		margin-bottom: -0.15em;
		position: relative;
		z-index: 1;
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
		transform: rotate(-4deg);
	}

	.tagline-screens {
		letter-spacing: -0.09em;
	}

	.hero-desc {
		font-size: clamp(1.25rem, 1.8vw, 1.7rem);
		line-height: 1.4;
		color: var(--text-dim);
		max-width: 52ch;
	}

	.hero-ctas {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.hero-cta {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--text);
		border: 1px solid var(--border);
		padding: 0.6rem 1.1rem;
		border-radius: 2px;
		transition: all 0.2s ease;
		font-family: 'JetBrains Mono', monospace;
	}

	.hero-cta:hover {
		border-color: var(--accent);
		color: var(--accent);
		background: rgba(200, 255, 0, 0.05);
	}

	.hero-building {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		opacity: 0;
		transition: opacity 0.6s ease 0.4s;
	}

	.hero-building.visible { opacity: 1; }

	.building-label {
		font-size: 0.6rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-dim);
		white-space: nowrap;
	}

	.building-items {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.7rem;
		color: var(--text);
		letter-spacing: 0.05em;
	}

	.building-sep {
		color: var(--accent);
		font-size: 0.65rem;
	}

	/* ── Footer ───────────────────────────── */
	.hero-footer {
		position: absolute;
		bottom: 2.5rem;
		left: 2.5rem;
		right: 2.5rem;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.scroll-hint {
		display: flex;
		align-items: center;
		gap: 1rem;
		opacity: 0;
		transition: opacity 0.6s ease;
	}

	.scroll-hint.visible { opacity: 1; }

	.scroll-label {
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-dim);
	}

	.scroll-line {
		width: 3rem;
		height: 1px;
		background: var(--border);
		overflow: hidden;
	}

	.scroll-line-inner {
		height: 100%;
		width: 100%;
		background: var(--accent);
		animation: scrollAnim 2s ease-in-out infinite;
	}

	@keyframes scrollAnim {
		0%   { transform: scaleX(0); transform-origin: left; }
		50%  { transform: scaleX(1); transform-origin: left; }
		51%  { transform-origin: right; }
		100% { transform: scaleX(0); transform-origin: right; }
	}

	.hero-disciplines {
		position: absolute;
		right: 2.5rem;
		top: 50%;
		height: var(--side-rail-height);
		transform: translateY(-50%);
		writing-mode: vertical-rl;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0;
		opacity: 0;
		transition: opacity 0.6s ease 0.3s;
	}

	.hero-disciplines.visible { opacity: 1; }

	.hero-name-side {
		position: absolute;
		left: 2.5rem;
		top: 50%;
		height: var(--side-rail-height);
		transform: translateY(-50%);
		writing-mode: vertical-rl;
		font-size: 0.8rem;
		line-height: 1;
		letter-spacing: clamp(0.8em, 1.7vh, 1.45em);
		white-space: nowrap;
		text-transform: uppercase;
		color: var(--accent);
		opacity: 0;
		transition: opacity 0.6s ease 0.3s;
	}

	.hero-name-side.visible { opacity: 1; }

	.discipline {
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		white-space: nowrap;
		text-transform: uppercase;
		color: var(--accent);
		animation: disciplineIn 0.4s ease both;
		text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8);
	}

	@keyframes disciplineIn {
		from { opacity: 0; }
		to   { opacity: 1; }
	}

	.discipline-sep {
		color: var(--border);
		font-size: 0.6rem;
	}

	@media (max-width: 768px) {
		.hero { padding: 6rem 1.5rem 5rem; }

		.hero-footer {
			left: 1.5rem;
			right: 1.5rem;
			flex-direction: column-reverse;
			align-items: flex-start;
			gap: 1rem;
			bottom: 1.5rem;
		}

		.hero-disciplines,
		.hero-name-side { display: none; }
	}
</style>
