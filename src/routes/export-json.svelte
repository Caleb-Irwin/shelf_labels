<script lang="ts">
	import { get } from 'svelte/store';

	import { confStore, labelStore } from '$lib/labelStore';

	function downloadObjectAsJson<T extends object>(exportObj: T, exportName: string) {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', exportName + '.json');
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}
</script>

<svelte:head>
	<title>Export JSON</title>
</svelte:head>

<h1>Export JSON</h1>
<p class="text-center">Use this to backup your labels.</p>
<p class="text-center">
	Format: <code>{`[{"barcode":"string","name":"string","price": number}]`}</code>
</p>
<div class="flex p-2 justify-center">
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={() =>
			downloadObjectAsJson(
				get(labelStore),
				`${$confStore.name} (${new Date()
					.toISOString()
					.substring(0, new Date().toISOString().indexOf('T'))})`
			)}>Download JSON</button
	>
</div>
