export type Discipline =
	| 'engineering'
	| 'design'
	| 'film'
	| 'art'
	| 'photography'
	| 'marketing';

export interface Project {
	id: string;
	slug: string;
	title: string;
	discipline: Discipline;
	year: number;
	description: string;
	tags: string[];
	media: string;
	mediaType: 'image' | 'video';
	featured?: boolean;
}

export const chapters: { id: Discipline; number: string; title: string; tagline: string }[] = [
	{ id: 'art', number: '01', title: 'Illustration', tagline: 'Characters and worlds.' },
	{ id: 'engineering', number: '03', title: 'The Build', tagline: 'Products built with purpose.' },
	{ id: 'design', number: '04', title: 'Design', tagline: 'Identity made visible.' },
	{ id: 'film', number: '05', title: 'Film & Video', tagline: 'Motion as language.' },
	{ id: 'photography', number: '06', title: 'Photography', tagline: 'A fraction of a second.' },
	{ id: 'marketing', number: '07', title: 'Marketing', tagline: 'Stories that convert.' }
];

export const projects: Project[] = [
	// Engineering
	{
		id: 'e1',
		slug: 'product-one',
		title: 'Project Title',
		discipline: 'engineering',
		year: 2024,
		description: 'A product built from scratch — full-stack architecture, shipped to production.',
		tags: ['SvelteKit', 'TypeScript', 'PostgreSQL'],
		media: '',
		mediaType: 'image',
		featured: true
	},
	{
		id: 'e2',
		slug: 'product-two',
		title: 'Project Title',
		discipline: 'engineering',
		year: 2024,
		description: 'End-to-end system design with a focus on developer experience.',
		tags: ['Node.js', 'React', 'AWS'],
		media: '',
		mediaType: 'image'
	},
	// Design
	{
		id: 'd1',
		slug: 'design-one',
		title: 'Startup Identity System',
		discipline: 'design',
		year: 2024,
		description: 'Visual identity system for a startup — logo, type, color, collateral.',
		tags: ['Branding', 'Typography', 'Figma'],
		media: '',
		mediaType: 'image',
		featured: true
	},
	{
		id: 'd2',
		slug: 'design-two',
		title: 'Component Library',
		discipline: 'design',
		year: 2023,
		description: 'Component library and design system built for scale.',
		tags: ['UI Design', 'Design System', 'Figma'],
		media: '',
		mediaType: 'image'
	},
	// Film
	{
		id: 'f1',
		slug: 'film-one',
		title: 'Short Film',
		discipline: 'film',
		year: 2024,
		description: 'A short documentary — concept, direction, and edit.',
		tags: ['Direction', 'Colour Grade', 'Edit'],
		media: '',
		mediaType: 'video',
		featured: true
	},
	{
		id: 'f2',
		slug: 'film-two',
		title: 'Brand Film',
		discipline: 'film',
		year: 2023,
		description: 'Commercial production from brief to final cut.',
		tags: ['Cinematography', 'Edit', 'Motion Graphics'],
		media: '',
		mediaType: 'video'
	},
	{
		id: 'f3',
		slug: 'film-three',
		title: 'Visual Study',
		discipline: 'film',
		year: 2023,
		description: 'An experimental motion study shaped through rhythm, texture, and light.',
		tags: ['Art Direction', 'Experimental', 'Edit'],
		media: '',
		mediaType: 'video'
	},
	// Art
	{
		id: 'a1',
		slug: 'art-one',
		title: 'Digital Series',
		discipline: 'art',
		year: 2024,
		description: 'A series of digital paintings exploring texture and form.',
		tags: ['Procreate', 'Digital Painting'],
		media: '',
		mediaType: 'image',
		featured: true
	},
	{
		id: 'a2',
		slug: 'art-two',
		title: 'Illustrated World',
		discipline: 'art',
		year: 2023,
		description: 'Character and world-building illustrations.',
		tags: ['Illustration', 'Character Design'],
		media: '',
		mediaType: 'image'
	},
	// Photography
	{
		id: 'p1',
		slug: 'photo-one',
		title: 'Portrait Series',
		discipline: 'photography',
		year: 2024,
		description: 'Portrait photography — light, shadow, and human geometry.',
		tags: ['Portrait', 'Studio', 'Natural Light'],
		media: '',
		mediaType: 'image',
		featured: true
	},
	{
		id: 'p2',
		slug: 'photo-two',
		title: 'Urban Frames',
		discipline: 'photography',
		year: 2023,
		description: 'Street and architectural photography across cities.',
		tags: ['Street', 'Architecture', 'Documentary'],
		media: '',
		mediaType: 'image'
	},
	{
		id: 'p3',
		slug: 'photo-three',
		title: 'After the Rain',
		discipline: 'photography',
		year: 2024,
		description: 'Reflections, passing figures, and city light after rainfall.',
		tags: ['Night', 'Street', 'Colour'],
		media: '',
		mediaType: 'image'
	},
	{
		id: 'p4',
		slug: 'photo-four',
		title: 'Quiet Geometry',
		discipline: 'photography',
		year: 2023,
		description: 'An architectural study of proportion, shadow, and negative space.',
		tags: ['Architecture', 'Minimal', 'Monochrome'],
		media: '',
		mediaType: 'image'
	},
	// Marketing
	{
		id: 'm1',
		slug: 'marketing-one',
		title: 'Growth Campaign',
		discipline: 'marketing',
		year: 2024,
		description: 'Full social media strategy — content, scheduling, and analytics.',
		tags: ['Social Media', 'Content Strategy', 'Analytics'],
		media: '',
		mediaType: 'image',
		featured: true
	},
	{
		id: 'm2',
		slug: 'marketing-two',
		title: 'Brand Launch',
		discipline: 'marketing',
		year: 2023,
		description: 'Brand launch campaign across Instagram, Twitter, and LinkedIn.',
		tags: ['SMM', 'Copywriting', 'Community'],
		media: '',
		mediaType: 'image'
	}
];

export function getByDiscipline(discipline: Discipline): Project[] {
	return projects.filter((p) => p.discipline === discipline);
}
