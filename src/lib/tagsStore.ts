import { writable } from 'svelte/store';

export const tagsStore = (() => {
	const { subscribe, set, update } = writable<Label[]>([]);
	return {
		set,
		update,
		subscribe
	};
})();
