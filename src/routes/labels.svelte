<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';
</script>

<h1>Labels</h1>

{#each $tagsStore as label}
	<div>
		<p>${label.price} {label.name} {label.barcode}</p>
	</div>
{/each}
