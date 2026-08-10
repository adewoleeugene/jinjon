<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { Exhibit, ExhibitRoom } from '$lib/content/types';

	let { exhibits, rooms }: { exhibits: Exhibit[]; rooms: ExhibitRoom[] } = $props();

	const DOOR_Z = -280; // the entrance door stands just ahead of the camera
	const FOCUS_Z = -520; // camera-relative distance where a piece sits "in front of you"

	// L-shaped floor plan. The camera walks Room 01 (straight, along -Z), pivots
	// 90° left at the corner, then walks Room 02 (along -X).
	const CORNER_TRAVEL = 3000; // distance down Room 01 to the corner
	const TURN_LEN = 550;       // travel spent pivoting left
	const ROOM2_LEN = 1650;     // how far the camera walks into Room 02
	const TOTAL_TRAVEL = CORNER_TRAVEL + TURN_LEN + ROOM2_LEN;
	const CORNER_WZ = -3000;    // world-z of the corner where Room 02 branches left

	// The L-shaped room as flat wall panels in world space. hw 650, hh 430.
	// [width, translateX, translateZ, rotateY] — height is a constant 860.
	const walls = [
		{ w: 4150, tx: 650, tz: -1575, ry: -90, seam: true },  // Room 01 right wall (full run)
		{ w: 2850, tx: -650, tz: -925, ry: 90, seam: true },   // Room 01 left wall (stops at the corner)
		{ w: 2900, tx: -800, tz: -3650, ry: 0, seam: true },   // dead-end / south wall (shared)
		{ w: 1600, tx: -1450, tz: -2350, ry: 180, seam: true },// Room 02 near wall
		{ w: 1300, tx: -2250, tz: -3000, ry: 90, seam: true }  // Room 02 far wall (The Maker hangs here)
	];

	// The entrance plays as staged beats across the first stretch of scroll:
	//   portfolio → exhibition → invitation → door reveal → door opens → walk in.
	const WALK_START = 0.38;

	let section: HTMLElement;
	let progress = $state(0); // 0..1 across the whole gallery scroll
	let selectedId = $state<string | null>(null);
	let debug = $state(false); // ?gp= pins the room at a fixed dolly for testing

	function range(p: number, a: number, b: number) {
		return Math.min(Math.max((p - a) / (b - a), 0), 1);
	}

	function hold(p: number, enter: number, leave: number, fade = 0.045) {
		return range(p, enter, enter + fade) * (1 - range(p, leave - fade, leave));
	}

	const openingBeat = $derived(1 - range(progress, 0.065, 0.105));
	const exhibitionBeat = $derived(hold(progress, 0.085, 0.195));
	const invitationBeat = $derived(hold(progress, 0.175, 0.305, 0.04));
	const sceneReveal = $derived(range(progress, 0.285, 0.335)); // black lifts → the door appears
	const doorAmount = $derived(range(progress, 0.325, WALK_START)); // door swings open
	const atEntrance = $derived(progress < WALK_START);

	// How far the camera has walked along the (unrolled) L-path.
	const dolly = $derived(range(progress, WALK_START, 1) * TOTAL_TRAVEL);

	// Camera position + heading along the L-path.
	const cam = $derived.by(() => {
		const d = dolly;
		if (d <= CORNER_TRAVEL) return { Px: 0, Pz: -d, Y: 0 };
		if (d <= CORNER_TRAVEL + TURN_LEN) {
			return { Px: 0, Pz: -CORNER_TRAVEL, Y: 90 * ((d - CORNER_TRAVEL) / TURN_LEN) };
		}
		return { Px: -(d - CORNER_TRAVEL - TURN_LEN), Pz: -CORNER_TRAVEL, Y: 90 };
	});
	const camTransform = $derived(
		`rotateY(${(-cam.Y).toFixed(2)}deg) translate3d(${(-cam.Px).toFixed(1)}px,0px,${(-cam.Pz).toFixed(1)}px)`
	);

	// "This way" sign: appears as you near the corner, gone once you've turned.
	const signAmount = $derived(
		range(dolly, 2100, 2650) * (1 - range(dolly, CORNER_TRAVEL, CORNER_TRAVEL + TURN_LEN))
	);

	// The door has done its job once it's open; fade it away as you walk through so it
	// doesn't clip the camera or hang in front of the first artworks.
	const doorVisible = $derived(1 - range(dolly, 30, 320));

	// Distance of a piece along the unrolled path (negative = ahead of the start).
	function travelOf(e: Exhibit) {
		if (e.room === 0) return e.depth;         // straight arm: depth is the travel
		return -(CORNER_TRAVEL + TURN_LEN + -e.x); // left arm: distance is along -X
	}

	const selected = $derived(exhibits.find((e) => e.id === selectedId) ?? null);

	// Which exhibit is currently "in front of you" (for the room label / lighting).
	const current = $derived.by(() => {
		let best = exhibits[0];
		let bestDist = Infinity;
		for (const e of exhibits) {
			const d = Math.abs(travelOf(e) + dolly - FOCUS_Z);
			if (d < bestDist) { bestDist = d; best = e; }
		}
		return best;
	});

	const currentId = $derived(current.id);

	// Room label follows the camera around the corner.
	const currentRoomIndex = $derived(dolly > CORNER_TRAVEL + TURN_LEN * 0.5 ? 1 : 0);
	const roomLabel = $derived(
		`Room ${rooms[currentRoomIndex].n} — ${rooms[currentRoomIndex].name}`
	);

	function clamp(v: number, min = 0, max = 1) {
		return Math.min(Math.max(v, min), max);
	}

	// Fade a piece in from the dark, then out as it passes the camera.
	function opacityFor(z: number) {
		const nearFade = clamp((-z - 40) / 260);
		const farFade = clamp((z + 2200) / 720);
		return clamp(Math.min(nearFade, farFade));
	}

	// Spotlight / lit intensity: brightest when the piece is at the focus point.
	function litFor(z: number) {
		return clamp(1 - Math.abs(z - FOCUS_Z) / 820);
	}

	function exhibitStyle(e: Exhibit) {
		const camRel = travelOf(e) + dolly;
		return [
			`--x:${e.x}px`,
			`--depth:${e.depth}px`,
			`--ry:${e.ry}deg`,
			`--op:${opacityFor(camRel).toFixed(3)}`,
			`--lit:${litFor(camRel).toFixed(3)}`
		].join(';');
	}

	// The raw scroll position sets a target; the camera eases toward it each frame
	// (a damped follow) so the walk feels smooth instead of snapping 1:1 with scroll.
	let targetProgress = 0;
	let rafId = 0;
	let entering = false; // true while the Enter-button tween is driving the camera

	function measureScroll() {
		if (!browser || !section) return;
		const rect = section.getBoundingClientRect();
		const walkable = Math.max(section.offsetHeight - window.innerHeight, 1);
		targetProgress = clamp(-rect.top / walkable);
	}

	function smoothLoop() {
		if (!entering) {
			const diff = targetProgress - progress;
			progress = Math.abs(diff) < 0.0002 ? targetProgress : progress + diff * 0.09;
		}
		rafId = requestAnimationFrame(smoothLoop);
	}

	// Walk in — a deliberate, eased glide that plays the whole entrance (the door
	// swinging open) before arriving at the first lit artwork.
	let enterRaf = 0;
	function enterGallery() {
		if (!browser || !section) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const flat = reduce || window.matchMedia('(max-width: 900px)').matches;

		// walk value where the first piece is at focus, mapped back through the
		// entrance choreography into overall scroll progress
		const firstWalk = clamp((FOCUS_Z - travelOf(exhibits[0])) / TOTAL_TRAVEL + 0.02);
		const firstP = WALK_START + firstWalk * (1 - WALK_START);
		const rect = section.getBoundingClientRect();
		const walkable = Math.max(section.offsetHeight - window.innerHeight, 1);
		const target = rect.top + window.scrollY + firstP * walkable;

		if (flat) {
			section.querySelector('.exhibit')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}
		if (reduce) {
			window.scrollTo(0, target);
			return;
		}

		// Drive the camera directly through an eased tween (pausing the scroll-follow)
		// so the text fade, door reveal, door swing, and walk-in all play smoothly; the
		// page scroll is carried along so it hands back cleanly at the end.
		document.documentElement.style.scrollBehavior = 'auto';
		const startP = progress;
		const startScroll = window.scrollY;
		const dur = 2600;
		const t0 = performance.now();
		const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
		entering = true;
		cancelAnimationFrame(enterRaf);
		const stepIn = (now: number) => {
			const t = Math.min((now - t0) / dur, 1);
			const e = easeInOut(t);
			progress = startP + (firstP - startP) * e;
			window.scrollTo(0, startScroll + (target - startScroll) * e);
			if (t < 1) {
				enterRaf = requestAnimationFrame(stepIn);
			} else {
				targetProgress = firstP;
				entering = false;
			}
		};
		enterRaf = requestAnimationFrame(stepIn);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') { selectedId = null; return; }
		if (e.key === 'Enter' && atEntrance && !selectedId) {
			const tag = (document.activeElement?.tagName || '').toLowerCase();
			if (tag === 'input' || tag === 'textarea' || tag === 'a') return;
			e.preventDefault();
			enterGallery();
		}
	}

	onMount(() => {
		if (!browser) return;
		window.addEventListener('keydown', onKey);
		const gp = new URLSearchParams(location.search).get('gp');
		if (gp !== null) {
			debug = true;
			progress = clamp(parseFloat(gp));
			return () => window.removeEventListener('keydown', onKey);
		}
		measureScroll();
		progress = targetProgress; // start settled at the right spot
		window.addEventListener('scroll', measureScroll, { passive: true });
		window.addEventListener('resize', measureScroll);
		rafId = requestAnimationFrame(smoothLoop);
		return () => {
			window.removeEventListener('scroll', measureScroll);
			window.removeEventListener('resize', measureScroll);
			window.removeEventListener('keydown', onKey);
			cancelAnimationFrame(rafId);
			cancelAnimationFrame(enterRaf);
		};
	});
