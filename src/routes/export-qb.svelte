<script lang="ts">
	import { browser } from '$app/env';
	import { get } from 'svelte/store';

	import { tagsStore } from '$lib/tagsStore';

	if (browser && localStorage.getItem('labels')) {
		tagsStore.set(JSON.parse(localStorage.getItem('labels')));
	}

	function escapeComma(str: string): string {
		return str.includes(',') ? `"${str}"` : str;
	}

	function makeCSV(labels: Label[]): string {
		const csv = labels.map((tag) => {
			return `Inventory Part,${escapeComma(tag['qbAccount'] as string)},${escapeComma(
				tag['qbName'] as string
			)},${tag.price}`;
		});
		csv.unshift('TYPE,ACCOUNT,NAME,PRICE/AMOUNT');
		return csv.join('\n');
	}

	function downloadLabelsAsCSV(exportLabels: Label[], exportName: string) {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(makeCSV(exportLabels));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', exportName + '.csv');
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}
</script>

<svelte:head>
	<title>Export QuickBooks CSV</title>
</svelte:head>

<h1>Export to QuickBooks CSV</h1>
<p class="text-center">
	Modify or create QuickBooks items from labels. Always backup QuickBooks before using. We recommend
	you use <a href="/verify-labels">verify labels </a> first.
</p>

<div class="flex p-2 justify-center">
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={() => downloadLabelsAsCSV(get(tagsStore), 'quickbooks-export')}>Download CSV</button
	>
</div>
