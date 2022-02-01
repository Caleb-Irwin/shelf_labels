<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { readGuild } from '$lib/parseXlsx';
	import { tagsStore } from '$lib/tagsStore';

	let files: FileList;
	let labelsFromFile: Label[] = [];
	$: {
		if (browser && files && files[0]) {
			const reader = new FileReader();

			reader.onload = (ev) => {
				labelsFromFile = readGuild(reader.result as ArrayBuffer)
					.map((g): Label => {
						return {
							barcode: g['UPC#'],
							name: g['Description'],
							price: g['New Level 1']
						};
					})
					.filter((l): l is Label => (l.barcode && l.name && l.price ? true : false));
				load();
			};
			reader.readAsArrayBuffer(files[0]);
		}
	}
	const load = () => {
		try {
			const labels: Label[] = labelsFromFile.filter((l) => {
				if (l.barcode && l.name && l.price) {
					return true;
				}
				alert('Item failed validation: ' + JSON.stringify(l));
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
	<title>Load Spreadsheet</title>
</svelte:head>

<h1>Load Spreadsheet</h1>

<div class="flex p-2 justify-center">
	<input
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		type="file"
		bind:files
	/>
</div>
