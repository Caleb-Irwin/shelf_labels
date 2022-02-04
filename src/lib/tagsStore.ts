import { writable, get } from 'svelte/store';

export const tagsStore = (() => {
	const { subscribe, set, update } = writable<Label[]>([]);
	return {
		set: (tags: LabelSimple[]) => {
			set(tags.map((t, i) => ({ ...t, id: i })));
		},
		update: (id: number, label: LabelSimple | Label) => {
			update((s) => {
				label['id'] = id;
				s[id] = label as Label;
				return s;
			});
		},
		new: (label?: LabelSimple, prepend = false) => {
			if (!label) {
				label = {
					barcode: '',
					name: '',
					price: 0
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
		delete: (id: number) => {
			update((tags) => tags.filter((t) => t.id !== id));
		},
		getTag: (id: number) => {
			return get(tagsStore)[id];
		},
		subscribe
	};
})();
