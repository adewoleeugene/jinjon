import type { Project, Discipline } from '$lib/data/projects';

export type BuildDemo = 'poll' | 'reactions' | 'prompt';

export interface BuildProduct {
	id: string;
	title: string;
	tagline: string;
	description: string;
	tags: string[];
	url?: string;
	demo: BuildDemo;
}

export interface ExhibitRoom {
	n: string;
	name: string;
}

export interface Exhibit {
	id: string;
	room: number;
	title: string;
	description: string;
	src: string;
	x: number;
	depth: number;
	ry: number;
}

export interface Chapter {
	id: Discipline;
	number: string;
	title: string;
	tagline: string;
}

export interface DesignCategory {
	id: string;
	title: string;
	eyebrow: string;
	description: string;
	projectIds: string[];
}

export interface HomeContent {
	buildProducts: BuildProduct[];
	exhibitRooms: ExhibitRoom[];
	exhibits: Exhibit[];
	chapters: Chapter[];
	projects: Project[];
	designCategories: DesignCategory[];
}

export type { Project, Discipline };
