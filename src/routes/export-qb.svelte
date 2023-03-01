<script lang="ts">
	import { get } from 'svelte/store';

	import { confStore, labelStore } from '$lib/labelStore';

	function escapeComma(str: string): string {
		return str.includes(',') ? `"${str}"` : str;
	}

	function makeCSV(labels: Label[], revertMode: boolean, createItemMode: boolean): string {
		const csv = labels.map((label) => {
			if (!label.qbAccount || !label.qbName || (revertMode && !label.lastPrice)) {
				alert(
					'Missing QB account or name, or last price. Please verify labels again. Generating anyway!'
				);
				console.log(label);
				// throw new Error('Missing QB account or name, or last price.');
			}
			return `Inventory Part,${escapeComma(label.qbAccount || '')},${escapeComma(label.qbName)},${
				revertMode ? label.lastPrice : label.price
			}${
				createItemMode
					? `,${escapeComma(label.name)},${label.cost},${label.salesTaxCode},${label.COGSAccount},${
							label.name === '' ? '' : 'Inventory Asset'
					  },${label.name},${label.purchaseTaxCode}`
					: ''
			},${label.preferredVendor}`;
		});
		csv.unshift(
			'TYPE,ACCOUNT,NAME,PRICE/AMOUNT' +
				(createItemMode
					? ',DESCRIPTION,COST,TAX CODE,COGS Account,ASSET ACCOUNT,DESCRIPTION ON PURCHASE TRANSACTIONS,PURCHASE TAX CODE,PREFERRED VENDOR'
					: '')
		);
		return csv.join('\n');
	}

	function downloadLabelsAsCSV(
		exportLabels: Label[],
		exportName: string,
		revertMode: boolean = false,
		addDescription: boolean = false
	) {
		const dataStr =
			'data:text/json;charset=utf-8,' +
			encodeURIComponent(makeCSV(exportLabels, revertMode, addDescription));
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

<div class="text-center m-4">
	<h1>Export to QuickBooks CSV</h1>
	<p>
		Modify or create QuickBooks items from labels. We recommend you use <a href="/verify-labels"
			>verify labels
		</a>
		first. You have to have
		<code>qbAccount</code>
		and <code>qbName</code> fields in your labels, which can only be added from importing via
		<a href="/load-json">Load JSON</a>! If you have a <code>lastPrice</code> field, you can make a revert
		csv that will undo the price changes this makes. We recommend against using this to create new items
		in Quickbooks because it does not export descriptions due to QuickBooks limitations on exports.
	</p>
	<h2 class="text-xl">To Import to QuickBooks</h2>
	<p>Must be done as administrator.</p>
	<ol class="list-decimal">
		<li>Download Change CSV from here (if you have not already)</li>
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
		<li>
			If you want to undo changes do these steps with the revert csv (this is useful for flyer
			items)
		</li>
	</ol>
</div>

<div class="flex p-2 justify-center">
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={() =>
			downloadLabelsAsCSV(
				get(labelStore),
				`${$confStore.name} (qb-${new Date()
					.toISOString()
					.substring(0, new Date().toISOString().indexOf('T'))})`
			)}>Download Change CSV</button
	>
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={() =>
			downloadLabelsAsCSV(
				get(labelStore),
				`${$confStore.name} (qb-revert-${new Date()
					.toISOString()
					.substring(0, new Date().toISOString().indexOf('T'))})`,
				true
			)}>Download Revert CSV</button
	>
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={() =>
			downloadLabelsAsCSV(
				get(labelStore),
				`${$confStore.name} (qb-create-${new Date()
					.toISOString()
					.substring(0, new Date().toISOString().indexOf('T'))})`,
				false,
				true
			)}>Download Create Items CSV</button
	>
</div>
