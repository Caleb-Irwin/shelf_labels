<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';

	export let tagId: number, closeFunc: () => void;
	let price: number,
		name: string,
		barcode: string,
		originalId = -1;
	$: tag = tagsStore.getTag(tagId);
	$: {
		if (tagId !== originalId) {
			price = tag.price;
			name = tag.name;
			barcode = tag.barcode;
			originalId = tagId;
		}
	}
</script>

<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
	<h2 class="text-2xl text-black">Tag #{tagId}</h2>
	<label for="name">Name</label>
	<input type="text" name="name" id="" bind:value={name} class="bg-slate-300 p-1 text-center" />
	<label for="price">Price</label>
	<input type="number" name="price" id="" bind:value={price} class="bg-slate-300 p-1 text-center" />
	<label for="barcode">Barcode</label>
	<input
		type="text"
		name="barcode"
		id=""
		bind:value={barcode}
		class="bg-slate-300 p-1 text-center"
	/>
	<div class="mt-2">
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black"
			on:click={() => {
				tagsStore.delete(tagId);
				closeFunc();
			}}>🗑 Delete Tag</button
		>
		<button on:click={closeFunc} class="rounded-md border-2 p-0.5 px-2 border-black">✖ Close</button
		>
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black"
			on:click={() => {
				tagsStore.update(tagId, {
					name,
					price,
					barcode
				});
				closeFunc();
			}}>💾 Save Tag</button
		>
	</div>
</div>
