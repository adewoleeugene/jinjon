import { writable } from 'svelte/store';

export const activeChapter = writable<string>('');