</script>

<section bind:this={section} class="gallery" class:debug id="illustration-museum" aria-labelledby="gallery-title">
	<div class="viewport">
		<div class="scene" style="transform:{camTransform}">
			<!-- Room 01 — straight corridor along -Z -->
			<div class="room">
				<div class="lfloor" aria-hidden="true"></div>
				<div class="lceil" aria-hidden="true"></div>

				{#each walls as w, i (i)}
					<div
						class="lwall"
						class:seam={w.seam}
						aria-hidden="true"
						style="width:{w.w}px; margin-left:{-w.w / 2}px; transform: translate3d({w.tx}px,0,{w.tz}px) rotateY({w.ry}deg);"
					></div>
				{/each}

				<div
					class="doorway"
					style="--doorZ:{DOOR_Z}px; --open:{doorAmount}; --reveal:{sceneReveal}; --vis:{doorVisible}"
					aria-hidden="true"
				>
					<div class="leaf left"></div>
					<div class="leaf right"></div>
					<span class="door-seam"></span>
				</div>

				{#each exhibits as e (e.id)}
					{@render exhibitEl(e)}
				{/each}

			</div>
		</div>

		<div class="vignette" aria-hidden="true"></div>

		<div class="blackout" aria-hidden="true" style="opacity:{1 - sceneReveal}"></div>

		<div class="museum-meta" aria-hidden="true" style="opacity:{1 - range(progress, 0.26, 0.3)}">
			<span>AEJ / COLLECTION 01</span>
			<span>ILLUSTRATION → EXHIBITION</span>
			<span>{String(Math.round(range(progress, 0, WALK_START) * 100)).padStart(3, '0')}%</span>
		</div>

		<div class="entrance-beats">
			<p class="entrance-beat" style="opacity:{openingBeat}">
				A portfolio can<br />show you the <em>work.</em>
			</p>
			<p class="entrance-beat" style="opacity:{exhibitionBeat}">
				Some work asks<br />to be <em>entered.</em>
			</p>

			<div class="entrance invitation" class:gone={invitationBeat <= 0} style="--fade:{invitationBeat}">
				<p class="eyebrow">Chapter 01 · Virtual Gallery</p>
				<h2 id="gallery-title"><span>The Illustration</span> Museum</h2>
				<p class="lede">Open the door, or scroll to walk through.</p>
				<button type="button" class="enter-btn" onclick={enterGallery}>
					Enter <span aria-hidden="true">↓</span>
				</button>
			</div>
		</div>

		<header class="mobile-museum-intro">
			<p class="eyebrow">Chapter 01 · Illustration</p>
			<h2><span>The Illustration</span> Museum</h2>
			<p>Characters, stories and visual experiments—curated room by room.</p>
		</header>

		<div class="room-status" class:hidden={atEntrance} aria-hidden="true">
			<span>{roomLabel}</span>
			<span>{currentId}</span>
		</div>

		{#if signAmount > 0.01}
			<div class="sign" style="opacity:{signAmount}" aria-hidden="true">
				<span class="sign-arrow">←</span>
				<span class="sign-body">
					<span class="sign-eyebrow">This way</span>
					<span class="sign-room">Room 02 · The Maker</span>
				</span>
			</div>
		{/if}

		<div class="walk-progress" aria-hidden="true">
			<span style="transform: scaleX({progress})"></span>
		</div>
	</div>
</section>

{#if selected}
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label={selected.title}
		onclick={() => (selectedId = null)}
	>
		<div class="lightbox-inner" onclick={(ev) => ev.stopPropagation()}>
			<div class="lightbox-media">
				<img src={selected.src} alt={selected.title} />
			</div>
			<div class="lightbox-info">
				<p class="lb-id">Room {rooms[selected.room].n} · {selected.id}</p>
				<h3>{selected.title}</h3>
				<p class="lb-desc">{selected.description}</p>
			</div>
			<button
				type="button"
				class="lb-close"
				aria-label="Close"
				onclick={() => (selectedId = null)}
			>×</button>
		</div>
	</div>
{/if}

{#snippet exhibitEl(e: Exhibit)}
	<div class="exhibit" class:current={currentId === e.id} style={exhibitStyle(e)}>
		<div class="spot" aria-hidden="true"></div>
		<button
			type="button"
			class="frame"
			aria-label="View {e.title} full size"
			onclick={() => (selectedId = e.id)}
		>
			<img src={e.src} alt={e.title} />
			<span class="hotspot" aria-hidden="true"></span>
		</button>
		<figcaption class="caption">
			<p class="cap-id">Room {rooms[e.room].n} / {e.id}</p>
			<h3>{e.title}</h3>
			<p class="cap-desc">{e.description}</p>
		</figcaption>
	</div>
{/snippet}

<style>
	.gallery {
		position: relative;
		min-height: 820vh;
		padding: 0;
		background: #000;
	}

	.gallery.debug {
		min-height: 100vh;
		padding: 0;
	}

	.gallery.debug .viewport {
		position: fixed;
		inset: 0;
		height: 100vh;
		margin: 0;
		z-index: 50;
	}

	/* ── The 3D entrance door, standing at the front of the room ── */
	.doorway {
		position: absolute;
		left: 0;
		top: 0;
		width: 1300px;
		height: 860px;
		margin: -430px 0 0 -650px;
		transform: translateZ(var(--doorZ));
		transform-style: preserve-3d;
	}

	.leaf {
		position: absolute;
		top: 0;
		width: 50%;
		height: 100%;
		opacity: var(--vis, 1);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 32%, rgba(0, 0, 0, 0.5)),
			#0a0a0a;
		border: 1px solid rgba(232, 232, 232, 0.12);
		backface-visibility: hidden;
	}

	.leaf.left {
		left: 0;
		transform-origin: left center;
		transform: rotateY(calc(var(--open) * -82deg));
		border-right: 1px solid rgba(200, 255, 0, 0.14);
	}

	.leaf.right {
		right: 0;
		transform-origin: right center;
		transform: rotateY(calc(var(--open) * 82deg));
		border-left: 1px solid rgba(200, 255, 0, 0.14);
	}

	/* Warm light wakes along the seam before the door opens */
	.door-seam {
		position: absolute;
		left: 50%;
		top: 8%;
		width: 4px;
		height: 84%;
		transform: translateX(-50%) translateZ(1px);
		background: linear-gradient(180deg, transparent, rgba(255, 244, 214, 0.6), transparent);
		opacity: calc(var(--reveal) * (1 - var(--open)));
	}

	/* Black backdrop: you see the invitation on this first, then it lifts to reveal the door */
	.blackout {
		position: absolute;
		inset: 0;
		z-index: 5;
		background: #000;
		pointer-events: none;
	}

	/* ── Entrance transition: editorial beats resolve into the gallery door ── */
	.museum-meta {
		position: absolute;
		z-index: 8;
		left: clamp(1rem, 3vw, 3rem);
		right: clamp(1rem, 3vw, 3rem);
		top: 2rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		font: 600 0.52rem 'JetBrains Mono', monospace;
		letter-spacing: 0.16em;
		color: rgba(200, 255, 0, 0.58);
		text-transform: uppercase;
	}

	.museum-meta span:nth-child(2) { text-align: center; }
	.museum-meta span:last-child { text-align: right; }

	.entrance-beats { position: absolute; inset: 0; z-index: 7; display: grid; place-items: center; pointer-events: none; }
	.entrance-beat {
		position: absolute;
		max-width: 1100px;
		padding: 2rem;
		font-size: clamp(3rem, 7.4vw, 7.8rem);
		font-weight: 850;
		line-height: 0.9;
		letter-spacing: -0.065em;
		text-align: center;
		text-wrap: balance;
		color: #e8e8e8;
	}
	.entrance-beat em { font-family: 'Playfair Display', Georgia, serif; font-weight: 400; color: var(--accent); }

	.entrance {
		position: absolute;
		inset: 0;
		z-index: 6;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0 2rem;
		opacity: var(--fade, 1);
		pointer-events: none;
	}

	.entrance.gone { display: none; }

	.entrance h2 {
		margin-top: 0.9rem;
		font-size: clamp(3.5rem, 9vw, 9rem);
		font-weight: 900;
		line-height: 0.78;
		letter-spacing: -0.075em;
		text-transform: uppercase;
		text-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
	}

	.entrance h2 span { display: block; font-size: 0.34em; line-height: 1.8; letter-spacing: 0.13em; color: var(--text-dim); }

	.enter-btn {
		margin-top: 2.2rem;
		padding: 0.75rem 1.7rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--bg);
		background: var(--accent);
		border: none;
		border-radius: 2px;
		cursor: pointer;
		pointer-events: auto;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.enter-btn:hover {
		box-shadow: 0 0 26px rgba(200, 255, 0, 0.5);
		transform: translateY(-2px);
	}

	.enter-btn span {
		display: inline-block;
		animation: cueBob 1.8s ease-in-out infinite;
	}

	@keyframes cueBob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(3px); }
	}

	.eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.lede {
		max-width: 46ch;
		margin: 1.1rem auto 0;
		font-size: clamp(1.05rem, 1.4vw, 1.35rem);
		line-height: 1.5;
		color: var(--text-dim);
	}

	.mobile-museum-intro { display: none; }

	/* ── Pinned stage ─────────────────────── */
	.viewport {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
		perspective: 1000px;
		perspective-origin: 50% 46%;
		background: radial-gradient(ellipse 75% 60% at 50% 48%, #0b0b0b 0%, #000 72%);
	}

	.scene {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		transform-origin: 50% 46%;
		will-change: transform;
		/* Only the frame buttons are interactive; everything structural is click-through */
		pointer-events: none;
	}

	.room {
		position: absolute;
		left: 50%;
		top: 46%;
		width: 0;
		height: 0;
		transform-style: preserve-3d;
	}

	/* ── The L-shaped room: floor + ceiling span both arms; walls form the corner ── */
	.lfloor,
	.lceil {
		position: absolute;
		left: 0;
		top: 0;
		width: 2900px;
		height: 4150px;
		margin: -2075px 0 0 -1450px;
	}

	.lfloor {
		transform: translate3d(-800px, 430px, -1575px) rotateX(90deg);
		background:
			radial-gradient(ellipse 26% 30% at 66% 62%, rgba(200, 255, 0, 0.045), transparent 60%),
			linear-gradient(to top, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.012) 32%, transparent 62%);
	}

	.lceil {
		transform: translate3d(-800px, -430px, -1575px) rotateX(90deg);
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.028), transparent 46%);
	}

	.lwall {
		position: absolute;
		left: 0;
		top: 0;
		height: 860px;
		margin-top: -430px;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.03), transparent 42%, rgba(0, 0, 0, 0.4));
		backface-visibility: hidden;
	}

	.lwall.seam {
		border-bottom: 1px solid rgba(200, 255, 0, 0.16);
		border-top: 1px solid rgba(232, 232, 232, 0.05);
	}

	/* ── Exhibits ─────────────────────────── */
	.exhibit {
		position: absolute;
		left: 0;
		top: 0;
		width: 260px;
		height: 340px;
		margin: -170px 0 0 -130px;
		transform: translate3d(var(--x), 0, var(--depth)) rotateY(var(--ry));
		transform-style: preserve-3d;
		opacity: var(--op);
		will-change: transform, opacity;
		-webkit-transform-style: preserve-3d;
	}

	.spot {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 520px;
		height: 620px;
		transform: translate(-50%, -54%) translateZ(-12px);
		background: radial-gradient(
			ellipse 40% 44% at 50% 42%,
			rgba(255, 240, 214, calc(0.18 + var(--lit) * 0.42)),
			transparent 72%
		);
		pointer-events: none;
	}

	.frame {
		position: absolute;
		inset: 0;
		padding: 0;
		border: 1px solid rgba(232, 232, 232, calc(0.16 + var(--lit) * 0.4));
		background: #070707;
		box-shadow: 0 26px 60px rgba(0, 0, 0, 0.7);
		overflow: hidden;
		cursor: pointer;
		pointer-events: auto;
		-webkit-appearance: none;
		appearance: none;
		font: inherit;
		color: inherit;
		/* Keep each artwork on its own stable compositor plane while the parent
		   camera moves through perspective. This prevents wide-screen entry flicker
		   and the horizontal texture slicing seen during the door animation. */
		transform: translateZ(2px);
		backface-visibility: visible;
		-webkit-backface-visibility: visible;
		will-change: transform;
		transition: border-color 0.2s ease;
	}

	.frame:hover,
	.frame:focus-visible {
		border-color: var(--accent);
		outline: none;
	}

	.frame::before {
		content: '';
		position: absolute;
		inset: 12px;
		border: 1px solid rgba(232, 232, 232, 0.1);
		pointer-events: none;
		z-index: 2;
	}

	.frame img {
		position: absolute;
		left: 50%;
		bottom: 8px;
		width: 90%;
		height: 92%;
		object-fit: contain;
		object-position: center bottom;
		transform: translateX(-50%) translateZ(1px);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		will-change: transform;
		/* The surrounding spotlight carries the focus change. Keeping this static
		   avoids rebuilding the image texture on every camera frame. */
		filter: brightness(0.92);
	}

	.hotspot {
		position: absolute;
		right: 14px;
		top: 46%;
		z-index: 4;
		width: 16px;
		height: 16px;
		border: 1px solid var(--accent);
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.8);
		opacity: var(--lit);
		box-shadow: 0 0 16px rgba(200, 255, 0, 0.5);
		animation: pulse 2s ease-in-out infinite;
		pointer-events: none;
	}

	.hotspot::after {
		content: '';
		position: absolute;
		inset: 4px;
		border-radius: inherit;
		background: var(--accent);
	}

	/* Wall text shown only in the flat fallback (below) */
	.caption { display: none; }

	@keyframes pulse {
		0%, 100% { box-shadow: 0 0 10px rgba(200, 255, 0, 0.4); }
		50% { box-shadow: 0 0 22px rgba(200, 255, 0, 0.75); }
	}

	/* ── Overlays (2D, above the scene) ───── */
	.vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(ellipse 74% 80% at 50% 48%, transparent 50%, rgba(0, 0, 0, 0.72) 100%);
	}

	.room-status {
		position: absolute;
		left: 50%;
		bottom: 2.6rem;
		transform: translateX(-50%);
		display: flex;
		gap: 1rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(232, 232, 232, 0.55);
		white-space: nowrap;
		transition: opacity 0.4s ease;
	}

	.room-status.hidden { opacity: 0; }

	/* ── Directional sign at the corner ──── */
	.sign {
		position: absolute;
		left: 50%;
		top: 26%;
		z-index: 7;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1.5rem;
		border: 1px solid rgba(200, 255, 0, 0.35);
		background: rgba(0, 0, 0, 0.75);
		pointer-events: none;
	}

	.sign-arrow {
		font-size: 2rem;
		line-height: 1;
		color: var(--accent);
		animation: signNudge 1.4s ease-in-out infinite;
	}

	.sign-body { display: flex; flex-direction: column; gap: 0.25rem; }

	.sign-eyebrow {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.sign-room {
		font-size: 0.95rem;
		letter-spacing: 0.02em;
		color: var(--text);
	}

	@keyframes signNudge {
		0%, 100% { transform: translateX(0); }
		50% { transform: translateX(-5px); }
	}

	/* ── Full-art lightbox ───────────────── */
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(1.5rem, 5vw, 4rem);
		background: rgba(0, 0, 0, 0.9);
		animation: lbFade 0.3s ease;
		cursor: zoom-out;
	}

	.lightbox-inner {
		position: relative;
		display: flex;
		gap: clamp(1.5rem, 4vw, 3.5rem);
		align-items: center;
		max-width: 1100px;
		width: 100%;
		max-height: 100%;
		cursor: default;
	}

	.lightbox-media {
		flex: 1 1 58%;
		min-width: 0;
		display: flex;
		justify-content: center;
	}

	.lightbox-media img {
		max-width: 100%;
		max-height: 78vh;
		object-fit: contain;
		filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.8));
	}

	.lightbox-info {
		flex: 1 1 42%;
		border-left: 2px solid var(--accent);
		padding-left: clamp(1rem, 2vw, 1.6rem);
	}

	.lb-id {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.66rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.lightbox-info h3 {
		margin-top: 0.8rem;
		font-size: clamp(1.6rem, 3vw, 3rem);
		line-height: 1;
		text-transform: uppercase;
	}

	.lb-desc {
		margin-top: 1.2rem;
		font-size: clamp(1rem, 1.4vw, 1.2rem);
		line-height: 1.6;
		color: var(--text-dim);
		max-width: 42ch;
	}

	.lb-close {
		position: absolute;
		right: -0.5rem;
		top: -2.4rem;
		border: none;
		background: none;
		color: var(--text-dim);
		font-size: 2rem;
		line-height: 1;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.lb-close:hover { color: var(--accent); }

	@keyframes lbFade {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.walk-progress {
		position: absolute;
		left: clamp(1.25rem, 3vw, 3rem);
		right: clamp(1.25rem, 3vw, 3rem);
		bottom: 1.4rem;
		height: 1px;
		background: rgba(232, 232, 232, 0.12);
	}

	.walk-progress span {
		display: block;
		height: 100%;
		width: 100%;
		background: var(--accent);
		transform-origin: left;
	}


	/* ── Fallback: reduced motion / small screens ── */
	@media (prefers-reduced-motion: reduce), (max-width: 900px) {
		.gallery {
			min-height: auto;
			padding-inline: 1.5rem;
			padding-bottom: 5rem;
		}

		.viewport {
			position: relative;
			height: auto;
			perspective: none;
			overflow: visible;
			display: grid;
			gap: 2rem;
			padding-top: 3rem;
			background: none;
		}

		.scene { position: relative; transform: none; transform-style: flat; }
		.room { position: relative; left: auto; top: auto; width: auto; height: auto; transform-style: flat; display: grid; gap: 3.5rem; }
		.lfloor, .lceil, .lwall, .vignette, .walk-progress, .room-status,
		.doorway, .entrance-beats, .museum-meta, .spot, .hotspot { display: none; }

		.mobile-museum-intro {
			display: block;
			max-width: 42rem;
			margin: 1rem auto 3rem;
			padding-block: 2rem 2.5rem;
			border-top: 1px solid var(--border);
			border-bottom: 1px solid var(--border);
			text-align: center;
		}
		.mobile-museum-intro h2 { margin-top: 1rem; font-size: clamp(3.2rem, 15vw, 6rem); line-height: .82; letter-spacing: -.07em; text-transform: uppercase; }
		.mobile-museum-intro h2 span { display: block; font-size: .32em; line-height: 1.8; letter-spacing: .12em; color: var(--text-dim); }
		.mobile-museum-intro > p:last-child { margin: 1.25rem auto 0; max-width: 34ch; color: var(--text-dim); line-height: 1.55; }

		.exhibit {
			position: relative;
			left: auto;
			top: auto;
			width: min(340px, 82vw);
			height: auto;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			transform: none !important;
			opacity: 1 !important;
		}

		.frame {
			position: relative;
			inset: auto;
			width: 100%;
			aspect-ratio: 0.76;
		}
		.frame img { filter: none; }

		.caption {
			display: block;
			margin-top: 1.1rem;
			text-align: center;
			max-width: 42ch;
		}
		.cap-id {
			font-family: 'JetBrains Mono', monospace;
			font-size: 0.62rem;
			letter-spacing: 0.16em;
			text-transform: uppercase;
			color: var(--accent);
		}
		.caption h3 {
			margin-top: 0.6rem;
			font-size: 1.4rem;
			line-height: 1.05;
			text-transform: uppercase;
		}
		.cap-desc {
			margin-top: 0.6rem;
			font-size: 0.95rem;
			line-height: 1.5;
			color: var(--text-dim);
		}

		.lightbox { position: fixed; }
	}
</style>
