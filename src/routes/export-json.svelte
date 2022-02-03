<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';

	import { get } from 'svelte/store';

	function downloadObjectAsJson(exportObj, exportName) {
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

<h1>Load JSON</h1>
<p class="text-center">Use this to backup your labels.</p>
<div class="flex p-2 justify-center">
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={() => downloadObjectAsJson(get(tagsStore), 'labels')}>Download JSON</button
	>
</div>
