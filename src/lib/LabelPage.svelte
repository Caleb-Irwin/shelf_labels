<script lang="ts">
	export let page: Label[],
		width: number = 1,
		svgStyle = '';
	import isValidBarcode from './isBarcode';
</script>

<div
	class="wrapper bg-slate-100 p-0.5 m-2 text-center break-before-page"
	style="grid-template-columns: repeat({width}, 1fr);"
>
	{#each page as label}
		<div class="bg-white m-0.5">
			<p class="text-black text-md">{label.name}</p>
			<p class="text-3xl font-bold text-black ">
				${label.price + (label.price.toString().includes('.') ? '' : '.00')}
			</p>
			<div class="flex justify-center mb-0.5 h-12 overflow-hidden">
				{#if isValidBarcode(label.barcode.toString())}
					<svg
						style={svgStyle}
						class="barcode"
						jsbarcode-format="upc"
						jsbarcode-value={label.barcode}
						jsbarcode-textmargin="0"
						jsbarcode-fontoptions="bold"
					/>
				{:else}
					<svg class="barcode" style={svgStyle} jsbarcode-value={label.barcode} />
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.wrapper {
		display: grid;
		gap: 2px;
		grid-auto-rows: minmax(100px, auto);
	}
</style>
