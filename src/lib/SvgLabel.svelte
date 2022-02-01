<script lang="ts">
	import { browser } from '$app/env';
	import { afterUpdate } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	import isValidBarcode from './isBarcode';

	export let label: Label = null,
		x: number,
		y: number;
	let l0: SVGTSpanElement,
		l1: SVGTSpanElement,
		l2: SVGTSpanElement,
		lines: string[][] = [[], [], label?.name.split(' ')],
		i = 0,
		oText = label.name;
	const computeLines = () => {
		if (i > 100) return;
		if (label === null) return;
		if (browser && l1 && l2 && l0) {
			let updateLines = false;

			if (l1.getComputedTextLength() > 180) {
				lines[0].push(lines[1].shift());
				updateLines = true;
			}
			if (l2.getComputedTextLength() > 180) {
				lines[1].push(lines[2].shift());
				updateLines = true;
			}
			if (l0.getComputedTextLength() > 180) {
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
			i++;
		}
	};
	$: {
		if (oText !== label.name) {
			i = 0;
			lines = [[], [], label?.name.split(' ')];
			oText = label.name;
		}
	}
	$: computeLines();
	afterUpdate(() => {
		setTimeout(computeLines, 0);
		computeLines();
	});
	$: linesDisplay = lines.map((line) =>
		line && typeof line[0] === 'string' ? line.join(' ') : ''
	);
	$: validBarcode = isValidBarcode(label.barcode.toString());
	const dispatch = createEventDispatcher();
</script>

<svg
	{x}
	{y}
	width="197"
	height="73"
	class="barcode-svg-holder"
	on:click={() =>
		dispatch('tagClicked', {
			id: label.id
		})}
>
	<rect x="0" y="0" width="197" height="73" fill="white" />
	<svg x="50" y="5" width="96.8px" height="84px" viewBox="0 0 242 140" />
	<div style="display: none;">
		{#if label}
			{#if validBarcode}
				<svg
					class="barcode-svg"
					jsbarcode-format="upc"
					jsbarcode-value={label.barcode}
					jsbarcode-textmargin="0"
					jsbarcode-fontoptions="bold"
				/>
			{:else if !validBarcode}
				<svg class="barcode-svg" jsbarcode-value={label.barcode} />
			{/if}
		{/if}
	</div>
	<rect x="0" y="0" width="197" height="50" fill="white" />
	<text
		x="50%"
		y="5"
		dominant-baseline="middle"
		text-anchor="middle"
		style="font-size: 10px; fill: black;"
	>
		<tspan
			style="font-size: 10px;"
			x="50%"
			dominant-baseline="middle"
			text-anchor="middle"
			y="6"
			bind:this={l0}>{linesDisplay[0]}</tspan
		>
		<tspan
			style="font-size: 10px;"
			x="50%"
			dominant-baseline="middle"
			text-anchor="middle"
			y="17"
			bind:this={l1}
		>
			{linesDisplay[1]}</tspan
		>
		<tspan
			style="font-size: 10px;"
			x="50%"
			dominant-baseline="middle"
			text-anchor="middle"
			y="28"
			bind:this={l2}
		>
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
