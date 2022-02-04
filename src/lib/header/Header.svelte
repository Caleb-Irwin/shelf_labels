<script lang="ts">
	import { page } from '$app/stores';
	import logo from './favicon-32x32.png';
	let menuOpen = false;
</script>

<nav class="bg-white shadow-lg">
	<div class="max-w-6xl mx-auto px-4">
		<div class="flex justify-between">
			<div class="flex flex-grow justify-center">
				<div>
					<!-- Website Logo -->
					<a
						href="https://calebirwin.ca/"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center py-4 px-2"
					>
						<img src={logo} alt="Logo" class="h-8 w-8 mr-2" />
					</a>
				</div>
				<!-- Primary Navbar items -->
				<div class="hidden md:flex items-center space-x-1">
					<a
						href="/"
						sveltekit:prefetch
						class="py-4 px-2 {$page.url.pathname === '/'
							? 'text-orange-600 border-b-4 border-orange-600'
							: 'text-slate-900 hover:text-orange-600 transition duration-300'}  font-semibold "
						>Home</a
					>
					<a
						href="/labels"
						sveltekit:prefetch
						class="py-4 px-2 {$page.url.pathname === '/labels'
							? 'text-orange-600 border-b-4 border-orange-600'
							: 'text-slate-900 hover:text-orange-600 transition duration-300'}  font-semibold "
						>Labels</a
					>
					<a
						href="/load-json"
						sveltekit:prefetch
						class="py-4 px-2 {$page.url.pathname === '/load-json'
							? 'text-orange-600 border-b-4 border-orange-600'
							: 'text-slate-900 hover:text-orange-600 transition duration-300'}  font-semibold "
						>Load JSON</a
					>
					<!-- <a
						href="/load-spreadsheet"
						sveltekit:prefetch
						class="py-4 px-2 {$page.url.pathname === '/load-spreadsheet'
							? 'text-orange-600 border-b-4 border-orange-600'
							: 'text-slate-900 hover:text-orange-600 transition duration-300'}  font-semibold "
						>Load Sheet</a
					> -->
					<a
						href="/export-json"
						sveltekit:prefetch
						class="py-4 px-2 {$page.url.pathname === '/export-json'
							? 'text-orange-600 border-b-4 border-orange-600'
							: 'text-slate-900 hover:text-orange-600 transition duration-300'}  font-semibold "
						>Export JSON</a
					>
				</div>
			</div>
			<div class="md:hidden flex items-center" on:click={() => (menuOpen = !menuOpen)}>
				<button class="outline-none mobile-menu-button">
					<svg
						class=" w-6 h-6 text-gray-500 hover:text-green-500 "
						x-show="!showMenu"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>
		</div>
	</div>
	<!-- mobile menu -->
	<div class="{menuOpen ? '' : 'hidden'} md:hidden mobile-menu">
		<ul class="" on:click={() => (menuOpen = false)}>
			<li>
				<a
					href="/"
					sveltekit:prefetch
					class="block text-sm px-2 py-4 {$page.url.pathname === '/'
						? 'text-white bg-orange-600 font-semibold'
						: ''}">Home</a
				>
			</li>
			<li>
				<a
					href="/labels"
					sveltekit:prefetch
					class="block text-sm px-2 py-4 {$page.url.pathname === '/labels'
						? 'text-white bg-orange-600 font-semibold'
						: ''}">Labels</a
				>
			</li>
			<li>
				<a
					href="/load-json"
					sveltekit:prefetch
					class="block text-sm px-2 py-4 {$page.url.pathname === '/load-json'
						? 'text-white bg-orange-600 font-semibold'
						: ''}">Load JSON</a
				>
			</li>
			<!-- <li>
				<a
					href="/load-spreadsheet"
					sveltekit:prefetch
					class="block text-sm px-2 py-4 {$page.url.pathname === '/load-spreadsheet'
						? 'text-white bg-orange-600 font-semibold'
						: ''}">Load Sheet</a
				>
			</li> -->
			<li>
				<a
					href="/export-json"
					sveltekit:prefetch
					class="block text-sm px-2 py-4 {$page.url.pathname === '/export-json'
						? 'text-white bg-orange-600 font-semibold'
						: ''}">Export JSON</a
				>
			</li>
		</ul>
	</div>
</nav>
