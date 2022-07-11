<script lang="ts">
	import { labelStore, confStore } from '$lib/labelStore';
	import JsBarcode from 'jsbarcode';
	import { onMount } from 'svelte';
	import divideArray from '$lib/divideArray';
	import { genPDF } from '$lib/genPdf';
	import LabelPage from '$lib/LabelPage.svelte';
	import { browser } from '$app/env';
	import EditItem from '$lib/editItem.svelte';
	import { get } from 'svelte/store';

	$: tags = divideArray(
		$labelStore.filter((v) => {
			return includeNoPrint || !v.noPrint;
		}),
		30
	);
	$: tagsFlatLength = tags.flat().length;
	$: noPrintLength = $labelStore.filter((v) => v.noPrint).length;
	const loadBarcodes = async () => {
		console.log('loading barcodes');
		JsBarcode('.barcode-svg').init();
		document.querySelectorAll('.barcode-svg-holder').forEach((container: HTMLElement) => {
			if (container.childNodes[1]) {
				(container.childNodes[1] as SVGSVGElement).innerHTML = (
					container.childNodes[2].childNodes[0] as SVGSVGElement
				).innerHTML;
			}
		});
	};

	onMount(() => {
		loadBarcodes();
	});

	let c: HTMLCanvasElement,
		sf = 3,
		nd = 0,
		td = 0,
		includeNoPrint = false,
		pageOffset = 0,
		startTime = Date.now(),
		month = (new Date().getMonth() + 1).toString(),
		auxText = `${month.length === 2 ? month : '0' + month}/${new Date()
			.getFullYear()
			.toString()
			.slice(2)}`;
	const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
	const createPdf = async () => {
		loading = true;
		setTimeout(async () => {
			let s: string[] = [];
			const prevOffset = pageOffset;
			pageOffset = 0;
			while (pageOffset <= Math.ceil($labelStore.length / 30 / 4) - 1) {
				if (
					Math.ceil($labelStore.length / 30 / 4) !== 1 &&
					!(pageOffset === 0 && prevOffset === 0)
				) {
					await wait(3000);
				}
				const ref = document.querySelectorAll('.label-page-holder');
				// console.log(ref);

				for (let i = 0; i < ref.length; i++) {
					let v = ref[i] as HTMLElement;
					// console.log(v);
					let svgEl = v.childNodes[0] as SVGSVGElement;
					svgEl.setAttribute('width', (612 * sf).toString());
					svgEl.setAttribute('height', (792 * sf).toString());
					const svgStr = v.innerHTML;
					svgEl.setAttribute('width', '');
					svgEl.setAttribute('height', '');
					s.push(svgStr);
				}
				if (pageOffset === Math.ceil($labelStore.length / 30 / 4) - 1) break;
				pageOffset++;
			}
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
			pageOffset = prevOffset;
		}, 0);
	};
	$: {
		pageOffset;
		$confStore.id;
		if (browser) setTimeout(() => loadBarcodes(), 0);
	}

	$: timePerPage = (Date.now() - startTime) / 1000 / nd;
	$: labelSetLocked = $confStore.id ? $confStore.locked : false;
	$: setBeingVerfifyed = $confStore.id ? $confStore.verifyConf !== undefined : false;
	$: editMode = !labelSetLocked;

	let loading = false,
		tagOpen = null;
</script>

<svelte:head>
	<title>Labels</title>
</svelte:head>

<h1>Labels</h1>
<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
	<b
		>{tagsFlatLength} label{tags.length !== 1 ? 's' : ''}
		{$labelStore.length === tagsFlatLength
			? noPrintLength !== 0
				? `(including ${tagsFlatLength - noPrintLength} "no-print" labels)`
				: ''
			: `(+${$labelStore.length - tagsFlatLength} Hidden)`} , {Math.ceil(tags.length)}
		total page{Math.ceil(tags.length) !== 1 ? 's' : ''} (at 30 labels per page)</b
	>
	<br />
	<label for="Height">Auxiliary Text</label>
	<input
		placeholder="Nothing, Date, Sheft, Group, etc."
		type="text"
		name="Height"
		id=""
		bind:value={auxText}
		class="bg-slate-300 p-1 text-center placeholder:text-slate-700"
	/>
	<label for="Height">Export Scale</label>
	<input type="number" name="Height" id="" bind:value={sf} class="bg-slate-300 p-1 text-center" />
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
			class="rounded-md border-2 p-0.5 px-2 border-black disabled:bg-gray-200 disabled:border-transparent disabled:cursor-not-allowed"
			disabled={labelSetLocked}
			on:click={() => (editMode = !editMode)}>{editMode ? 'View' : 'Edit'} Mode</button
		>
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black disabled:bg-gray-200 disabled:border-transparent disabled:cursor-not-allowed"
			on:click={() => (includeNoPrint = !includeNoPrint)}
			>{includeNoPrint ? 'Hide' : 'Include'} <code>noPrint</code></button
		>
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black disabled:bg-gray-200 disabled:border-transparent disabled:cursor-not-allowed"
			disabled={setBeingVerfifyed}
			on:click={() => confStore.setLocked(!$confStore.locked)}
			>{labelSetLocked ? 'Unlock' : 'Lock'}</button
		>
		<button class="rounded-md border-2 p-0.5 px-2 border-black" on:click={() => loadBarcodes()}
			>Rerender Barcodes</button
		>
	</div>
	{#if setBeingVerfifyed}
		<p class="text-red-600">
			Label set is being verifyed. Editing is disabled. Finish or cancel it <a
				class="underline text-red-600"
				href="/verify-labels">here</a
			>.
		</p>
	{:else if labelSetLocked}
		<p class="text-red-600">Label set is locked. You can unlock it above.</p>
	{/if}
</div>

{#if editMode}
	<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
		<h2 class="text-2xl text-black">Edit Menu</h2>
		<p class="font-semibold">Click on any tag to edit or remove</p>
		<div>
			<button
				class="rounded-md border-2 p-0.5 px-2 border-black"
				on:click={() => {
					labelStore.new(null, true);
					setTimeout(loadBarcodes);
					tagOpen = 0;
				}}>Add New Tag at Beginning</button
			>
			<button
				class="rounded-md border-2 p-0.5 px-2 border-black"
				on:click={() => {
					labelStore.new(null);
					setTimeout(loadBarcodes);
					tagOpen = get(labelStore).length - 1;
				}}>Add New Tag at End</button
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
		Group {pageOffset + 1} of {Math.ceil(tags.length / 4)}
	</p>
	<button
		disabled={loading || pageOffset >= Math.ceil(tags.length / 4) - 1}
		class="bg-slate-50 rounded-lg p-1 m-2 disabled:bg-slate-200 disabled:cursor-not-allowed"
		on:click={() => pageOffset++}>Next Group</button
	>
</div>

<div class="flex justify-center">
	<div
		class="flex-grow grid {tags.length === 1 ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}"
		id="label-pages"
	>
		{#each tags as page, i}
			{#if pageOffset * 4 <= i && i < (pageOffset + 1) * 4}
				<div class="label-page-holder m-1 border-2 border-black flex">
					<LabelPage
						on:tagClicked={(m) => {
							if (editMode) {
								tagOpen = m.detail.id;
								window.scrollTo({ top: 0, behavior: 'smooth' });
							}
						}}
						{auxText}
						{page}
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>

<canvas bind:this={c} class="hidden" />
<button on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Go to top of page</button>
