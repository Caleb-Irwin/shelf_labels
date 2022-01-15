<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';

	function sliceArrayIntoGroups(arr, size) {
		if (arr.length === 0) {
			return arr;
		}
		return [arr.slice(0, size), ...sliceArrayIntoGroups(arr.slice(size), size)];
	}

	let width = 3,
		height = 10,
		tags: Label[][] = [];
	$: tags = sliceArrayIntoGroups($tagsStore, width * height);
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
					<p class="text-black text-sm">{label.barcode}</p>
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
