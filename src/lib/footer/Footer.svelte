<script lang="ts">
	const rename = () => {
		const newName = prompt('Rename', 'New Name');
		if (newName === null || newName === '') return;
		//TODO
	};
</script>

<footer
	class="bg-white flex align-middle justify-center space-x-1 shadow-[0_-10px_15px_-3px_rgb(0_0_0_/_0.1),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] p-3 mt-2"
>
	<p class="text-center text-gray-700">
		Made by <a
			class="underline"
			href="http://calebirwin.ca/"
			target="_blank"
			rel="noopener noreferrer"
			>Caleb Irwin
		</a>
		for
		<a
			href="https://www.officeexperts.ca/"
			class="underline"
			target="_blank"
			rel="noopener noreferrer">Office Experts</a
		>
	</p>
	<label for="label-set" class="pl-4 flex items-center text-gray-700">Label Set:</label>
	<select
		name="Label Set"
		id="label-set"
		class="text-gray-700 border-2 border-solid border-gray-500 rounded-md"
	>
		<option value="1">Test1 (5/1/2022 5:32; 123 Labels)</option>
		<option value="2">Test2</option>
		<option value="3">Test3</option>
	</select>
	<button
		on:click={rename}
		class="text-gray-700 border-2 border-solid border-gray-500 rounded-md px-1 hover:bg-gray-200"
		>Rename</button
	>
</footer>
