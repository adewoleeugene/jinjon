import { buildProducts } from './data/build-products';
import { exhibits, exhibitRooms } from './data/exhibits';
import { designCategories } from './data/design-categories';
import { chapters, projects } from '$lib/data/projects';
import type { HomeContent, Project } from './types';

export interface ContentRepository {
	getHomeContent(): Promise<HomeContent>;
	getProjects(): Promise<Project[]>;
	getProjectBySlug(slug: string): Promise<Project | undefined>;
}

class LocalContentRepository implements ContentRepository {
	async getHomeContent(): Promise<HomeContent> {
		return { buildProducts, exhibits, exhibitRooms, chapters, projects, designCategories };
	}

	async getProjects(): Promise<Project[]> {
		return projects;
	}

	async getProjectBySlug(slug: string): Promise<Project | undefined> {
		return projects.find((project) => project.slug === slug);
	}
}

// Replace this instance with a CMS-backed adapter later. Components and routes
// consume only the ContentRepository contract and do not know where data lives.
export const contentRepository: ContentRepository = new LocalContentRepository();
