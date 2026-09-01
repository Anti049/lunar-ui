<script lang="ts">
	import ComponentPreview from '$lib/svelte/demo/ComponentPreview.svelte';
	import { cn } from '$lib/utils';
	import { Minus, Plus } from '@lucide/svelte';

	let disabled = $state(true);
</script>

<div class="flex h-full w-full flex-col gap-8">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<p class="text-headline-large-emphasized text-primary">Button</p>
		<p class="text-body-medium text-on-surface-variant">
			Buttons allow the user to take actions or make choices.
		</p>
	</div>
	<!-- Elevated -->
	<ComponentPreview id="elevated" title="Elevated Button">
		<button class="btn btn-elevated btn-surface">Surface</button>
		<button class="btn btn-elevated btn-primary">Primary</button>
		<button class="btn btn-elevated btn-secondary">Secondary</button>
		<button class="btn btn-elevated btn-tertiary">Tertiary</button>
		<button class="btn btn-elevated btn-error">Error</button>
		<button class="btn btn-elevated btn-success">Success</button>
		<button class="btn btn-elevated btn-warning">Warning</button>
		<button class="btn btn-elevated btn-info">Info</button>
		<button class="btn btn-elevated btn-alert">Alert</button>
	</ComponentPreview>
	<!-- Filled -->
	<ComponentPreview id="filled" title="Filled Button">
		<button class="btn btn-filled btn-surface">Surface</button>
		<button class="btn btn-filled btn-primary">Primary</button>
		<button class="btn btn-filled btn-secondary">Secondary</button>
		<button class="btn btn-filled btn-tertiary">Tertiary</button>
		<button class="btn btn-filled btn-error">Error</button>
		<button class="btn btn-filled btn-success">Success</button>
		<button class="btn btn-filled btn-warning">Warning</button>
		<button class="btn btn-filled btn-info">Info</button>
		<button class="btn btn-filled btn-alert">Alert</button>
	</ComponentPreview>
	<!-- Tonal -->
	<ComponentPreview id="tonal" title="Tonal Button">
		<button class="btn btn-tonal btn-surface">Surface</button>
		<button class="btn btn-tonal btn-primary">Primary</button>
		<button class="btn btn-tonal btn-secondary">Secondary</button>
		<button class="btn btn-tonal btn-tertiary">Tertiary</button>
		<button class="btn btn-tonal btn-error">Error</button>
		<button class="btn btn-tonal btn-success">Success</button>
		<button class="btn btn-tonal btn-warning">Warning</button>
		<button class="btn btn-tonal btn-info">Info</button>
		<button class="btn btn-tonal btn-alert">Alert</button>
	</ComponentPreview>
	<!-- Outlined -->
	<ComponentPreview id="outlined" title="Outlined Button">
		<button class="btn btn-outlined btn-surface">Surface</button>
		<button class="btn btn-outlined btn-primary">Primary</button>
		<button class="btn btn-outlined btn-secondary">Secondary</button>
		<button class="btn btn-outlined btn-tertiary">Tertiary</button>
		<button class="btn btn-outlined btn-error">Error</button>
		<button class="btn btn-outlined btn-success">Success</button>
		<button class="btn btn-outlined btn-warning">Warning</button>
		<button class="btn btn-outlined btn-info">Info</button>
		<button class="btn btn-outlined btn-alert">Alert</button>
	</ComponentPreview>
	<!-- Text -->
	<ComponentPreview id="text" title="Text Button">
		<button class="btn btn-text btn-surface">Surface</button>
		<button class="btn btn-text btn-primary">Primary</button>
		<button class="btn btn-text btn-secondary">Secondary</button>
		<button class="btn btn-text btn-tertiary">Tertiary</button>
		<button class="btn btn-text btn-error">Error</button>
		<button class="btn btn-text btn-success">Success</button>
		<button class="btn btn-text btn-warning">Warning</button>
		<button class="btn btn-text btn-info">Info</button>
		<button class="btn btn-text btn-alert">Alert</button>
	</ComponentPreview>
	<!-- Sizes -->
	<ComponentPreview id="sizes" title="Button Sizes">
		<button class="btn btn-xs btn-elevated btn-surface">Extra Small</button>
		<button class="btn btn-sm btn-elevated btn-surface">Small</button>
		<button class="btn btn-md btn-elevated btn-surface">Medium</button>
		<button class="btn btn-lg btn-elevated btn-surface">Large</button>
		<button class="btn btn-xl btn-elevated btn-surface">Extra Large</button>
	</ComponentPreview>
	<!-- Button with Icon -->
	<ComponentPreview id="icon" title="Button with Icon">
		<button class="btn btn-elevated btn-primary">
			<Plus />
			<span>Add</span>
		</button>
		<button class="btn btn-elevated btn-primary">
			<input
				type="checkbox"
				class="btn-leading pointer-events-none checkbox checkbox-sm"
				tabindex="-1"
			/>
			<span>Add</span>
		</button>
		<button class="btn btn-elevated btn-secondary">
			<span>Remove</span>
			<Minus />
		</button>
	</ComponentPreview>
	<!-- Disabled -->
	<ComponentPreview
		id="disabled"
		title="Disabled Buttons"
		description="Toggle the checkbox to enable or disable the buttons."
	>
		<button class="btn btn-elevated btn-surface" {disabled}>Surface</button>
		<button class="btn btn-elevated btn-primary" {disabled}>Primary</button>
		<button class="btn btn-elevated btn-secondary" {disabled}>Secondary</button>
		<button class="btn btn-elevated btn-tertiary" {disabled}>Tertiary</button>
		<button class="btn btn-elevated btn-error" {disabled}>Error</button>
		<button class="btn btn-elevated btn-success" {disabled}>Success</button>
		<button class="btn btn-elevated btn-warning" {disabled}>Warning</button>
		<button class="btn btn-elevated btn-info" {disabled}>Info</button>
		<button class="btn btn-elevated btn-alert" {disabled}>Alert</button>
		<button
			class={cn('btn btn-elevated', disabled ? 'btn-primary' : 'btn-surface')}
			onclick={() => (disabled = !disabled)}
		>
			<input
				type="checkbox"
				class={cn(
					'btn-leading pointer-events-none checkbox checkbox-sm checkbox-outlined',
					disabled && 'checkbox-primary'
				)}
				tabindex="-1"
				bind:checked={disabled}
			/>
			<span>{disabled ? 'Disabled' : 'Enabled'}</span>
		</button>
	</ComponentPreview>
	<!-- Square & Circle -->
	<ComponentPreview id="shapes" title="Button Shapes">
		<button class="btn btn-square btn-elevated btn-success">Square</button>
		<button class="btn btn-square btn-elevated btn-success">
			<Plus />
		</button>
		<button class="btn btn-circle btn-elevated btn-error">Circle</button>
		<button class="btn btn-circle btn-elevated btn-error">
			<Minus />
		</button>
	</ComponentPreview>
</div>
