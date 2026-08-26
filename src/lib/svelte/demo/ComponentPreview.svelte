<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { Hash, Eye, Code } from '@lucide/svelte';
	import CodeBlock from '../components/CodeBlock.svelte';
	import { cn } from '$lib/utils';

	interface ComponentPreviewProps {
		title: string;
		id: string;
		description?: string;
		view?: 'component' | 'code';
		code?: string;
		editable?: boolean;
		children: Snippet<[]>;
	}
	let {
		title,
		id,
		description,
		view = $bindable('component'),
		code = $bindable(''),
		editable = false,
		children
	}: ComponentPreviewProps = $props();
	let previewBody: HTMLDivElement | undefined = $state();
	let codeContents = $derived(getCodeOfChildren());

	function getCodeOfChildren(): string {
		return previewBody
			? Array.from(previewBody.children)
					.map((child) => child.outerHTML)
					.join('\n')
			: '';
	}
	onMount(() => {
		codeContents = getCodeOfChildren();
	});
</script>

<div {id} class="component-preview">
	<div class="appbar">
		<div class="appbar-leading">
			<a href={'#' + id} class="button button-square button-md button-text button-surface">
				<Hash />
			</a>
		</div>
		<div class="appbar-body">
			<p class="appbar-title">{title}</p>
			{#if description}
				<p class="appbar-subtitle">{description}</p>
			{/if}
		</div>
		<div class="appbar-trailing">
			<button
				class={cn(
					'button button-square button-md button-surface',
					view === 'component' ? 'button-tonal' : 'button-text'
				)}
				aria-label="Show component"
				title="Show component"
				onclick={() => (view = 'component')}
			>
				<Eye />
			</button>
			<button
				class={cn(
					'button button-square button-md button-surface',
					view === 'code' ? 'button-tonal' : 'button-text'
				)}
				aria-label="Show code"
				title="Show code"
				onclick={() => (view = 'code')}
			>
				<Code />
			</button>
		</div>
	</div>
	<div
		bind:this={previewBody}
		class={cn('component-preview-body component-preview-body-pattern', view === 'code' && 'hidden')}
	>
		{@render children()}
	</div>
	<div class={cn('component-preview-body', view === 'code' ? '' : 'hidden')}>
		<CodeBlock bind:code {editable} lang="svelte" />
	</div>
</div>
