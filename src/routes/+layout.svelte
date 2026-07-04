<script lang="ts">
	import '../app.css';

	const { children } = $props();
</script>

<div
	class="w-screen h-screen surface text-body-small dark flex flex-col p-4 compact:p-6 medium:p-8"
>
	{@render children()}
</div>
