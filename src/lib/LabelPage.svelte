<script lang="ts">
	import divideArray from './divideArray';
	import SvgLabel from './SvgLabel.svelte';

	export let page: Label[],
		auxText = '';

	$: rows = divideArray(page, 3);
</script>

<!-- <div> -->
<svg
	class="flex-grow"
	width="100%"
	viewBox="0 0 612 792"
	fill="none"
	font-family="Arial"
	xmlns="http://www.w3.org/2000/svg"
>
	<rect width="612" height="792" fill="#F5F5F5" />
	{#each rows as row, i}
		<SvgLabel on:tagClicked x={5} y={78 * i + 5} {auxText} label={row[0]} />
		{#if row[1]}
			<SvgLabel on:tagClicked x={207} y={78 * i + 5} {auxText} label={row[1]} />
		{/if}
		{#if row[2]}
			<SvgLabel on:tagClicked x={409} y={78 * i + 5} {auxText} label={row[2]} />
		{/if}
	{/each}
</svg>
