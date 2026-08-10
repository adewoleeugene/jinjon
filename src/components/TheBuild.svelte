<script lang="ts">
	import type { BuildProduct } from '$lib/content/types';

	// "The Build" — the product-engineer world. Where the gallery is dreamy and
	// spatial, this is precise and structured: products shown as *living* demos in
	// device frames, not screenshots. Placeholder content + interactions for now;
	// real product URLs / prototypes swap into each device screen later.

	let { products }: { products: BuildProduct[] } = $props();

	// ── tiny interactive mocks so each device feels alive ──
	let reactions = $state<{ emoji: string; n: number }[]>([
		{ emoji: '🔥', n: 128 },
		{ emoji: '💚', n: 74 },
		{ emoji: '👏', n: 51 }
	]);
	function react(i: number) {
		reactions[i].n += 1;
	}

	const pollOptions = ['Ship it today', 'One more pass', 'Cut the scope'];
	let pollCounts = $state([42, 28, 12]);
	let pollVoted = $state<number | null>(null);
	function vote(i: number) {
		if (pollVoted !== null) return;
		pollCounts[i] += 1;
		pollVoted = i;
	}
	const pollTotal = $derived(pollCounts.reduce((a, b) => a + b, 0));

	let prompt = $state('a portfolio that feels like a place');
	let generated = $state(false);

	let activeIndex = $state(0);
	const activeProduct = $derived(products[activeIndex]);
</script>

