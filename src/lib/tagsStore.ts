import { writable } from 'svelte/store';

export const tagsStore = (() => {
	const { subscribe, set, update } = writable<Label[]>([
		{
			barcode: '123456789012',
			name: 'Test',
			price: 5.99
		}
	]);
	return {
		set,
		update,
		subscribe
	};
})();
