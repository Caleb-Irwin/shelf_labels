<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';
	import JsBarcode from 'jsbarcode';
	import { onMount } from 'svelte';
	import SvgLabelPage from '$lib/SvgLabelPage.svelte';
	import divideArray from '$lib/divideArray';

	const tags = divideArray($tagsStore, 30),
		loadBarcodes = async () => {
			JsBarcode('.barcode-svg').init();
			document.querySelectorAll('.barcode-svg-holder').forEach((svg: SVGSVGElement) => {
				// svg.style.transform = 'scale(0.4) translate(125px, -75px)';
				if (svg.childNodes[0]) {
					svg.innerHTML = (svg.childNodes[0] as SVGSVGElement).innerHTML;
				}
			});
		};
	onMount(loadBarcodes);

	let html2pdf = null;
	const genPDF = async () => {
		loading = true;
		if (html2pdf === null) {
			html2pdf = await import('html2pdf.js');
		}
		try {
			await html2pdf
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
				.save();
		} catch (e) {
			console.error(e);
		}
		loading = false;
	};

	let debug = false,
		loading = false;
</script>

<svelte:head>
	<title>Labels</title>
</svelte:head>

<h1>Labels</h1>
<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
	30 labels per page, {$tagsStore.length} label{$tagsStore.length !== 1 ? 's' : ''}, {Math.ceil(
		$tagsStore.length / 30
	)} total page{Math.ceil($tagsStore.length / 30) !== 1 ? 's' : ''}
	<br />
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white disabled:cursor-wait"
		disabled={loading}
		on:click={genPDF}
		>{#if !loading} Generate PDF {:else} <p class="animate-ping">◯</p> {/if}</button
	>
	This may take a long time (more then 30 seconds)
	<button on:click={() => (debug = !debug)}>Debug</button>
	{#if debug}
		<button
			class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
			on:click={loadBarcodes}>Rerender Barcodes (don't press while generating pdf)</button
		>
	{/if}
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
