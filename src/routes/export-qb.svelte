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

<div class="text-center m-2">
	<h1>Export to QuickBooks CSV</h1>
	<p>
		Modify or create QuickBooks items from labels. Always backup QuickBooks before using. We
		recommend you use <a href="/verify-labels">verify labels </a> first. You have to have
		<code>qbAccount</code>
		and <code>qbName</code> fields in your labels, which can only be added from importing via
		<a href="/load-json">Load JSON</a>!
	</p>
	<h2 class="text-xl">To Import to QuickBooks</h2>
	<p>Must be done as administrator.</p>
	<ol class="list-decimal">
		<li>Download CSV from here (if you have not already)</li>
		<li>Back up your QuickBooks company file!</li>
		<li>Open Import a File window (File > Utilities > Import > Excel Files)</li>
		<li>Select import file (that you exported from here)</li>
		<li>
			If not already set: click the Preferences tab and set duplicate handling to replace, except
			blank fields and error handling to only rows that do not contain errors.
		</li>
		<li>Preview data</li>
		<li>Click Import</li>
		<li>Use the error log to correct errors (there many be none)</li>
	</ol>
</div>

<div class="flex p-2 justify-center">
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={() => downloadLabelsAsCSV(get(tagsStore), 'quickbooks-export')}>Download CSV</button
	>
</div>
