<script lang="ts">
	// Not used yet (maybe never)
	import { tagsStore } from '$lib/tagsStore';

	import { onMount } from 'svelte';
	import { browser } from '$app/env';

	onMount(() => {
		tagsStore.set(JSON.parse(localStorage.getItem('labels')) || []);
	});

	let files: FileList;
	let qbExport: string;
	$: {
		if (browser && files && files[0]) {
			const reader = new FileReader();

			reader.onload = () => {
				qbExport = reader.result as string;
			};
			reader.readAsText(files[0]);
		}
	}
	$: console.log(qbExport);
</script>

<svelte:head>
	<title>QuickBooks Merge</title>
</svelte:head>

<h1>QuickBooks Merge</h1>
<p class="text-center">
	Merge labels into QuickBooks. Always backup QuickBooks before using. We recommend you use <a
		href="/verify-labels"
		>verify labels
	</a> first.
</p>
<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
	<label for="qbFile">QuickBooks Item Listings Export as .csv</label>
	<input
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		name="qbFile"
		type="file"
		bind:files
	/>
</div>
<textarea disabled>{qbExport ?? ''}</textarea>
