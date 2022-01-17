<script lang="ts">
	import isValidBarcode from './isBarcode';

	export let label: Label = null,
		x: number,
		y: number;

	const wrap = (s, w) =>
		s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n');
	const lines = (() => {
		if (label === null) return ['', '', '', ''];
		const lines = wrap(label.name.replace(/[^\x00-\x7F]/g, ''), 30).split('\n');

		let out = [lines[0] ?? '', lines[1] ?? '', lines[2] ?? '', lines[3] ?? ''];
		if (out[0] !== '') {
			while (out[3] === '') {
				out.unshift('');
				out.pop();
			}
		}
		return out;
	})();
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
			y="42"
			style="font-size: 12px; font-weight: bold;"
			>{(label ? '$' : '') +
				(label?.price ?? '') +
				(label ? (label.price.toString().includes('.') ? '' : '.00') : '')}</tspan
		>
	</text>
</svg>
