<script lang="ts">
	import { tagsStore } from '$lib/tagsStore';
	import { onMount } from 'svelte';

	onMount(() => {
		tagsStore.set(JSON.parse(localStorage.getItem('labels')));
	});
</script>

<svelte:head>
	<title>Verify Lables</title>
</svelte:head>

<h1>Verify Lables</h1>
<p class="text-center">
	Manuely verify labels before generating labels or merging into QuickBooks. Include <code
		>lastPrice</code
	>
	field in <a href="/load-json">JSON import</a> to be able to auto filter labels with small price
	changes. <br /> Note: Do not edit labels the standard way (<a href="/labels">Labels</a>) while
	verifying!
</p>
