<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const IMG = '/media/Art.jpeg';
	const SNAP = 45;

	type Point = [number, number];

	// Irregular polygon pieces (% coords) that roughly tile together
	const defs: { id: number; points: Point[] }[] = [
		{ id: 0, points: [[0,0],[42,0],[39,2],[38,38],[2,36],[0,36]] },
		{ id: 1, points: [[42,0],[69,0],[67,1],[64,36],[38,38],[39,2]] },
		{ id: 2, points: [[69,0],[100,0],[100,34],[64,36],[67,1]] },
		{ id: 3, points: [[0,36],[2,36],[38,38],[35,68],[1,66],[0,66]] },
		{ id: 4, points: [[38,38],[64,36],[62,68],[35,68]] },
		{ id: 5, points: [[64,36],[100,34],[100,66],[63,68],[62,68]] },
		{ id: 6, points: [[0,66],[1,66],[35,68],[37,100],[0,100]] },
		{ id: 7, points: [[35,68],[62,68],[64,100],[37,100]] },
		{ id: 8, points: [[62,68],[63,68],[100,66],[100,100],[64,100]] },
	];

	type Piece = (typeof defs)[0] & {
		tx: number; ty: number;
		placed: boolean; zIndex: number; dragging: boolean;
	};

	let container: HTMLElement;
	let pieces = $state<Piece[]>([]);
	let cw = $state(0);
	let ch = $state(0);
	let solved = $state(false);
	let maxZ = 10;

	function rand(min: number, max: number) { return min + Math.random() * (max - min); }

	function init() {
		cw = container.offsetWidth;
		ch = container.offsetHeight;
		pieces = defs.map((def, i) => ({
			...def,
			tx: rand(-cw * 0.18, cw * 0.18),
			ty: rand(-ch * 0.18, ch * 0.18),
			placed: false,
			zIndex: i + 1,
			dragging: false,
		}));
	}

	let drag: { piece: Piece; sx: number; sy: number; stx: number; sty: number } | null = null;

	function onPointerDown(e: PointerEvent, piece: Piece) {
		if (piece.placed) return;
		e.preventDefault();
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		piece.zIndex = ++maxZ;
		piece.dragging = true;
		drag = { piece, sx: e.clientX, sy: e.clientY, stx: piece.tx, sty: piece.ty };
		pieces = [...pieces];
	}

	function onPointerMove(e: PointerEvent) {
		if (!drag) return;
		drag.piece.tx = drag.stx + (e.clientX - drag.sx);
		drag.piece.ty = drag.sty + (e.clientY - drag.sy);
		pieces = [...pieces];
	}

	function onPointerUp() {
		if (!drag) return;
		const p = drag.piece;
		p.dragging = false;
		if (Math.abs(p.tx) < SNAP && Math.abs(p.ty) < SNAP) {
			p.tx = 0; p.ty = 0; p.placed = true;
		}
		drag = null;
		if (pieces.every(p => p.placed)) solved = true;
		pieces = [...pieces];
	}

	const clip = (pts: Point[]) => `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;

	onMount(() => { if (browser) init(); });
</script>

<div
	class="puzzle"
	bind:this={container}
	role="application"
	aria-label="Interactive portrait puzzle — drag the pieces together"
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointerleave={onPointerUp}
>
	{#each pieces as piece (piece.id)}
		<div
			class="piece-outer"
			class:placed={piece.placed}
			class:dragging={piece.dragging}
			role="button"
			tabindex="-1"
			aria-label="Puzzle piece {piece.id + 1}"
			style="transform: translate({piece.tx}px,{piece.ty}px); clip-path:{clip(piece.points)}; z-index:{piece.zIndex};"
			onpointerdown={(e) => onPointerDown(e, piece)}
		>
			<div
				class="piece-inner"
				style="transform:translate({-piece.tx}px,{-piece.ty}px); background-image:url('{IMG}'); background-size:{cw}px {ch}px;"
			></div>
		</div>
	{/each}

	{#if solved}
		<div class="solved-msg">✓ Complete</div>
	{/if}
</div>

<style>
	.puzzle {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.piece-outer {
		position: absolute;
		inset: 0;
		cursor: grab;
		transition: filter 0.2s ease;
	}

	.piece-outer:not(.placed):hover {
		filter: brightness(1.2) drop-shadow(0 0 14px rgba(200, 255, 0, 0.5));
		z-index: 999 !important;
	}

	.piece-outer.dragging {
		cursor: grabbing;
		filter: brightness(1.1) drop-shadow(0 6px 20px rgba(0,0,0,0.7));
	}

	.piece-outer.placed {
		cursor: default;
		pointer-events: none;
	}

	.piece-inner {
		position: absolute;
		inset: 0;
		background-repeat: no-repeat;
		background-position: 0 0;
	}

	.solved-msg {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent);
		background: rgba(0,0,0,0.85);
		padding: 0.4rem 1.2rem;
		border: 1px solid var(--accent);
		white-space: nowrap;
		pointer-events: none;
		z-index: 9999;
	}
</style>
