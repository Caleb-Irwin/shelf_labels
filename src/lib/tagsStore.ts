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
		new: (label?: LabelSimple, prepend = false) => {
			if (!label) {
				label = {
					barcode: '123456789012',
					name: 'Example Tag',
					price: 1.23
				};
			}
			update((tags) => {
				if (prepend) {
					tags.unshift({ ...label, id: 0 });
					tags = tags.map((t, i): Label => ({ ...t, id: i }));
				} else {
					tags.push({ ...label, id: tags.length });
				}
				return tags;
			});
		},
		subscribe
	};
})();
