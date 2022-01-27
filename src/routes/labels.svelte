<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';
	import JsBarcode from 'jsbarcode';
	import { onMount } from 'svelte';
	import divideArray from '$lib/divideArray';
	import { genPDF } from '$lib/genPdf';
	import LabelPage from '$lib/LabelPage.svelte';

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
	let c: HTMLCanvasElement,
		refs: HTMLElement[] = [];
	let sf = 3,
		sfDisplay = 1.5;
	const createPdf = async () => {
		loading = true;
		const s = refs.map((v) => {
			let svgEl = v.childNodes[0] as SVGSVGElement;
			svgEl.setAttribute('width', (612 * sf).toString());
			svgEl.setAttribute('height', (792 * sf).toString());
			const svgStr = v.innerHTML;
			svgEl.setAttribute('width', (612 * sfDisplay).toString());
			svgEl.setAttribute('height', (792 * sfDisplay).toString());
			return svgStr;
		});
		await genPDF(s, c);
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
	<label for="Height">Scale</label>
	<input type="number" name="Height" id="" bind:value={sf} class="bg-slate-300 p-1 text-center" />
	30 labels per page, {$tagsStore.length} label{$tagsStore.length !== 1 ? 's' : ''}, {Math.ceil(
		$tagsStore.length / 30
	)} total page{Math.ceil($tagsStore.length / 30) !== 1 ? 's' : ''}
	<br />
	<button
		class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white disabled:cursor-wait"
		disabled={loading}
		on:click={createPdf}
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

<div class="border-2 border-solid border-black bg-black flex justify-center">
	<div class="flex flex-row justify-center flex-wrap" id="label-pages">
		{#each tags as page, i}
			<div class="m-1" bind:this={refs[i]}>
				<LabelPage {page} sf={sfDisplay} />
			</div>
		{/each}
	</div>
</div>

<canvas bind:this={c} class="hidden" />
