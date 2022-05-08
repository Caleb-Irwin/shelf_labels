<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { labelStore, confStore } from '$lib/labelStore';
	import { onMount } from 'svelte';

	let files: FileList,
		json = '',
		verifyHappening = false;
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
			const labels: Label[] = JSON.parse(json)
				.map((l: unknown) => {
					if (l && l['description']) l['name'] = l['description'];
					if (l && l['oldPrice']) l['lastPrice'] = l['oldPrice'];
					return l;
				})
				.filter((l: unknown): l is LabelSimple => {
					if (l['barcode'] && l['name'] && l['price']) {
						return true;
					}
					alert('Item failed validation: ' + JSON.stringify(l));
					console.log(l);
					return false;
				});
			confStore.changeOpenLabelSet(
				confStore.createLabelSet(
					'Imported Label Set ' + ($confStore.allLabelSets.length + 1),
					labels
				).id,
				labelStore
			);
			goto('/labels');
		} catch (e) {
			console.log(e);
			alert('Try agian! Error = ' + e);
		}
	};
	onMount(() => {
		if (browser && localStorage.getItem('verifyConf')) {
			verifyHappening = true;
		}
	});
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
		>{`[{"barcode":"string","name":"string","price": number, "lastPrice": number, "qbName": string, "qbAccount": string}]`}</code
	>. <code>lastPrice</code> is optional, but nice for <a href="/verify-labels">Verify Labels</a>.
	<code>qbAccount</code>
	and <code>qbName</code> fields are needed for <a href="/export-qb">Export to Quickbooks CSV</a> but
	are otherwise optional. Extra fields are fine.
</p>
{#if verifyHappening}
	<p class="text-center text-red-600">
		A verify is in progress. Load is disabled. Finish or cancel it <a
			class="underline text-red-600"
			href="/verify-labels">here</a
		>.
	</p>
{/if}
<div class="flex p-2 justify-center">
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white disabled:bg-gray-200 disabled:border-transparent disabled:cursor-not-allowed"
		disabled={verifyHappening}
		on:click={load}>Load</button
	>
	<input
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		type="file"
		bind:files
		disabled={verifyHappening}
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
