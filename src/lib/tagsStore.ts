import { writable } from 'svelte/store';

export const tagsStore = (() => {
	const { subscribe, set, update } = writable<Label[]>([
		{
			barcode: '123456789012',
			name: 'Example Tag',
			price: 1.23,
			id: 0
		}
	]);
	return {
		set: (tags: LabelSimple[]) => {
			set(tags.map((t, i) => ({ ...t, id: i })));
		},
		update,
		subscribe
	};
})();
