<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';
	import JsBarcode from 'jsbarcode';
	import { onMount } from 'svelte';

	function sliceArrayIntoGroups(arr, size) {
		if (arr.length === 0) {
			return arr;
		}
		return [arr.slice(0, size), ...sliceArrayIntoGroups(arr.slice(size), size)];
	}

	function isValidBarcode(barcode) {
		// check length
		if (barcode.length != 12 && barcode.length !== 11) {
			return false;
		}

		var lastDigit = Number(barcode.substring(barcode.length - 1));
		var checkSum = 0;
		if (isNaN(lastDigit)) {
			return false;
		} // not a valid upc/ean

		var arr = barcode
			.substring(0, barcode.length - 1)
			.split('')
			.reverse();
		var oddTotal = 0,
			evenTotal = 0;

		for (var i = 0; i < arr.length; i++) {
			if (isNaN(arr[i])) {
				return false;
			} // can't be a valid upc/ean we're checking for

			if (i % 2 == 0) {
				oddTotal += Number(arr[i]) * 3;
			} else {
				evenTotal += Number(arr[i]);
			}
		}
		checkSum = (10 - ((evenTotal + oddTotal) % 10)) % 10;

		// true if they are equal
		return checkSum == lastDigit;
	}

	let width = 3,
		height = 10,
		tags: Label[][] = [];
	$: tags = sliceArrayIntoGroups($tagsStore, width * height);
	onMount(() => {
		JsBarcode('.barcode').init();
	});
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
	= Labels {width * height} per page
	<br />
	<button class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white"
		>Generate PDF</button
	>
</div>

<div class="break-before-page">
	{#each tags as page}
		<div
			class="wrapper bg-slate-100 p-2 m-1 text-center"
			style="grid-template-columns: repeat({width}, 1fr);"
		>
			{#each page as label}
				<div class="bg-white">
					<p class="text-black text-sm">{label.name}</p>
					<p class="text-lg font-bold text-black ">
						${label.price + (label.price.toString().includes('.') ? '' : '.00')}
					</p>
					{#if isValidBarcode(label.barcode.toString())}
						<svg
							class="barcode"
							jsbarcode-format="upc"
							jsbarcode-value={label.barcode}
							jsbarcode-textmargin="0"
							jsbarcode-fontoptions="bold"
						/>
					{:else}
						<p class="text-black text-sm">{label.barcode}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.wrapper {
		display: grid;
		gap: 10px;
		grid-auto-rows: minmax(100px, auto);
	}
</style>
