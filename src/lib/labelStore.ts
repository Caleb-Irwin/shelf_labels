import { writable, get, type Readable } from 'svelte/store';

interface LabelsStore extends Readable<Label[]> {
	set: (tags: LabelSimple[]) => void;
	update: (id: number, label: Label | LabelSimple) => void;
	new: (label?: LabelSimple, prepend?: boolean) => void;
	delete: (id: number) => void;
	getTag: (id: number) => Label;
}

export const customLabelStore = (): LabelsStore => {
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
			return get(labelStore)[id];
		},
		subscribe
	};
};

export const labelStore = customLabelStore();
