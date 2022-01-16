<script lang="ts">
	import isValidBarcode from './isBarcode';

	export let label: Label = null,
		x: number,
		y: number;

	const wrap = (s, w) =>
		s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n');
	const lines = (() => {
		if (label === null) return ['', '', ''];
		let lines = wrap(label.name, 30).split('\n');

		return [lines[0] ?? '', lines[1] ?? '', lines[2] ?? '', lines[3] ?? ''];
	})();
</script>

<svg {x} {y} width="197" height="73">
	<rect x="0" y="0" width="197" height="73" fill="white" />
	<text
		x="50%"
		y="5"
		dominant-baseline="middle"
		text-anchor="middle"
		style="font-size: 8px; fill: black;"
	>
		{lines[0]}
		<tspan x="50%" dominant-baseline="middle" text-anchor="middle" y="13">{lines[1]}</tspan>
		<tspan x="50%" dominant-baseline="middle" text-anchor="middle" y="21"> {lines[2]}</tspan>
		<tspan x="50%" dominant-baseline="middle" text-anchor="middle" y="29"> {lines[3]}</tspan>
		<tspan
			x="50%"
			dominant-baseline="middle"
			text-anchor="middle"
			y="40"
			style="font-size: 12px; font-weight: bold;">${label?.price}</tspan
		>
	</text>
	<svg y="50" width="197" height="23">
		{#if label}
			{#if isValidBarcode(label.barcode.toString())}
				<svg
					style="transform: scale(0.7) translate(0, -66%);"
					class="barcode-svg"
					jsbarcode-format="upc"
					jsbarcode-value={label.barcode}
					jsbarcode-textmargin="0"
					jsbarcode-fontoptions="bold"
				/>
			{:else if !isValidBarcode(label.barcode.toString())}
				<svg
					class="barcode-svg"
					style="transform: scale(0.7) translate(0, -66%);"
					jsbarcode-value={label.barcode}
				/>
			{/if}
		{/if}
	</svg>
</svg>
