<script lang="ts">
	import { Hash } from '@lucide/svelte';
</script>

<div class="flex flex-col w-full h-full gap-8">
	<!-- Elevated -->
	<div id="elevated" class="component-preview">
		<div class="component-preview-header">
			<a href="#elevated" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Elevated Button</p>
		</div>
		<div class="component-preview-body">
			<button class="button button-elevated button-surface">Surface</button>
			<button class="button button-elevated button-primary">Primary</button>
			<button class="button button-elevated button-secondary">Secondary</button>
			<button class="button button-elevated button-tertiary">Tertiary</button>
			<button class="button button-elevated button-error">Error</button>
			<button class="button button-elevated button-success">Success</button>
			<button class="button button-elevated button-warning">Warning</button>
			<button class="button button-elevated button-info">Info</button>
			<button class="button button-elevated button-alert">Alert</button>
		</div>
	</div>
	<!-- Filled -->
	<div id="filled" class="component-preview">
		<div class="component-preview-header">
			<a href="#filled" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Filled Button</p>
		</div>
		<div class="component-preview-body">
			<button class="button button-filled button-surface">Surface</button>
			<button class="button button-filled button-primary">Primary</button>
			<button class="button button-filled button-secondary">Secondary</button>
			<button class="button button-filled button-tertiary">Tertiary</button>
			<button class="button button-filled button-error">Error</button>
			<button class="button button-filled button-success">Success</button>
			<button class="button button-filled button-warning">Warning</button>
			<button class="button button-filled button-info">Info</button>
			<button class="button button-filled button-alert">Alert</button>
		</div>
	</div>
	<!-- Tonal -->
	<div id="tonal" class="component-preview">
		<div class="component-preview-header">
			<a href="#tonal" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Tonal Button</p>
		</div>
		<div class="component-preview-body">
			<button class="button button-tonal button-surface">Surface</button>
			<button class="button button-tonal button-primary">Primary</button>
			<button class="button button-tonal button-secondary">Secondary</button>
			<button class="button button-tonal button-tertiary">Tertiary</button>
			<button class="button button-tonal button-error">Error</button>
			<button class="button button-tonal button-success">Success</button>
			<button class="button button-tonal button-warning">Warning</button>
			<button class="button button-tonal button-info">Info</button>
			<button class="button button-tonal button-alert">Alert</button>
		</div>
	</div>
	<!-- Outlined -->
	<div id="outlined" class="component-preview">
		<div class="component-preview-header">
			<a href="#outlined" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Outlined Button</p>
		</div>
		<div class="component-preview-body">
			<button class="button button-outlined button-surface">Surface</button>
			<button class="button button-outlined button-primary">Primary</button>
			<button class="button button-outlined button-secondary">Secondary</button>
			<button class="button button-outlined button-tertiary">Tertiary</button>
			<button class="button button-outlined button-error">Error</button>
			<button class="button button-outlined button-success">Success</button>
			<button class="button button-outlined button-warning">Warning</button>
			<button class="button button-outlined button-info">Info</button>
			<button class="button button-outlined button-alert">Alert</button>
		</div>
	</div>
	<!-- Text -->
	<div id="text" class="component-preview">
		<div class="component-preview-header">
			<a href="#text" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Text Button</p>
		</div>
		<div class="component-preview-body">
			<button class="button button-text button-surface">Surface</button>
			<button class="button button-text button-primary">Primary</button>
			<button class="button button-text button-secondary">Secondary</button>
			<button class="button button-text button-tertiary">Tertiary</button>
			<button class="button button-text button-error">Error</button>
			<button class="button button-text button-success">Success</button>
			<button class="button button-text button-warning">Warning</button>
			<button class="button button-text button-info">Info</button>
			<button class="button button-text button-alert">Alert</button>
		</div>
	</div>
	<!-- Sizes -->
	<div id="sizes" class="component-preview">
		<div class="component-preview-header">
			<a href="#sizes" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Button Sizes</p>
		</div>
		<div class="component-preview-body">
			<button class="button button-elevated button-surface button-xs">Extra Small</button>
			<button class="button button-elevated button-surface button-sm">Small</button>
			<button class="button button-elevated button-surface button-md">Medium</button>
			<button class="button button-elevated button-surface button-lg">Large</button>
			<button class="button button-elevated button-surface button-xl">Extra Large</button>
		</div>
	</div>
	<!-- Disabled -->
	<div id="disabled" class="component-preview">
		<div class="component-preview-header">
			<a href="#disabled" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Disabled Buttons</p>
		</div>
		<div class="component-preview-body">
			<button class="button button-elevated button-surface" disabled>Surface</button>
			<button class="button button-elevated button-primary" disabled>Primary</button>
			<button class="button button-elevated button-secondary" disabled>Secondary</button>
			<button class="button button-elevated button-tertiary" disabled>Tertiary</button>
			<button class="button button-elevated button-error" disabled>Error</button>
			<button class="button button-elevated button-success" disabled>Success</button>
			<button class="button button-elevated button-warning" disabled>Warning</button>
			<button class="button button-elevated button-info" disabled>Info</button>
			<button class="button button-elevated button-alert" disabled>Alert</button>
		</div>
	</div>
	<!-- Square & Circle -->
	<div id="square-circle" class="component-preview">
		<div class="component-preview-header">
			<a href="#square-circle" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Square & Circle Buttons</p>
		</div>
		<div class="component-preview-body">
			<button class="button button-elevated button-surface button-square button-md">Square</button>
			<button class="button button-elevated button-surface button-circle button-md">Circle</button>
		</div>
	</div>
</div>