<section class="build" id="the-build" aria-labelledby="build-title">
	<div class="grid-bg" aria-hidden="true"></div>
	<div class="scanlines" aria-hidden="true"></div>

	<header class="build-head">
		<p class="room-label">Room 03 <span>—</span> The Computer Lab</p>
		<div class="title-row">
			<div>
				<p class="eyebrow">AEJ Systems Archive / Est. 2026</p>
				<h2 id="build-title">The Build<span class="cursor">_</span></h2>
			</div>
			<p class="lede">
				Products I’ve helped shape — from first signal and prototype to systems people use.
			</p>
		</div>
	</header>

	{#if activeProduct}
	<div class="terminal-shell">
		<div class="terminal-bar">
			<div class="terminal-brand"><span class="power"></span> AEJ—OS</div>
			<div class="terminal-status">SYSTEMS ONLINE: 0{products.length} / MEMORY OK</div>
			<div class="terminal-clock">ARCHIVE MODE</div>
		</div>

		<div class="terminal-grid">
			<nav class="system-index" aria-label="Product archive">
				<p class="panel-label">/ PRODUCT_INDEX</p>
				<div class="index-list">
					{#each products as p, i (p.id)}
						<button
							type="button"
							class="index-item"
							class:active={activeIndex === i}
							onclick={() => (activeIndex = i)}
							aria-pressed={activeIndex === i}
						>
							<span class="index-num">0{i + 1}</span>
							<span class="index-copy">
								<strong>{p.title}</strong>
								<small>{p.tags[0]} system</small>
							</span>
							<span class="index-arrow">{activeIndex === i ? '▶' : '·'}</span>
						</button>
					{/each}
				</div>
				<div class="index-foot">
					<span>Use index to load record</span>
					<span class="blink">█</span>
				</div>
			</nav>

			<article class="active-system">
				<div class="record-head">
					<div>
						<p class="record-id">SYSTEM_RECORD / 0{activeIndex + 1}</p>
						<h3>{activeProduct.title}</h3>
					</div>
					<div class="record-state"><span></span> Loaded</div>
				</div>

				<div class="device">
					<div class="chrome" aria-hidden="true">
						<span class="machine-key">F1</span>
						<span class="addr">C:\AEJ\PRODUCTS\{activeProduct.id.toUpperCase()}</span>
						<span class="live"><span class="live-dot"></span>Interactive preview</span>
					</div>
					<div class="screen demo-{activeProduct.demo}">
						{#if activeProduct.demo === 'reactions'}
							<div class="mock-head">Live now · 2,481 watching</div>
							<div class="mock-stage" aria-hidden="true"></div>
							<div class="react-row">
								{#each reactions as r, ri (ri)}
									<button type="button" class="react" onclick={() => react(ri)}>
										<span class="react-emoji">{r.emoji}</span>
										<span class="react-n">{r.n}</span>
									</button>
								{/each}
							</div>
						{:else if activeProduct.demo === 'prompt'}
							<div class="mock-head">Prompt → prototype</div>
							<input class="mock-input" bind:value={prompt} aria-label="Prompt" />
							<button type="button" class="mock-btn" onclick={() => (generated = true)}>
								Generate
							</button>
							{#if generated}
								<div class="mock-out">
									<span class="tick">✓</span> Scaffolded “{prompt}” — 3 files, ready to run.
								</div>
							{/if}
						{:else if activeProduct.demo === 'poll'}
							<div class="mock-head">Team pulse · live</div>
							<ul class="poll">
								{#each pollOptions as opt, oi (oi)}
									<li>
										<button
											type="button"
											class="poll-opt"
											class:voted={pollVoted === oi}
											disabled={pollVoted !== null}
											onclick={() => vote(oi)}
										>
											<span class="poll-bar" style="width:{(pollCounts[oi] / pollTotal) * 100}%"></span>
											<span class="poll-label">{opt}</span>
											<span class="poll-pct">{Math.round((pollCounts[oi] / pollTotal) * 100)}%</span>
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>

				<div class="record-info">
					<div class="record-primary">
						<p class="tagline">{activeProduct.tagline}</p>
						<p class="desc">{activeProduct.description}</p>
					</div>
					<dl class="specs">
						<div><dt>Classification</dt><dd>{activeProduct.tags[0]}</dd></div>
						<div><dt>Disciplines</dt><dd>{activeProduct.tags.slice(1).join(' / ')}</dd></div>
						<div><dt>Record status</dt><dd>Case study pending</dd></div>
					</dl>
				</div>

				<div class="record-foot">
					<ul class="tags">
						{#each activeProduct.tags as t (t)}<li>{t}</li>{/each}
					</ul>
					{#if activeProduct.url && activeProduct.url !== '#'}
						<a class="cta" href={activeProduct.url}>Open record <span aria-hidden="true">↗</span></a>
					{:else}
						<span class="cta muted">[ Full record coming soon ]</span>
					{/if}
				</div>
			</article>
		</div>
	</div>
	{:else}
		<div class="empty-archive">
			<p>NO PRODUCT RECORDS FOUND</p>
			<span>Add a record through the active content provider.</span>
		</div>
	{/if}
</section>

<style>
	.build {
		position: relative;
		padding: clamp(6rem, 12vw, 11rem) clamp(1.5rem, 5vw, 5rem);
		background: var(--bg);
		overflow: hidden;
	}

	/* faint technical grid — the engineer's precision */
	.grid-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 44px 44px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 40%, transparent 100%);
		pointer-events: none;
	}

	.build-head {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(20rem, 0.85fr);
		align-items: end;
		gap: clamp(2rem, 7vw, 8rem);
		padding-bottom: clamp(2.5rem, 5vw, 4.5rem);
		border-bottom: 1px solid rgba(232, 232, 232, 0.12);
	}

	.eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.66rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.build-head h2 {
		margin-top: 0.8rem;
		font-size: clamp(3rem, 8vw, 7rem);
		font-weight: 900;
		line-height: 0.9;
		text-transform: uppercase;
	}

	.head-note { padding-bottom: 0.35rem; }

	.edition {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-dim);
	}

	.edition span { color: var(--accent); margin-inline: 0.4rem; }

	.lede {
		margin-top: 1rem;
		max-width: 54ch;
		font-size: clamp(1.05rem, 1.5vw, 1.4rem);
		line-height: 1.55;
		color: var(--text-dim);
	}

	.products {
		position: relative;
		margin-top: clamp(3rem, 6vw, 5.5rem);
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		background: rgba(232, 232, 232, 0.12);
		border: 1px solid rgba(232, 232, 232, 0.12);
	}

	.product {
		position: relative;
		display: grid;
		grid-template-rows: auto 1fr;
		gap: clamp(2rem, 4vw, 3.5rem);
		padding: clamp(1.5rem, 3.5vw, 3.5rem);
		background: #060606;
	}

	.product.featured {
		grid-column: 1 / -1;
		grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.28fr);
		grid-template-rows: auto;
		align-items: center;
		min-height: 38rem;
	}

	/* ── device: browser frame ── */
	.device {
		border: 1px solid rgba(232, 232, 232, 0.14);
		border-radius: 10px;
		overflow: hidden;
		background: #0d0d0d;
		box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
	}

	.chrome {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0.6rem 0.9rem;
		background: #141414;
		border-bottom: 1px solid rgba(232, 232, 232, 0.08);
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #2c2c2c;
	}

	.addr {
		margin-left: 0.6rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.68rem;
		color: var(--text-dim);
	}

	.live {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.live-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 8px var(--accent);
		animation: livePulse 1.6s ease-in-out infinite;
	}

	@keyframes livePulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.35; }
	}

	/* the product screen — light, so it glows against the dark section */
	.screen {
		min-height: 260px;
		padding: 1.4rem;
		background: linear-gradient(180deg, #f7f7f4, #ecece7);
		color: #16160f;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.mock-head {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #6a6a5f;
	}

	.mock-stage {
		flex: 1;
		display: grid;
		place-items: center;
		border: 1px dashed rgba(0, 0, 0, 0.14);
		border-radius: 8px;
		font-size: 2.4rem;
		color: transparent;
		background: radial-gradient(circle at 50% 45%, rgba(0,0,0,0.05), transparent 60%);
		min-height: 120px;
	}

	.react-row { display: flex; gap: 0.7rem; }

	.react {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 0.9rem;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 999px;
		background: #fff;
		cursor: pointer;
		font: inherit;
		transition: transform 0.12s ease, border-color 0.12s ease;
	}
	.react:hover { transform: translateY(-2px); border-color: #16160f; }
	.react-emoji { font-size: 1.1rem; }
	.react-n { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 0.85rem; }

	.mock-input {
		padding: 0.7rem 0.9rem;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 8px;
		font: inherit;
		font-size: 0.9rem;
		background: #fff;
		color: #16160f;
	}
	.mock-btn {
		align-self: flex-start;
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 8px;
		background: #16160f;
		color: #f7f7f4;
		font: inherit;
		font-weight: 600;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.mock-out {
		font-size: 0.88rem;
		line-height: 1.5;
		color: #333;
		border-left: 2px solid #16160f;
		padding-left: 0.8rem;
	}
	.tick { color: #2e7d32; font-weight: 700; }

	.poll { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin: 0; padding: 0; }
	.poll-opt {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 8px;
		background: #fff;
		overflow: hidden;
		cursor: pointer;
		font: inherit;
		text-align: left;
	}
	.poll-opt:disabled { cursor: default; }
	.poll-bar {
		position: absolute;
		left: 0; top: 0; bottom: 0;
		background: rgba(120, 160, 0, 0.16);
		transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.poll-opt.voted .poll-bar { background: rgba(120, 160, 0, 0.32); }
	.poll-label { position: relative; font-size: 0.9rem; }
	.poll-pct { position: relative; margin-left: auto; font-variant-numeric: tabular-nums; font-weight: 600; font-size: 0.85rem; }

	/* ── meta column ── */
	.meta { display: flex; flex-direction: column; align-self: stretch; }

	.product-kicker {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(232, 232, 232, 0.1);
	}

	.num {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.status {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-dim);
	}
	.tagline {
		margin-top: 0.6rem;
		font-size: clamp(1.05rem, 1.6vw, 1.3rem);
		color: var(--text);
	}
	.desc {
		margin-top: 1rem;
		font-size: 0.98rem;
		line-height: 1.6;
		color: var(--text-dim);
		max-width: 42ch;
	}
	.tags {
		margin-top: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
	}

	.meta-foot {
		margin-top: auto;
		padding-top: 2rem;
	}
	.tags li {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-dim);
		border: 1px solid var(--border);
		padding: 0.3rem 0.6rem;
		border-radius: 3px;
	}
	.cta {
		display: inline-block;
		margin-top: 1.6rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease;
	}
	.cta:hover { border-color: var(--accent); }
	.cta.muted { color: var(--text-dim); border: 0; }

	@media (max-width: 900px) {
		.build-head { grid-template-columns: 1fr; align-items: start; gap: 1.5rem; }
		.products { grid-template-columns: 1fr; }
		.product,
		.product.featured {
			grid-column: auto;
			grid-template-columns: 1fr;
			grid-template-rows: auto auto;
			min-height: 0;
		}
	}

	@media (max-width: 560px) {
		.build { padding-inline: 1rem; }
		.product { padding: 1.25rem; }
		.screen { min-height: 260px; padding: 1rem; }
		.react-row { gap: 0.4rem; }
		.react { padding: 0.45rem 0.65rem; }
	}

	/* ── Systems archive / retro lab ───────────────────────── */
	.build {
		padding-top: clamp(5rem, 9vw, 8rem);
		background: var(--bg);
	}

	.scanlines {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.12;
		background: repeating-linear-gradient(to bottom, transparent 0 3px, rgba(0, 0, 0, 0.48) 4px);
		mix-blend-mode: multiply;
	}

	.build-head {
		display: block;
		padding-bottom: clamp(3rem, 6vw, 5rem);
		border: 0;
	}

	.room-label,
	.panel-label,
	.record-id,
	.terminal-bar,
	.index-item,
	.index-foot,
	.specs,
	.record-state {
		font-family: 'JetBrains Mono', monospace;
		text-transform: uppercase;
	}

	.room-label {
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(193, 255, 46, 0.25);
		font-size: 0.62rem;
		letter-spacing: 0.2em;
		color: var(--text-dim);
	}

	.room-label span { color: var(--accent); margin-inline: 0.5rem; }

	.title-row {
		display: grid;
		grid-template-columns: 1.25fr 0.75fr;
		gap: clamp(3rem, 8vw, 9rem);
		align-items: end;
		padding-top: clamp(2.5rem, 5vw, 4.5rem);
	}

	.build-head h2 { letter-spacing: -0.055em; }
	.cursor { color: var(--accent); animation: cursorBlink 1s steps(1) infinite; }
	@keyframes cursorBlink { 50% { opacity: 0; } }

	.terminal-shell {
		position: relative;
		border: 1px solid rgba(193, 255, 46, 0.35);
		background: rgba(5, 8, 3, 0.9);
		box-shadow: 0 0 0 5px #0b0d09, 0 0 0 6px rgba(232, 232, 232, 0.12), 0 40px 100px rgba(0, 0, 0, 0.75);
	}

	.empty-archive {
		position: relative;
		padding: clamp(3rem, 10vw, 8rem) 2rem;
		border: 1px solid rgba(193, 255, 46, 0.3);
		font-family: 'JetBrains Mono', monospace;
		text-align: center;
		color: var(--accent);
	}
	.empty-archive span {
		display: block;
		margin-top: 0.8rem;
		font-size: 0.62rem;
		color: var(--text-dim);
	}

	.terminal-bar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid rgba(193, 255, 46, 0.25);
		background: #11150d;
		font-size: 0.57rem;
		letter-spacing: 0.12em;
		color: #8e967e;
	}

	.terminal-brand { color: var(--accent); }
	.terminal-clock { text-align: right; }
	.power {
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-right: 0.45rem;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 10px var(--accent);
	}

	.terminal-grid {
		display: grid;
		grid-template-columns: minmax(15rem, 0.32fr) minmax(0, 1fr);
		min-height: 46rem;
	}

	.system-index {
		display: flex;
		flex-direction: column;
		border-right: 1px solid rgba(193, 255, 46, 0.2);
		background: rgba(193, 255, 46, 0.018);
	}

	.panel-label {
		padding: 1.1rem 1.25rem;
		border-bottom: 1px solid rgba(232, 232, 232, 0.09);
		font-size: 0.58rem;
		letter-spacing: 0.14em;
		color: #747b69;
	}

	.index-list { flex: 1; }
	.index-item {
		width: 100%;
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.9rem;
		align-items: start;
		padding: 1.35rem 1.25rem;
		border: 0;
		border-bottom: 1px solid rgba(232, 232, 232, 0.08);
		background: transparent;
		color: var(--text-dim);
		text-align: left;
		cursor: pointer;
		transition: background 0.2s ease, color 0.2s ease;
	}

	.index-item:hover { background: rgba(193, 255, 46, 0.04); color: var(--text); }
	.index-item.active {
		background: var(--accent);
		color: #0a0c07;
		box-shadow: 0 0 24px rgba(193, 255, 46, 0.12);
	}

	.index-num { font-size: 0.58rem; padding-top: 0.15rem; }
	.index-copy { display: flex; flex-direction: column; gap: 0.45rem; }
	.index-copy strong { font-size: 0.7rem; letter-spacing: 0.06em; line-height: 1.35; }
	.index-copy small { font-size: 0.5rem; letter-spacing: 0.1em; opacity: 0.65; }
	.index-arrow { font-size: 0.58rem; }

	.index-foot {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border-top: 1px solid rgba(232, 232, 232, 0.08);
		font-size: 0.48rem;
		letter-spacing: 0.1em;
		color: #616857;
	}
	.blink { color: var(--accent); animation: cursorBlink 0.8s steps(1) infinite; }

	.active-system { padding: clamp(1.25rem, 3.5vw, 3rem); min-width: 0; }
	.record-head {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 1.7rem;
	}
	.record-id { font-size: 0.55rem; letter-spacing: 0.14em; color: var(--accent); }
	.record-head h3 {
		margin-top: 0.45rem;
		font-size: clamp(2rem, 4vw, 4.5rem);
		line-height: 0.95;
		letter-spacing: -0.04em;
	}
	.record-state {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.52rem;
		letter-spacing: 0.12em;
		color: #78806d;
	}
	.record-state span { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 7px var(--accent); }

	.active-system .device {
		border-color: rgba(193, 255, 46, 0.22);
		border-radius: 2px;
		box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.2), 0 24px 60px rgba(0, 0, 0, 0.55);
	}
	.active-system .chrome { background: #171b12; border-color: rgba(193, 255, 46, 0.14); }
	.machine-key {
		padding: 0.15rem 0.3rem;
		border: 1px solid #48503e;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.5rem;
		color: var(--accent);
	}
	.active-system .screen { min-height: 310px; }

	.record-info {
		display: grid;
		grid-template-columns: 1fr 0.85fr;
		gap: clamp(2rem, 5vw, 5rem);
		padding: 2rem 0;
		border-bottom: 1px solid rgba(232, 232, 232, 0.09);
	}
	.record-primary .tagline { margin-top: 0; }
	.record-primary .desc { margin-top: 0.7rem; }
	.specs { display: grid; gap: 0.65rem; }
	.specs div { display: grid; grid-template-columns: 1fr 1.2fr; gap: 1rem; }
	.specs dt { font-size: 0.5rem; letter-spacing: 0.1em; color: #626958; }
	.specs dd { margin: 0; font-size: 0.55rem; letter-spacing: 0.06em; color: #afb5a5; }

	.record-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		padding-top: 1.4rem;
	}
	.record-foot .tags { margin: 0; }
	.record-foot .cta { margin: 0; white-space: nowrap; }

	@media (max-width: 900px) {
		.title-row { grid-template-columns: 1fr; gap: 1.5rem; }
		.terminal-grid { grid-template-columns: 1fr; }
		.system-index { border-right: 0; border-bottom: 1px solid rgba(193, 255, 46, 0.2); }
		.index-list { display: grid; grid-template-columns: repeat(3, 1fr); }
		.index-item { min-width: 0; }
		.index-foot { display: none; }
		.record-info { grid-template-columns: 1fr; gap: 1.5rem; }
	}

	@media (max-width: 640px) {
		.terminal-bar { grid-template-columns: 1fr auto; }
		.terminal-status { display: none; }
		.index-list { grid-template-columns: 1fr; }
		.index-item { padding-block: 1rem; }
		.active-system { padding: 1rem; }
		.record-head { gap: 1rem; }
		.record-state { display: none; }
		.active-system .screen { min-height: 260px; }
		.record-foot { align-items: flex-start; flex-direction: column; }
		.specs div { grid-template-columns: 1fr; gap: 0.25rem; }
	}
</style>
