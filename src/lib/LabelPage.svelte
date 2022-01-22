<script lang="ts">
	import divideArray from './divideArray';
	import SvgLabel from './SvgLabel.svelte';

	export let page: Label[],
		sf = 1;

	let rows = divideArray(page, 3);
</script>

<svg
	width={612 * sf}
	height={792 * sf}
	viewBox="0 0 612 792"
	fill="none"
	font-family="Arial"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect width="612" height="792" fill="#F5F5F5" />
	{#each rows as row, i}
		<SvgLabel x={5} y={78 * i + 5} label={row[0]} />
		<SvgLabel x={207} y={78 * i + 5} label={row[1]} />
		<SvgLabel x={409} y={78 * i + 5} label={row[2]} />
	{/each}
</svg>
