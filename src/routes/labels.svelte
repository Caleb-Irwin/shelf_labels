<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';
	import JsBarcode from 'jsbarcode';
	import { onMount } from 'svelte';
	// import LabelPage from '$lib/LabelPage.svelte';
	import SvgLabelPage from '$lib/SvgLabelPage.svelte';
	import divideArray from '$lib/divideArray';

	let width = 3,
		height = 10,
		svgStyle = '',
		tags = divideArray($tagsStore, width * height < 1 ? 1 : width * height);
	const loadBarcodes = () => {
		svgStyle = '';
		JsBarcode('.barcode').init();
		svgStyle = 'transform: scale(0.8) translate(0, -66%);';
		JsBarcode('.barcode-svg').init();
		document.querySelectorAll('.barcode-svg').forEach((svg: HTMLElement) => {
			svg.style.transform = 'scale(0.4) translate(125px, -75px)';
		});
	};
	onMount(loadBarcodes);

	let html2pdf = null;
	const genPDF = async () => {
		if (html2pdf === null) {
			html2pdf = await import('html2pdf.js');
		}
		html2pdf
			.default()
			.set({
				pagebreak: { mode: 'css' },
				margin: 0.2,
				filename: 'labels.pdf',
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2 },
				jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
			})
			.from(document.getElementById('label-pages'))
			.save()
			.error((e) => {
				console.log('Error logged: ', e);
			});
	};
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
	<button class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white" on:click={genPDF}
		>Generate PDF</button
	>
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		on:click={loadBarcodes}>Rerender Barcodes</button
	>
</div>

<div class="border-2 border-solid border-black flex justify-center">
	<div id="label-pages">
		{#each tags as page}
			<div class="m-1 break-after-page">
				<SvgLabelPage {page} />
			</div>
		{/each}
	</div>
</div>

<!-- <div>
	{#each tags as page}
		<LabelPage {...{ page, width, svgStyle }} />
	{/each}
</div> -->
