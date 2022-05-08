<script lang="ts">
	import { labelStore } from '$lib/labelStore';
	import { autoFilter, calcPercentChange } from '$lib/verifyUtils';
	import SvgLabel from '$lib/SvgLabel.svelte';
	import EditItem from '$lib/editItem.svelte';
	import JsBarcode from 'jsbarcode';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import ProgressBar from '@okrad/svelte-progressbar';
	import MdCheck from 'svelte-icons/md/MdCheck.svelte';
	import MdClose from 'svelte-icons/md/MdClose.svelte';
	import MdArrowUpward from 'svelte-icons/md/MdArrowUpward.svelte';
	import MdKeyboardArrowLeft from 'svelte-icons/md/MdKeyboardArrowLeft.svelte';
	import MdKeyboardArrowUp from 'svelte-icons/md/MdKeyboardArrowUp.svelte';
	import MdKeyboardArrowRight from 'svelte-icons/md/MdKeyboardArrowRight.svelte';
	import { goto } from '$app/navigation';

	let active = false,
		autoFilterPositive = 20,
		autoFilterNegative = 20,
		index = 0,
		results: { id: number; passed: boolean }[] = [],
		editMode = false,
		labelPreviewHolder,
		width: number;

	$: sorted = autoFilter($labelStore, autoFilterPositive, autoFilterNegative);
	$: currentLabel = disableDecide ? undefined : sorted.failed[index];
	$: currentChangePercent = currentLabel && calcPercentChange(currentLabel);
	$: {
		currentLabel;
		setTimeout(() => {
			const el = labelPreviewHolder?.querySelector('.barcode-svg');
			if (el) {
				JsBarcode(el).init();
				const container = labelPreviewHolder.querySelector('.barcode-svg-holder');
				if (container.childNodes[1]) {
					(container.childNodes[1] as SVGSVGElement).innerHTML = (
						container.childNodes[2].childNodes[0] as SVGSVGElement
					).innerHTML;
				}
			}
		});
	}
	$: disableGoBack = index === 0;
	$: disableDecide = index >= sorted.failed.length;
	$: totalManualPassed = results.filter((l) => l.passed).length;
	$: totalManualFailed = results.filter((l) => !l.passed).length;
	$: series = [
		{
			perc: Math.ceil((totalManualFailed / sorted.failed.length) * 100),
			color: '#FF8080'
		},
		{
			perc: Math.floor(
				(1 - totalManualPassed / sorted.failed.length - totalManualFailed / sorted.failed.length) *
					100
			),
			color: '#F1F1F1'
		}
	];
	$: compBarWidth = width - 60 || 0;

	onMount(() => {
		labelStore.set(JSON.parse(localStorage.getItem('labels')) || []);
		const conf = JSON.parse(localStorage.getItem('verifyConf'));
		if (conf) {
			active = true;
			index = conf.index;
			autoFilterNegative = conf.autoFilterNegative;
			autoFilterPositive = conf.autoFilterPositive;
			results = conf.results;
		}
	});

	const start = () => {
		active = true;
		index = 0;
		localStorage.setItem(
			'verifyConf',
			JSON.stringify({ index, autoFilterPositive, autoFilterNegative, results })
		);
	};
	const cancel = () => {
		active = false;
		results = [];
		index = 0;
		localStorage.removeItem('verifyConf');
	};
	const finish = () => {
		labelStore.set([
			...sorted.passed,
			...sorted.failed.filter((l) => {
				return results.find((r) => r.id === l.id).passed;
			})
		]);
		localStorage.setItem('labels', JSON.stringify(get(labelStore)));
		cancel();
		goto('/labels');
	};
	const toggle = () => {
		if (active) cancel();
		else start();
	};
	const back = () => {
		editMode = false;
		results.pop();
		results = results;
		index--;
		localStorage.setItem(
			'verifyConf',
			JSON.stringify({ index, autoFilterPositive, autoFilterNegative, results })
		);
	};
	const pass = () => {
		editMode = false;
		results.push({ id: currentLabel.id, passed: true });
		results = results;
		index++;
		localStorage.setItem(
			'verifyConf',
			JSON.stringify({ index, autoFilterPositive, autoFilterNegative, results })
		);
	};
	const fail = () => {
		editMode = false;
		results.push({ id: currentLabel.id, passed: false });
		results = results;
		index++;
		localStorage.setItem(
			'verifyConf',
			JSON.stringify({ index, autoFilterPositive, autoFilterNegative, results })
		);
	};
	const handleKeydown = (event) => {
		if (editMode) return;
		if (event.key === 'ArrowLeft') disableDecide || fail();
		if (event.key === 'ArrowUp') disableGoBack || back();
		if (event.key === 'ArrowRight') disableDecide || pass();
	};
</script>

<svelte:head>
	<title>Verify Lables</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} bind:innerWidth={width} />

<h1>Verify Lables</h1>
<p class="text-center">
	Manually verify labels before generating labels or merging into QuickBooks. Include <code
		>lastPrice</code
	>
	field in <a href="/load-json">JSON import</a> to be able to auto verify labels with small price changes.
	Your progress is automatically saved so you can close your browser or refresh this page without losing
	work.
