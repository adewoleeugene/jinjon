import { contentRepository } from '$lib/content/repository';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async () => contentRepository.getHomeContent();
