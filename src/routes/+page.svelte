<script lang="ts">
	import type { PageData } from './$types';
	import Hero from '../components/Hero.svelte';
	import CharacterExhibition from '../components/CharacterExhibition.svelte';
	import TechTransition from '../components/TechTransition.svelte';
	import TheBuild from '../components/TheBuild.svelte';
	import DesignStudio from '../components/DesignStudio.svelte';
	import BuildToDesignTransition from '../components/BuildToDesignTransition.svelte';
	import FilmTransition from '../components/FilmTransition.svelte';
	import PhotographyTransition from '../components/PhotographyTransition.svelte';
	import Chapter from '../components/Chapter.svelte';
	import Gallery from '../components/Gallery.svelte';
	import Contact from '../components/Contact.svelte';

	let { data }: { data: PageData } = $props();

	const projectsByDiscipline = (discipline: string) =>
		data.projects.filter((project) => project.discipline === discipline);
</script>

<main>
	<Hero />
	<CharacterExhibition exhibits={data.exhibits} rooms={data.exhibitRooms} />
	<TechTransition />
	<TheBuild products={data.buildProducts} />
	<BuildToDesignTransition />
	<DesignStudio projects={projectsByDiscipline('design')} categories={data.designCategories} />

	{#each data.chapters.filter((chapter) => !['engineering', 'design', 'art', 'marketing'].includes(chapter.id)) as chapter (chapter.id)}
		{#if chapter.id === 'film'}
			<FilmTransition projects={projectsByDiscipline('film')} />
		{:else if chapter.id === 'photography'}
			<PhotographyTransition />
			<Gallery projects={projectsByDiscipline('photography')} accentColor="#d6a15b" />
		{:else}
			<Chapter id={chapter.id} number={chapter.number} title={chapter.title} tagline={chapter.tagline} />
		{/if}
	{/each}

	<Contact />
</main>

<style>
	main {
		min-height: 100vh;
		max-width: 1600px;
		margin-inline: auto;
	}
</style>
