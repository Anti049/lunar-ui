<script lang="ts">
	import { cn } from '$lib/utils';
	import { Hash } from '@lucide/svelte';

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
</script>

<div class="flex h-full w-full flex-col gap-8">
	<!-- Elevated -->
	<div id="elevated" class="component-preview">
		<div class="component-preview-header">
			<a href="#elevated" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Elevated Select</p>
		</div>
		<div class="component-preview-body">
			<select
				class={cn('select w-full max-w-64 select-elevated', elevatedValue.value)}
				bind:value={elevatedValue.value}
			>
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
		</div>
	</div>
	<!-- Filled -->
	<div id="filled" class="component-preview">
		<div class="component-preview-header">
			<a href="#filled" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Filled Select</p>
		</div>
		<div class="component-preview-body">
			<select
				class={cn('select w-full max-w-64 select-filled', filledValue.value)}
				bind:value={filledValue.value}
			>
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
		</div>
	</div>
	<!-- Tonal -->
	<div id="tonal" class="component-preview">
		<div class="component-preview-header">
			<a href="#tonal" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Tonal Select</p>
		</div>
		<div class="component-preview-body">
			<select
				class={cn('select w-full max-w-64 select-tonal', tonalValue.value)}
				bind:value={tonalValue.value}
			>
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
		</div>
	</div>
	<!-- Outlined -->
	<div id="outlined" class="component-preview">
		<div class="component-preview-header">
			<a href="#outlined" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Outlined Select</p>
		</div>
		<div class="component-preview-body">
			<select
				class={cn('select w-full max-w-64 select-outlined', outlinedValue.value)}
				bind:value={outlinedValue.value}
			>
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
		</div>
	</div>
	<!-- Text -->
	<div id="text" class="component-preview">
		<div class="component-preview-header">
			<a href="#text" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Text Select</p>
		</div>
		<div class="component-preview-body">
			<select
				class={cn('select w-full max-w-64 select-text', textValue.value)}
				bind:value={textValue.value}
			>
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
		</div>
	</div>
	<!-- Sizes -->
	<div id="sizes" class="component-preview">
		<div class="component-preview-header">
			<a href="#sizes" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Select Sizes</p>
		</div>
		<div class="component-preview-body">
			<select class="select w-full max-w-64 select-xs select-tonal">
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
			<select class="select w-full max-w-64 select-sm select-tonal">
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
			<select class="select w-full max-w-64 select-md select-tonal">
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
			<select class="select w-full max-w-64 select-lg select-tonal">
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
			<select class="select w-full max-w-64 select-xl select-tonal">
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
		</div>
	</div>
	<!-- Disabled -->
	<div id="disabled" class="component-preview">
		<div class="component-preview-header">
			<a href="#disabled" class="component-preview-anchor">
				<Hash />
			</a>
			<p>Disabled Select</p>
		</div>
		<div class="component-preview-body">
			<select class="select w-full max-w-64 select-tonal" disabled>
				{#each values as item (item.value)}
					<option value={item.value}>{item.key}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
