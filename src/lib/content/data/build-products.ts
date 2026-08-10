import type { BuildProduct } from '../types';

export const buildProducts: BuildProduct[] = [
	{
		id: 'lyv',
		title: 'Lyv',
		tagline: 'Real-time participation for live moments.',
		description:
			'Turns a passive audience into a live one — reactions, polls, and presence that make a room feel connected, in real time.',
		tags: ['Product', 'Realtime', 'Mobile'],
		url: '#',
		demo: 'reactions'
	},
	{
		id: 'workshops',
		title: 'AI Workshops',
		tagline: 'Teaching teams to build with AI.',
		description:
			'Hands-on sessions that take people from prompt to prototype — practical AI literacy for teams who want to actually ship.',
		tags: ['Program', 'AI', 'Education'],
		url: '#',
		demo: 'prompt'
	},
	{
		id: 'participation',
		title: 'Participation Infrastructure',
		tagline: 'The rails for collective action.',
		description:
			'A platform for gathering intent and turning it into outcomes — the plumbing behind polls, decisions, and community momentum.',
		tags: ['Platform', 'Infra', 'Community'],
		url: '#',
		demo: 'poll'
	}
];
