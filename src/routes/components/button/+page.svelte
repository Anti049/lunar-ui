<script lang="ts">
	import ComponentPreview from '$lib/svelte/demo/ComponentPreview.svelte';
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
	<ComponentPreview
		id="elevated"
		title="Elevated Button"
		description="Elevated buttons are used for high emphasis actions."
	>
		<button class="button button-elevated button-surface">Surface</button>
		<button class="button button-elevated button-primary">Primary</button>
		<button class="button button-elevated button-secondary">Secondary</button>
		<button class="button button-elevated button-tertiary">Tertiary</button>
		<button class="button button-elevated button-error">Error</button>
		<button class="button button-elevated button-success">Success</button>
		<button class="button button-elevated button-warning">Warning</button>
		<button class="button button-elevated button-info">Info</button>
		<button class="button button-elevated button-alert">Alert</button>
	</ComponentPreview>
	<!-- Filled -->
	<ComponentPreview
		id="filled"
		title="Filled Button"
		description="Filled buttons are used for medium emphasis actions."
	>
		<button class="button button-filled button-surface">Surface</button>
		<button class="button button-filled button-primary">Primary</button>
		<button class="button button-filled button-secondary">Secondary</button>
		<button class="button button-filled button-tertiary">Tertiary</button>
		<button class="button button-filled button-error">Error</button>
		<button class="button button-filled button-success">Success</button>
		<button class="button button-filled button-warning">Warning</button>
		<button class="button button-filled button-info">Info</button>
		<button class="button button-filled button-alert">Alert</button>
	</ComponentPreview>
	<!-- Tonal -->
	<ComponentPreview
		id="tonal"
		title="Tonal Button"
		description="Tonal buttons are used for low emphasis actions."
	>
		<button class="button button-tonal button-surface">Surface</button>
		<button class="button button-tonal button-primary">Primary</button>
		<button class="button button-tonal button-secondary">Secondary</button>
		<button class="button button-tonal button-tertiary">Tertiary</button>
		<button class="button button-tonal button-error">Error</button>
		<button class="button button-tonal button-success">Success</button>
		<button class="button button-tonal button-warning">Warning</button>
		<button class="button button-tonal button-info">Info</button>
		<button class="button button-tonal button-alert">Alert</button>
	</ComponentPreview>
	<!-- Outlined -->
	<ComponentPreview
		id="outlined"
		title="Outlined Button"
		description="Outlined buttons are used for low emphasis actions."
	>
		<button class="button button-outlined button-surface">Surface</button>
		<button class="button button-outlined button-primary">Primary</button>
		<button class="button button-outlined button-secondary">Secondary</button>
		<button class="button button-outlined button-tertiary">Tertiary</button>
		<button class="button button-outlined button-error">Error</button>
		<button class="button button-outlined button-success">Success</button>
		<button class="button button-outlined button-warning">Warning</button>
		<button class="button button-outlined button-info">Info</button>
		<button class="button button-outlined button-alert">Alert</button>
	</ComponentPreview>
	<!-- Text -->
	<ComponentPreview
		id="text"
		title="Text Button"
		description="Text buttons are used for low emphasis actions."
	>
		<button class="button button-text button-surface">Surface</button>
		<button class="button button-text button-primary">Primary</button>
		<button class="button button-text button-secondary">Secondary</button>
		<button class="button button-text button-tertiary">Tertiary</button>
		<button class="button button-text button-error">Error</button>
		<button class="button button-text button-success">Success</button>
		<button class="button button-text button-warning">Warning</button>
		<button class="button button-text button-info">Info</button>
		<button class="button button-text button-alert">Alert</button>
	</ComponentPreview>
	<!-- Sizes -->
	<ComponentPreview
		id="sizes"
		title="Button Sizes"
		description="Buttons come in a variety of sizes to fit different use cases."
	>
		<button class="button button-xs button-elevated button-surface">Extra Small</button>
		<button class="button button-sm button-elevated button-surface">Small</button>
		<button class="button button-md button-elevated button-surface">Medium</button>
		<button class="button button-lg button-elevated button-surface">Large</button>
		<button class="button button-xl button-elevated button-surface">Extra Large</button>
	</ComponentPreview>
	<!-- Disabled -->
	<ComponentPreview
		id="disabled"
		title="Disabled Buttons"
		description="Buttons can be disabled to prevent user interaction."
	>
		<button class="button button-elevated button-surface" disabled>Surface</button>
		<button class="button button-elevated button-primary" disabled>Primary</button>
		<button class="button button-elevated button-secondary" disabled>Secondary</button>
		<button class="button button-elevated button-tertiary" disabled>Tertiary</button>
		<button class="button button-elevated button-error" disabled>Error</button>
		<button class="button button-elevated button-success" disabled>Success</button>
		<button class="button button-elevated button-warning" disabled>Warning</button>
		<button class="button button-elevated button-info" disabled>Info</button>
		<button class="button button-elevated button-alert" disabled>Alert</button>
	</ComponentPreview>
	<!-- Square & Circle -->
	<ComponentPreview
		id="shapes"
		title="Button Shapes"
		description="Buttons can be square or circular to fit different design needs."
	>
		<button class="button button-square button-md button-elevated button-surface">Square</button>
		<button class="button button-circle button-md button-elevated button-surface">Circle</button>
	</ComponentPreview>
</div>
