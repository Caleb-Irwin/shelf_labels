import { writable, get, type Readable } from 'svelte/store';
import { nanoid } from 'nanoid';

interface VerifyConf {
	index: number;
	autoFilterPositive: number;
	autoFilterNegative: number;
	results: { id: number; passed: boolean }[];
}

interface Metadata {
	id: string;
	name: string;
	lastModified: number;
	locked: boolean;
	verifyConf?: VerifyConf;
}

interface LabelSet extends Metadata {
	labels: Label[];
}

interface AppConf extends Metadata {
	allLabelSets: LabelSet[];
}

interface LabelsStore extends Readable<Label[]> {
	set: (labels: LabelSimple[]) => void;
	update: (id: number, label: Label | LabelSimple) => void;
	new: (label?: LabelSimple, prepend?: boolean) => void;
	delete: (id: number) => void;
	getTag: (id: number) => Label;
}

interface ConfStore extends Readable<AppConf> {
	init: () => void;
	setName: (name: string) => void;
	setLocked: (locked: boolean) => void;
	setVerifyConf: (verifyConf: VerifyConf) => void;
	createLabelSet: (name: string, labels?: Label[], switchToCreated?: boolean) => LabelSet;
	deleteLabelSet: (id: string) => void;
	changeOpenLabelSet: (id: string) => void;
}

export const customLabelStore = (): LabelsStore => {
	const { subscribe, set, update } = writable<Label[]>([]);
	const record = () => {
		console.log('record labels');
		localStorage.setItem('labels', JSON.stringify(get({ subscribe })));
	};
	return {
		set: (labels: LabelSimple[]) => {
			set(labels.map((t, i) => ({ ...t, id: i })));
			record();
		},
		update: (id: number, label: LabelSimple | Label) => {
			update((s) => {
				label['id'] = id;
				s[id] = label as Label;
				return s;
			});
			record();
		},
		new: (label?: LabelSimple, prepend = false) => {
			if (!label) {
				label = {
					barcode: '',
					name: '',
					price: 0
				};
			}
			update((labels: Label[]) => {
				if (prepend) {
					labels.unshift({ ...label, id: 0 });
					labels = labels.map((t, i): Label => ({ ...t, id: i }));
				} else {
					labels.push({ ...label, id: labels.length });
				}
				return labels;
			});
			record();
		},
		delete: (id: number) => {
			update((labels: Label[]) => labels.filter((t) => t.id !== id));
			record();
		},
		getTag: (id: number) => {
			return get(labelStore)[id];
		},
		subscribe
	};
};

export const createConfStore = (labelStore: LabelsStore): ConfStore => {
	const { subscribe, set, update } = writable<AppConf>({
		id: '',
		name: 'Loading...',
		allLabelSets: [],
		locked: true,
		lastModified: -1
	});
	const record = () => {
		console.log('record conf');
		localStorage.setItem('conf', JSON.stringify(get({ subscribe })));
	};
	const getLabelSetIndexById = (id: string): number =>
		get({ subscribe }).allLabelSets.findIndex((v) => v.id === id);

	const syncOpenToAll = () => {
		const open = get({ subscribe });
		const newConf: LabelSet = {
			id: open.id,
			name: open.name,
			lastModified: open.lastModified,
			locked: open.locked,
			labels: JSON.parse(localStorage.getItem('labels') || ''),
			verifyConf: open.verifyConf
		};
		open.allLabelSets[getLabelSetIndexById(open.id)] = newConf;
		set(open);
	};

	const createLabelSet = (
		name: string,
		labels: Label[] = [{ id: 0, name: '', barcode: '', price: 0 }],
		switchToCreated = false
	) => {
		const labelSet: LabelSet = {
			id: nanoid(),
			name,
			labels,
			lastModified: Date.now(),
			locked: false
		};
		update((prev) => {
			prev.allLabelSets.push(labelSet);
			return prev;
		});
		syncOpenToAll();
		record();
		if (switchToCreated) changeOpenLabelSet(labelSet.id);
		return labelSet;
	};
	const changeOpenLabelSet = (id: string) => {
		syncOpenToAll();
		const setIndex = getLabelSetIndexById(id);
		if (setIndex === -1) {
			alert("Can't change to non-existent label set!");
			console.log(id);

			return;
		}
		update((prev) => {
			const newSet = prev.allLabelSets[setIndex];
			labelStore.set(newSet.labels);
			return {
				id: newSet.id,
				name: newSet.name,
				lastModified: Date.now(),
				locked: newSet.locked,
				allLabelSets: prev.allLabelSets,
				verifyConf: newSet.verifyConf
			};
		});
		syncOpenToAll();
		record();
	};
	return {
		init: () => {
			const prev = localStorage.getItem('conf');
			const labels = JSON.parse(localStorage.getItem('labels') || 'null') ?? [
				{ id: 0, name: '', barcode: '', price: 0 }
			];
			labelStore.set(labels);
			if (prev === null) {
				const metadata: Metadata = {
					id: nanoid(),
					name: 'Untitled Label Set 1',
					lastModified: Date.now(),
					locked: false
				};
				set({ ...metadata, allLabelSets: [{ ...metadata, labels }] });
				syncOpenToAll();
				record();
				return;
			}
			set(JSON.parse(prev));
			syncOpenToAll();
			record();
		},
		setName: (name: string) => {
			if (name === '') return;
			set({ ...get({ subscribe }), name, lastModified: Date.now() });
			syncOpenToAll();
			record();
		},
		setLocked: (locked: boolean) => {
			update((prev) => ({ ...prev, locked, lastModified: Date.now() }));
			syncOpenToAll();
			record();
		},
		setVerifyConf: (verifyConf: VerifyConf) => {
			update((prev) => ({ ...prev, verifyConf, lastModified: Date.now() }));
			syncOpenToAll();
			record();
		},
		createLabelSet,
		deleteLabelSet: (id: string) => {
			const last = get({ subscribe });
			if (last.allLabelSets.length === 1) {
				changeOpenLabelSet(createLabelSet('Untitled Label Set 1').id);
			} else {
				changeOpenLabelSet(
					last.allLabelSets[0].id === id ? last.allLabelSets[1].id : last.allLabelSets[0].id
				);
			}
			update((prev) => {
				prev.allLabelSets = prev.allLabelSets.filter((v) => v.id !== id);
				return prev;
			});
			syncOpenToAll();
			record();
		},
		changeOpenLabelSet,
		subscribe
	};
};

export const labelStore = customLabelStore();
export const confStore = createConfStore(labelStore);
