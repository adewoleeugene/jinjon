<script lang="ts">
	import '../app.css';
	import Cursor from '../components/Cursor.svelte';
	import Nav from '../components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Adewole Eugene John — Portfolio</title>
	<meta name="description" content="Product designer and systems builder creating digital infrastructure across events, education and emerging ecosystems." />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="preconnect" href="https://api.fontshare.com" />
	<link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&display=swap" rel="stylesheet" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

<Cursor />
<Nav />

{@render children()}
