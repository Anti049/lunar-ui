<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	const { children } = $props();
</script>

<ModeWatcher defaultTheme="default" />
<div class="h-screen w-screen surface">
	{@render children()}
</div>
