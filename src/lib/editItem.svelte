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
	$: {
		if (price === 0 || isNaN(price)) price = undefined;
	}
</script>

<div class="border-solid border-black border-2 rounded-md p-1 m-1 bg-white grid text-center">
	<h2 class="text-2xl text-black">Tag #{tagId + 1}</h2>
	<label for="name">Name</label>
	<input
		type="text"
		placeholder="Product Name (Type or Paste here)"
		name="name"
		id=""
		bind:value={name}
		class="bg-slate-300 p-1 text-center placeholder:text-gray-600"
	/>
	<label for="price">Price</label>
	<input
		type="number"
		name="price"
		id=""
		bind:value={price}
		placeholder="Product Price (Type or Paste here)"
		class="bg-slate-300 p-1 text-center placeholder:text-gray-600"
	/>
	<label for="barcode">Barcode</label>
	<input
		type="text"
		name="barcode"
		id=""
		placeholder="Product Barcode (Type or Paste here)"
		bind:value={barcode}
		class="bg-slate-300 p-1 text-center placeholder:text-gray-600"
	/>
	<div class="mt-2">
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black"
			on:click={() => {
				tagsStore.delete(tagId);
				closeFunc();
			}}>🗑 Delete Tag</button
		>
		<button on:click={closeFunc} class="rounded-md border-2 p-0.5 px-2 border-black"
			>✖ Close (Without Saving)</button
		>
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black"
			on:click={() => {
				if (!price || price?.toString().length === 0) {
					alert('Invalid price!');
					return;
				}
				tagsStore.update(tagId, {
					...tag,
					name,
					price,
					barcode
				});
				closeFunc();
			}}>💾 Save Tag*</button
		>
		<p>*Make sure price is up to date</p>
	</div>
</div>
