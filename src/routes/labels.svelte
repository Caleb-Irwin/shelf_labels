<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';
	import JsBarcode from 'jsbarcode';
	import { onMount } from 'svelte';
	import LabelPage from '$lib/LabelPage.svelte';

	function sliceArrayIntoGroups(arr, size) {
		if (arr.length === 0) {
			return arr;
		}
		return [arr.slice(0, size), ...sliceArrayIntoGroups(arr.slice(size), size)];
	}

	let width = 3,
		height = 10,
		svgStyle = '',
		tags: Label[][] = [];
	$: tags = sliceArrayIntoGroups($tagsStore, width * height < 1 ? 1 : width * height);
	const loadBarcodes = () => {
		svgStyle = '';
		JsBarcode('.barcode').init();
		svgStyle = 'transform: scale(0.7) translate(0, -66%);';
	};
	onMount(loadBarcodes);

	/*const genPDF = async () => {
		if (html2pdf === null) {
			html2pdf = await import('html2pdf.js');
		}
		html2pdf
			.default()
			.set({
				jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
				pagebreak: { mode: 'css' }
			})
			.from(document.getElementById('label-pages'))
			.save()
			.error();
	};*/
</script>

<h1>Labels</h1>
<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
	<label for="Height">Height</label>
	<input
		type="number"
		name="Height"
		id=""
		bind:value={height}
		class="bg-slate-300 p-1 text-center"
	/>
	<label for="Width">Width</label>
	<input type="number" name="Width" id="" bind:value={width} class="bg-slate-300 p-1 text-center" />
	= Labels {width * height} per page ({$tagsStore.length} labels, {Math.ceil(
		$tagsStore.length / (width * height)
	)} total pages)
	<br />
	<button class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		>Generate PDF</button
	>
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={loadBarcodes}>Rerender Barcodes</button
	>
</div>

<div id="label-pages">
	{#each tags as page}
		<LabelPage {...{ page, width, svgStyle }} />
	{/each}
</div>
