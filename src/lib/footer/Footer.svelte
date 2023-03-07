<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { labelStore, confStore } from '$lib/labelStore';

	$: open = $confStore.id;
	let selected: HTMLSelectElement;

	const rename = () => {
		const newName = prompt('Rename', get(confStore).name);
		if (newName === null || newName === '') return;
		confStore.setName(newName);
	};
	const del = () => {
		if (confirm("Are you sure you want to delete this label set? \n⚠️ This can't be undone")) {
			confStore.deleteLabelSet($confStore.id);
		}
	};
	const create = () => {
		let name = prompt('Name', 'Untitled Label Set ' + ($confStore.allLabelSets.length + 1));
		if (name === '') name = 'Untitled';
		confStore.createLabelSet(name, undefined, true);
	};
	onMount(() => {
		if (browser) {
			confStore.init();
		}
	});

	const formattedDate = (d = new Date()) => {
		return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
			.map((n) => (n < 10 ? `0${n}` : `${n}`))
			.join('/');
	};
</script>

<footer
	class="fixed inset-x-0 bottom-0 bg-white flex flex-col md:flex-row align-middle justify-center space-x-1 space-y-1 shadow-[0_-10px_15px_-3px_rgb(0_0_0_/_0.1),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] p-2 mt-2"
>
	<label for="label-set" class="items-center text-gray-700 hidden md:flex">Label Set:</label>
	<select
		name="Label Set"
		id="label-set"
		class="text-gray-700 border-2 border-solid border-gray-500 rounded-md h-7"
		value={open}
		bind:this={selected}
		on:click={() => {
			if ($confStore.id !== selected.value) confStore.changeOpenLabelSet(selected.value);
		}}
	>
		{#each $confStore.allLabelSets as labelSet (labelSet.id)}
			<option value={labelSet.id}
				>{labelSet.name} ({labelSet.locked ? '🔒 ' : ''}{labelSet.id === $confStore.id
					? 'Now'
					: formattedDate(new Date(labelSet.lastModified))}; {labelSet.id === $confStore.id
					? $labelStore.length
					: labelSet.labels.length} Labels)</option
			>
		{/each}
	</select>
	<div class="flex justify-center space-x-1">
		<button
			on:click={rename}
			class="text-gray-700 border-2 border-solid border-gray-500 rounded-md px-1 hover:bg-gray-200 flex-grow md:flex-grow-0"
			>Rename</button
		>
		<button
			on:click={del}
			class="text-gray-700 border-2 border-solid border-gray-500 rounded-md px-1 hover:bg-red-400 flex-grow md:flex-grow-0"
			>Delete</button
		>
		<button
			on:click={create}
			class="text-gray-700 border-2 border-solid border-gray-500 rounded-md px-1 hover:bg-green-400 flex-grow md:flex-grow-0"
			>New</button
		>
	</div>
	<p class="text-center text-gray-700 md:pl-2">
		Made by <a
			class="underline"
			href="http://calebirwin.ca/"
			target="_blank"
			rel="noopener noreferrer"
			>Caleb Irwin
		</a>
		for
		<a
			href="https://www.officeexperts.ca/"
			class="underline"
			target="_blank"
			rel="noopener noreferrer">Office Experts</a
		>
	</p>
</footer>
