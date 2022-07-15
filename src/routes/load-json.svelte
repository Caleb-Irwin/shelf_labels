<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { confStore } from '$lib/labelStore';
	import { onMount } from 'svelte';

	let files: FileList,
		json = '',
		fileName = '';
	$: {
		if (browser && files && files[0]) {
			fileName = files[0].name;
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
			const labels: Label[] = JSON.parse(json)
				.map((l: unknown) => {
					if (l && l['description']) l['name'] = l['description'];
					if (l && l['oldPrice']) l['lastPrice'] = l['oldPrice'];
					if (l && l['noStockOrPO']) l['noPrint'] = l['noStockOrPO'];
					return l;
				})
				.filter((l: unknown): l is LabelSimple => {
					if (l['barcode'] && typeof l['name'] === 'string' && l['price']) {
						return true;
					}
					alert('Item failed validation: ' + JSON.stringify(l));
					console.log(l);
					return false;
				});
			confStore.createLabelSet(
				`${fileName.slice(0, fileName.indexOf('.'))} (${$confStore.allLabelSets.length + 1})`,
				labels,
				true
			);
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
<p class="text-center">
	This will overwrite saved labels. Please export before opening a new file.
</p>
<p class="text-center">
	Format: <code
		>{`[{"barcode":string,"name":string,"price": number, "lastPrice": number, "qbName": string, "qbAccount": string, "noPrint": boolean, "salesTaxCode": string, "purchaseTaxCode": string, "cost": number, "COGSAccount": string}]`}</code
	>. <code>lastPrice</code> is optional, but nice for <a href="/verify-labels">Verify Labels</a>.
	<code>noPrint</code>
	is optional and defaults to false, and is used to hide labels.
	<code>qbAccount</code>
	and <code>qbName</code> fields are needed for <a href="/export-qb">Export to Quickbooks CSV</a>
	but are otherwise optional. <code>cost</code>, <code>COGSAccount</code>,
	<code>salesTaxCode</code>, and <code>purchaseTaxCode</code> are all required to create new items
	using <a href="/export-qb">Export to Quickbooks CSV</a>. Extra fields are fine.
</p>

<div class="flex p-2 justify-center">
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white disabled:bg-gray-200 disabled:border-transparent disabled:cursor-not-allowed"
		on:click={load}>Load</button
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
