<script context="module">
	import { browser } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = true;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
</script>

<script lang="ts">
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section class="grid place-items-center flex-grow">
	<div class="max-w-md bg-gray-300 m-2 p-4 rounded-xl">
		<h1>Get Started</h1>
		<ul id="holder" class="text-center">
			<li>
				<a class="text-2xl underline" href="/labels" sveltekit:prefetch>Labels</a>
				<p class="text-lg ">Features</p>
				<ul>
					<li>Create, edit, and delete labels</li>
					<li>Auxiliary text (defaults to month/year)</li>
					<li>Generate printable pdfs</li>
					<li>Auto save (to <code>localStorage</code>)</li>
					<li>Scannable barcodes (UPC with CODE128 fallback)</li>
					<li>Generate 1000s of tags all at once</li>
					<li>30 tags per page</li>
					<li>Configurable export resolution scale</li>
				</ul>
			</li>
			<li>
				<a class="text-2xl underline" href="/load-json" sveltekit:prefetch>Load JSON</a>
				<p>
					Import your tags (in JSON format) to restore backups or to import from an external source.
				</p>
			</li>
			<li>
				<a class="text-2xl underline" href="/export-json" sveltekit:prefetch>Export JSON</a>
				<p>Export your tags (in JSON format) to backup or share your shelf labels.</p>
			</li>
		</ul>
		<p class="text-center pt-2">
			Made by <a
				class="underline"
				href="http://calebirwin.ca/"
				target="_blank"
				rel="noopener noreferrer"
				>Caleb Irwin
			</a>for Office Experts
		</p>
	</div>
</section>

<style lang="postcss">
	#holder > li {
		@apply m-2;
	}
	li {
		color: var(--heading-color);
	}
</style>
