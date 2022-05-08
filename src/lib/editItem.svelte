<script lang="ts">
	import { labelStore } from '$lib/labelStore';

	export let tagId: number, closeFunc: () => void;
	let price: number,
		name: string,
		barcode: string,
		qbAccount: string,
		qbName: string,
		lastPrice: number,
		originalId = -1,
		editExtraFeilds: boolean = false;
	$: tag = labelStore.getTag(tagId);
	$: {
		if (tagId !== originalId) {
			price = tag.price;
			name = tag.name;
			barcode = tag.barcode;
			qbAccount = tag.qbAccount;
			qbName = tag.qbName;
			lastPrice = tag.lastPrice;
			originalId = tagId;
		}
	}
	$: {
		if (price === 0 || isNaN(price)) price = undefined;
		if (lastPrice === 0 || isNaN(lastPrice)) lastPrice = undefined;
		if (qbAccount === '') qbAccount = undefined;
		if (qbName === '') qbName = undefined;
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
	<button
		class="underline"
		on:click={() => {
			editExtraFeilds = !editExtraFeilds;
		}}>{editExtraFeilds ? 'Hide Extra Feilds' : 'Show Extra Feilds'}</button
	>
	{#if editExtraFeilds}
		<label for="account">QB Account</label>
		<input
			type="text"
			placeholder="Account in QuickBooks (Type or Paste here)"
			name="account"
			id=""
			bind:value={qbAccount}
			class="bg-slate-300 p-1 text-center placeholder:text-gray-600"
		/>
		<label for="name">QB Name</label>
		<input
			type="text"
			name="name"
			id=""
			bind:value={qbName}
			placeholder="Name in QuickBooks (Type or Paste here)"
			class="bg-slate-300 p-1 text-center placeholder:text-gray-600"
		/>
		<label for="lastPrice">Last Price</label>
		<input
			type="number"
			name="lastPrice"
			id=""
			placeholder="Previous Price (Type or Paste here)"
			bind:value={lastPrice}
			class="bg-slate-300 p-1 text-center placeholder:text-gray-600"
		/>
	{/if}
	<div class="mt-2">
		<button
			class="rounded-md border-2 p-0.5 px-2 border-black"
			on:click={() => {
				labelStore.delete(tagId);
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
				labelStore.update(tagId, {
					...tag,
					name,
					price,
					barcode,
					qbAccount,
					qbName,
					lastPrice
				});
				closeFunc();
			}}>💾 Save Tag*</button
		>
		<p>*Make sure price is up to date</p>
	</div>
</div>
