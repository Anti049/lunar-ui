<script lang="ts">
	import { componentLinks, isDisabled } from '$lib/utils';
	import { MaskedImage } from '$lib/svelte';
</script>

<div
	class="grid h-full w-full grid-cols-1 gap-4 compact:grid-cols-2 medium:grid-cols-3 expanded:grid-cols-4"
>
	{#each componentLinks as link (link.href)}
		<a
			href={link.href}
			class="flex flex-col gap-2 rounded-sm surface-container p-4 elevation-2 transition-all duration-200 hover:-translate-y-2 hover:elevation-4 {isDisabled(
				link
			)
				? 'pointer-events-none opacity-50'
				: ''}"
		>
			<p class="flex flex-row items-center gap-4 text-title-medium font-semibold">
				{#if link.icon}
					<MaskedImage
						src={link.icon}
						alt={link.label}
						class="aspect-square h-8 bg-current object-contain"
					/>
				{/if}
				{link.label}
			</p>
			<div class="h-0.5 w-full rounded-full surface-container-high"></div>
			<div class="component-card-body">
				<p>{link.label} component description goes here.</p>
			</div>
		</a>
	{/each}
</div>
