import type { Exhibit, ExhibitRoom } from '../types';

export const exhibitRooms: ExhibitRoom[] = [
	{ n: '01', name: 'Character Studies' },
	{ n: '02', name: 'The Maker' }
];

export const exhibits: Exhibit[] = [
	{
		id: 'AEJ-01', room: 0, title: 'The Creative Director',
		description: 'Frames the world before anything is built: tone, feeling, image, and point of view.',
		src: '/media/Character.png', x: -500, depth: -900, ry: 66
	},
	{
		id: 'AEJ-02', room: 0, title: 'The Creative Technologist',
		description: 'Turns imagination into systems: interfaces, prototypes, workflows, and usable tools.',
		src: '/media/Character2.png', x: 500, depth: -1250, ry: -66
	},
	{
		id: 'AEJ-03', room: 0, title: 'The Witness',
		description: 'Observes the details others miss and turns them into moments people can enter.',
		src: '/media/Character4.png', x: -500, depth: -1800, ry: 66
	},
	{
		id: 'AEJ-04', room: 0, title: 'First Sketch',
		description: 'Where the character began — a single restless line, before polish, before systems.',
		src: '/media/Art.jpeg', x: 500, depth: -2150, ry: -66
	},
	{
		id: 'AEJ-05', room: 0, title: 'The Storyteller',
		description: 'Carries rhythm and memory, making digital work feel legible, emotional, and human.',
		src: '/media/Character3.png', x: 0, depth: -3600, ry: 0
	},
	{
		id: 'AEJ-06', room: 1, title: 'The Maker',
		description: 'The person behind the characters — where every one of these studies actually begins.',
		src: '/media/Jinjon.png', x: -2150, depth: -3000, ry: 90
	}
];
