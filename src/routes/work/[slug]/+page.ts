import { contentRepository } from '$lib/content/repository';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = true;


export async function entries() {
	const projects = await contentRepository.getProjects();
	return projects.map((p) => ({ slug: p.slug }));
}

export const load: PageLoad = async ({ params }) => {
	const project = await contentRepository.getProjectBySlug(params.slug);
	if (!project) error(404, 'Project not found');
	return { project };
};