</p>
<div class="text-center flex items-center justify-center">
	<h3 class="inline-block">Controls:</h3>
	<span class="p-0.5 m-1 inline-flex justify-center"
		><div class="h-6 inline-block"><MdKeyboardArrowLeft /></div>
		fail label</span
	>
	<span class="p-0.5 m-1 inline-flex justify-center"
		><div class="h-6 inline-block"><MdKeyboardArrowUp /></div>
		go back to last label</span
	>
	<span class="p-0.5 m-1 inline-flex justify-center"
		><div class="h-6 inline-block"><MdKeyboardArrowRight /></div>
		pass label</span
	>
</div>

<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
	<label for="Height">Auto Pass Positive %</label>
	<input
		type="number"
		name="Height"
		id=""
		disabled={active}
		class="bg-slate-300 p-1 text-center disabled:cursor-not-allowed disabled:bg-transparent"
		bind:value={autoFilterPositive}
	/>
	<label for="Height">Auto Pass Negative %</label>
	<input
		type="number"
		name="Height"
		id=""
		disabled={active}
		class="bg-slate-300 p-1 text-center disabled:cursor-not-allowed disabled:bg-transparent"
		bind:value={autoFilterNegative}
	/>
	<!-- svelte-ignore missing-declaration -->
	<button class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white" on:click={toggle}
		>{active ? 'Cancel' : 'Start'}</button
	>
	<b>Auto Verifyed (of total): {sorted.passed.length}/{$labelStore.length}</b>
</div>

{#if active && $labelStore.length > 0}
	<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white text-center">
		<ProgressBar
			{series}
			style="thin"
			height={10}
			width={compBarWidth}
			textSize={0}
			bgColor="#80FF80"
		/>
		<h2 class="text-2xl font-semibold text-black">Verify</h2>
		<div class="h-10 mb-5">
			<button
				on:click={fail}
				class="text-xl p-0.5 m-1 h-14 hover:text-gray-700 disabled:text-gray-600"
				disabled={disableDecide}><MdClose /></button
			>
			<button
				on:click={back}
				class="text-xl p-0.5 m-1 h-14 hover:text-gray-700 disabled:text-gray-600"
				disabled={disableGoBack}><MdArrowUpward /></button
			>
			<button
				on:click={pass}
				class="text-xl p-0.5 m-1 h-14 hover:text-gray-700 disabled:text-gray-600"
				disabled={disableDecide}><MdCheck /></button
			>
		</div>
		<p class="text-md text-black">{index}/{sorted.failed.length}</p>
		{#if !disableDecide}
			<div class="grid grid-rows-1 grid-cols-3 place-items-center m-4 mt-2">
				<div class="w-full">
					<p class="text-left text-lg">Failed<br /> {totalManualFailed}</p>
				</div>
				<div bind:this={labelPreviewHolder} class="border-black border-2 p-2 rounded-md">
					<svg width="394" height="146" viewBox="0 0 197 73">
						<SvgLabel label={currentLabel} x={0} y={0} />
					</svg>
				</div>
				<div class="w-full">
					<p class="text-right text-lg">Passed<br />{totalManualPassed}</p>
				</div>
			</div>
			<p class="text-black text-xl">
				Previous: ${currentLabel.lastPrice} <br /> Change:
				<span
					class={(currentChangePercent > 0 ? 'bg-green-600' : 'bg-red-500') + ' text-white p-0.5'}
				>
					{currentChangePercent > 0 ? '+' : ''}{currentChangePercent}%</span
				>
			</p>
			<div>
				<button
					on:click={() => {
						if (!editMode) {
							setTimeout(() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }));
						}
						editMode = !editMode;
					}}
					class=" border-solid border-black border-2 rounded-md p-1 m-1 bg-white text-xl"
					>{editMode ? 'Close Edit Mode' : 'Edit Label'}</button
				>
			</div>
			{#if editMode}
				<EditItem
					tagId={currentLabel.id}
					closeFunc={() => {
						editMode = false;
						localStorage.setItem('labels', JSON.stringify(get(labelStore)));
					}}
				/>
			{/if}
		{:else}
			<h2 class="text-2xl text-black">Stats</h2>
			<p class="text-black text-md">Auto Verifyed: {sorted.passed.length}/{$labelStore.length}</p>
			<p class="text-black text-md">
				Manually Verifyed: {totalManualPassed}/{sorted.failed.length}
			</p>
			<p class="text-black text-md">Manually Failed: {totalManualFailed}/{sorted.failed.length}</p>
			<p class="text-black text-md">
				Passed: {sorted.passed.length + totalManualPassed}/{$labelStore.length}
			</p>
			<div>
				<button
					on:click={finish}
					class=" border-solid border-black border-2 rounded-md p-1 m-1 bg-white text-xl"
					>Finish</button
				>
			</div>
		{/if}
	</div>
{/if}
