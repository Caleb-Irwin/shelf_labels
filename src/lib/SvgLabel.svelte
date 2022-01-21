<script lang="ts">
	import { browser } from '$app/env';
	import { afterUpdate, onMount } from 'svelte';

	import isValidBarcode from './isBarcode';

	export let label: Label = null,
		x: number,
		y: number;
	let l0: SVGTSpanElement, l1: SVGTSpanElement, l2: SVGTSpanElement;
	let lines: string[][] = [[], [], label?.name.split(' ')];
	const computeLines = () => {
		if (label === null) return;
		if (browser && l1 && l2 && l0) {
			let updateLines = false;

			if (l1.getComputedTextLength() > 197) {
				lines[0].push(lines[1].shift());
				updateLines = true;
			}
			if (l2.getComputedTextLength() > 197) {
				lines[1].push(lines[2].shift());
				updateLines = true;
			}
			if (l0.getComputedTextLength() > 197) {
				console.log('popped', lines[2].pop());
				lines[2][lines[2].length - 1] += '...';
				lines[2] = lines[1].concat(lines[2]);
				lines[1] = lines[0];
				lines[0] = [];
				updateLines = true;
			}
			if (updateLines) {
				lines = lines;
			}
		}
	};
	$: computeLines();
	afterUpdate(() => {
		console.log('afterUpdate');
		setTimeout(computeLines, 0);
		computeLines();
	});
	$: linesDisplay = lines.map((line) =>
		line && typeof line[0] === 'string' ? line.join(' ') : ''
	);
</script>

<svg {x} {y} width="197" height="73">
	<rect x="0" y="0" width="197" height="73" fill="white" />
	<svg x="50" y="5" width="96.8px" height="84px" viewBox="0 0 242 140" class="barcode-svg-holder">
		{#if label}
			{#if isValidBarcode(label.barcode.toString())}
				<svg
					class="barcode-svg"
					jsbarcode-format="upc"
					jsbarcode-value={label.barcode}
					jsbarcode-textmargin="0"
					jsbarcode-fontoptions="bold"
				/>
			{:else if !isValidBarcode(label.barcode.toString())}
				<svg class="barcode-svg" jsbarcode-value={label.barcode} />
			{/if}
		{/if}
	</svg>
	<rect x="0" y="0" width="197" height="50" fill="white" />
	<text
		x="50%"
		y="5"
		dominant-baseline="middle"
		text-anchor="middle"
		style="font-size: 10px; fill: black;"
	>
		<tspan x="50%" dominant-baseline="middle" text-anchor="middle" y="6" bind:this={l0}
			>{linesDisplay[0]}</tspan
		>
		<tspan x="50%" dominant-baseline="middle" text-anchor="middle" y="17" bind:this={l1}>
			{linesDisplay[1]}</tspan
		>
		<tspan x="50%" dominant-baseline="middle" text-anchor="middle" y="28" bind:this={l2}>
			{linesDisplay[2]}</tspan
		>
		<tspan
			x="50%"
			dominant-baseline="middle"
			text-anchor="middle"
			y="42"
			style="font-size: 14px; font-weight: bold;"
			>{(label ? '$' : '') +
				(label?.price ?? '') +
				(label ? (label.price.toString().includes('.') ? '' : '.00') : '')}</tspan
		>
	</text>
</svg>
