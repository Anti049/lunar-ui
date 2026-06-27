<script lang="ts">
	import '../app.css';

	const { children } = $props();
</script>

<div class="h-screen w-screen surface">
	{@render children()}
</div>
