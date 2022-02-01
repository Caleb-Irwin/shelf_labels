<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';
	import JsBarcode from 'jsbarcode';
	import { onMount } from 'svelte';
	import divideArray from '$lib/divideArray';
	import { genPDF } from '$lib/genPdf';
	import LabelPage from '$lib/LabelPage.svelte';
	import { browser } from '$app/env';
	import EditItem from '$lib/editItem.svelte';
	import { get } from 'svelte/store';

	let loaded = false;

	$: tags = divideArray($tagsStore, 30);
	const loadBarcodes = async () => {
		JsBarcode('.barcode-svg').init();
		document.querySelectorAll('.barcode-svg-holder').forEach((container: HTMLElement) => {
			if (container.childNodes[1]) {
				(container.childNodes[1] as SVGSVGElement).innerHTML = (
					container.childNodes[2].childNodes[0] as SVGSVGElement
				).innerHTML;
			}
		});
		if (browser && loaded) {
			console.log('storing!');
			localStorage.setItem('labels', JSON.stringify(get(tagsStore)));
		}
	};

	onMount(() => {
		if (
			browser &&
			!(
				window.location.search.startsWith('?import=') &&
				parseInt(window.location.search.slice(8)) > Date.now()
			) &&
			localStorage.getItem('labels')
		) {
			console.log('loading!');
			tagsStore.set(JSON.parse(localStorage.getItem('labels')));
		}
		loaded = true;
		loadBarcodes();
	});

	let c: HTMLCanvasElement,
		sf = 3,
		sfDisplay = 1.5,
		nd = 0,
		td = 0,
		pageOffset = 0,
		startTime = Date.now();
	const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
	const createPdf = async () => {
		loading = true;
		setTimeout(async () => {
			let s: string[] = [];
			pageOffset = 0;
			while (pageOffset <= Math.ceil($tagsStore.length / 30 / 4) - 1) {
				const ref = document.querySelectorAll('.label-page-holder');
				// console.log(ref);

				for (let i = 0; i < ref.length; i++) {
					let v = ref[i] as HTMLElement;
					// console.log(v);
					let svgEl = v.childNodes[0] as SVGSVGElement;
					svgEl.setAttribute('width', (612 * sf).toString());
					svgEl.setAttribute('height', (792 * sf).toString());
					const svgStr = v.innerHTML;
					svgEl.setAttribute('width', (612 * sfDisplay).toString());
					svgEl.setAttribute('height', (792 * sfDisplay).toString());
					s.push(svgStr);
				}
				if (pageOffset === Math.ceil($tagsStore.length / 30 / 4) - 1) break;
				pageOffset++;

				await wait(3000);
			}
			pageOffset = 0;
			startTime = Date.now();
			await genPDF(s, c, (n, t) => {
				nd = n;
				td = t;
				console.log(n);
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve();
					});
				});
			});
			loading = false;
			nd = 0;
			td = 0;
		}, 0);
	};
	$: {
		pageOffset;
		if (browser) setTimeout(() => JsBarcode('.barcode-svg').init(), 0);
	}

	$: timePerPage = (Date.now() - startTime) / 1000 / nd;
	let loading = false,
		editMode = false,
		tagOpen = null;
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
	{#if loading && nd !== 0}Finished {nd} of {td} Pages ({Math.round(timePerPage * 100) / 100}s/page)
	{:else if loading}Capturing...{/if}
	<div>
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black"
			on:click={() => {
				tagsStore.set([]);
				tagsStore.new();
				setTimeout(loadBarcodes);
			}}>Clear All Labels</button
		>
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black"
			on:click={() => (editMode = !editMode)}>{editMode ? 'View' : 'Edit'} Mode</button
		>
		<button class="rounded-md border-2 p-0.5 px-2 border-black" on:click={loadBarcodes}
			>Rerender Barcodes</button
		>
	</div>
</div>

{#if editMode}
	<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
		<h2 class="text-2xl text-black">Edit Menu</h2>
		<p>Click on any tag to edit or remove</p>
		<div>
			<button
				class="rounded-md border-2 p-0.5 px-2 border-black"
				on:click={() => {
					tagsStore.new(null, true);
					setTimeout(loadBarcodes);
					tagOpen = 0;
				}}>Prepend New Tag</button
			>
			<button
				class="rounded-md border-2 p-0.5 px-2 border-black"
				on:click={() => {
					tagsStore.new(null);
					setTimeout(loadBarcodes);
					tagOpen = get(tagsStore).length - 1;
				}}>Append New Tag</button
			>
		</div>
	</div>
{/if}

{#if editMode && tagOpen !== null}
	<EditItem
		tagId={tagOpen}
		closeFunc={() => {
			tagOpen = null;
			tags = tags;
			setTimeout(loadBarcodes);
		}}
	/>
{/if}

<div class="flex justify-center">
	<button
		disabled={loading || pageOffset <= 0}
		class="bg-slate-50 rounded-lg p-1 m-2 disabled:bg-slate-200 disabled:cursor-not-allowed"
		on:click={() => pageOffset--}>Previous Group</button
	>
	<p class="text-black p-1 m-2">
		Group {pageOffset + 1} of {Math.ceil($tagsStore.length / 30 / 4)}
	</p>
	<button
		disabled={loading || pageOffset >= Math.ceil($tagsStore.length / 30 / 4) - 1}
		class="bg-slate-50 rounded-lg p-1 m-2 disabled:bg-slate-200 disabled:cursor-not-allowed"
		on:click={() => pageOffset++}>Next Group</button
	>
</div>

<div class="flex justify-center">
	<div class="flex flex-row justify-center flex-wrap" id="label-pages">
		{#each tags as page, i}
			{#if pageOffset * 4 <= i && i < (pageOffset + 1) * 4}
				<div class="label-page-holder m-1 border-2 border-black flex ">
					<LabelPage
						on:tagClicked={(m) => {
							if (editMode) {
								tagOpen = m.detail.id;
								window.scrollTo({ top: 0, behavior: 'smooth' });
							}
						}}
						{page}
						sf={sfDisplay}
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>

<canvas bind:this={c} class="hidden" />
<button on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Go to top of page</button>
