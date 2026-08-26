<script lang="ts">
	import ComponentPreview from '$lib/svelte/demo/ComponentPreview.svelte';
	import { cn } from '$lib/utils';

	let values = [
		{
			key: 'Surface',
			value: 'select-surface'
		},
		{
			key: 'Primary',
			value: 'select-primary'
		},
		{
			key: 'Secondary',
			value: 'select-secondary'
		},
		{
			key: 'Tertiary',
			value: 'select-tertiary'
		},
		{
			key: 'Error',
			value: 'select-error'
		},
		{
			key: 'Success',
			value: 'select-success'
		},
		{
			key: 'Warning',
			value: 'select-warning'
		},
		{
			key: 'Info',
			value: 'select-info'
		},
		{
			key: 'Alert',
			value: 'select-alert'
		}
	];
	let elevatedValue = $state(values[0]);
	let filledValue = $state(values[0]);
	let tonalValue = $state(values[0]);
	let outlinedValue = $state(values[0]);
	let textValue = $state(values[0]);
	let sizes = [
		{
			key: 'Extra Small',
			value: 'select-xs'
		},
		{
			key: 'Small',
			value: 'select-sm'
		},
		{
			key: 'Medium',
			value: 'select-md'
		},
		{
			key: 'Large',
			value: 'select-lg'
		},
		{
			key: 'Extra Large',
			value: 'select-xl'
		}
	];
	let sizeValue = $state(sizes[2]);
</script>

<div class="flex h-full w-full flex-col gap-8">
	<!-- Custom Select -->
	<div class="flex flex-col gap-2">
		<p class="text-headline-large-emphasized text-primary">Select</p>
		<p class="text-body-medium text-on-surface-variant">
			Displays a list of options for the user to choose from, triggered by a button.
		</p>
	</div>
	<!-- Elevated -->
	<ComponentPreview
		id="elevated"
		title="Elevated Select"
		description="Elevated selects are used for high emphasis actions."
		code={`
<select
	class={cn('select select-elevated', elevatedValue.value)}
	bind:value={elevatedValue.value}
>
	{#each values as item (item.value)}
		<option value={item.value}>{item.key}</option>
	{/each}
</select>
		`}
	>
		<select
			class={cn('select w-full max-w-64 select-elevated', elevatedValue.value)}
			bind:value={elevatedValue.value}
		>
			{#each values as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
	</ComponentPreview>
	<!-- Filled -->
	<ComponentPreview
		id="filled"
		title="Filled Select"
		description="Filled selects are used for medium emphasis actions."
		code={`
<select
	class={cn('select select-filled', filledValue.value)}
	bind:value={filledValue.value}
>
	{#each values as item (item.value)}
		<option value={item.value}>{item.key}</option>
	{/each}
</select>
		`}
	>
		<select
			class={cn('select w-full max-w-64 select-filled', filledValue.value)}
			bind:value={filledValue.value}
		>
			{#each values as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
	</ComponentPreview>
	<!-- Tonal -->
	<ComponentPreview
		id="tonal"
		title="Tonal Select"
		description="Tonal selects are used for medium emphasis actions."
		code={`
<select
	class={cn('select select-tonal', tonalValue.value)}
	bind:value={tonalValue.value}
>
	{#each values as item (item.value)}
		<option value={item.value}>{item.key}</option>
	{/each}
</select>
		`}
	>
		<select
			class={cn('select w-full max-w-64 select-tonal', tonalValue.value)}
			bind:value={tonalValue.value}
		>
			{#each values as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
	</ComponentPreview>
	<!-- Outlined -->
	<ComponentPreview
		id="outlined"
		title="Outlined Select"
		description="Outlined selects are used for medium emphasis actions."
		code={`
<select
	class={cn('select select-outlined', outlinedValue.value)}
	bind:value={outlinedValue.value}
>
	{#each values as item (item.value)}
		<option value={item.value}>{item.key}</option>
	{/each}
</select>
		`}
	>
		<select
			class={cn('select w-full max-w-64 select-outlined', outlinedValue.value)}
			bind:value={outlinedValue.value}
		>
			{#each values as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
	</ComponentPreview>
	<!-- Text -->
	<ComponentPreview
		id="text"
		title="Text Select"
		description="Text selects are used for medium emphasis actions."
		code={`
<select
	class={cn('select select-text', textValue.value)}
	bind:value={textValue.value}
>
	{#each values as item (item.value)}
		<option value={item.value}>{item.key}</option>
	{/each}
</select>
		`}
	>
		<select
			class={cn('select w-full max-w-64 select-text', textValue.value)}
			bind:value={textValue.value}
		>
			{#each values as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
	</ComponentPreview>
	<!-- Sizes -->
	<ComponentPreview
		id="sizes"
		title="Select Sizes"
		description="Selects can be sized to fit the needs of the user."
		code={`
<select 
	class={cn('select select-tonal', sizeValue.value)} 
	bind:value={sizeValue.value}
>
	{#each sizes as item (item.value)}
		<option value={item.value}>{item.key}</option>
	{/each}
</select>
		`}
	>
		<select
			class={cn('select w-full max-w-64 select-elevated', sizeValue.value)}
			bind:value={sizeValue.value}
		>
			{#each sizes as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
	</ComponentPreview>
	<!-- Disabled -->
	<ComponentPreview
		id="disabled"
		title="Disabled Select"
		description="Selects can be disabled to prevent user interaction."
		code={`
<select class="select select-tonal" disabled>
	<option value="surface">Surface</option>
	<option value="primary">Primary</option>
	<option value="secondary">Secondary</option>
	<option value="tertiary">Tertiary</option>
	<option value="error">Error</option>
	<option value="success">Success</option>
	<option value="warning">Warning</option>
	<option value="info">Info</option>
	<option value="alert">Alert</option>
</select>
`}
	>
		<select class="select w-full max-w-64 select-tonal" disabled>
			{#each values as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
	</ComponentPreview>
	<!-- Native Select -->
	<ComponentPreview
		id="native-select"
		title="Native Select"
		description="Native selects can also be used for consistent styling across different platforms."
		code={`
<select class="select select-tonal">
	<option value="surface">Surface</option>
	<option value="primary">Primary</option>
	<option value="secondary">Secondary</option>
	<option value="tertiary">Tertiary</option>
	<option value="error">Error</option>
	<option value="success">Success</option>
	<option value="warning">Warning</option>
	<option value="info">Info</option>
	<option value="alert">Alert</option>
</select>
...
`}
	>
		<select
			class={cn('select w-full max-w-64 select-tonal', tonalValue.value)}
			bind:value={tonalValue.value}
		>
			{#each values as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
		<select
			class={cn('select w-full max-w-64 select-filled', filledValue.value)}
			bind:value={filledValue.value}
		>
			{#each values as item (item.value)}
				<option value={item.value}>{item.key}</option>
			{/each}
		</select>
	</ComponentPreview>
</div>
