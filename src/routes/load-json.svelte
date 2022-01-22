<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { tagsStore } from '$lib/tagsStore';

	let files: FileList;
	let json = '';
	$: {
		if (browser && files && files[0]) {
			const reader = new FileReader();
			reader.onload = (ev) => {
				json = ev.target.result as string;
				load();
			};
			reader.readAsText(files[0]);
		}
	}
	const load = () => {
		try {
			const labels: Label[] = JSON.parse(json).filter((l) => {
				if (l.barcode && l.name && l.price) {
					return true;
				}
				alert('Item failed validation: ' + l);
				return false;
			});
			tagsStore.set(labels);
			goto('/labels');
		} catch (e) {
			console.log(e);
			alert('Try agian! Error = ' + e);
		}
	};
</script>

<svelte:head>
	<title>Load JSON</title>
</svelte:head>

<h1>Load JSON</h1>

<div class="flex p-2 justify-center">
	<button class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white" on:click={load}
		>Load</button
	>
	<input
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		type="file"
		bind:files
	/>
</div>

<textarea
	name="JSON"
	id="json"
	cols="30"
	rows="10"
	placeholder="JSON Text"
	class="placeholder:text-center border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
	bind:value={json}
/>
