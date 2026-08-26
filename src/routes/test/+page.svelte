<script lang="ts">
	import CodeBlock from '$lib/svelte/components/CodeBlock.svelte';

	let code = /* html */ `/* Example Svelte component */
<style lang="postcss">
	.foo {
		color: var(--color-on-surface);
		background-color: #000000;
		@apply flex flex-col gap-2;
	}
<\/style>
<script>
	export let user = {
		name: 'John Doe',
		role: 'Admin',
		age: 32
	};
	let age: number = user.age;
	// Function to handle button click
	function handleClick() {
		alert('Clicked!');
	}
<\/script>
<div class="user-card">
	<h2>\${user.name} - User 0</h2>
	<p>Role: <strong>\${user.role}</strong></p>
	<button onclick={handleClick}>View Profile</button>
</div>`;
</script>

<div data-theme="gaziter">
	<CodeBlock {code} lang="svelte" />
</div>
