<script lang="ts" module>
	type T = Record<string, unknown>
	import { cn } from '$lib/utils'
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPathLeaves, formFieldProxy } from 'sveltekit-superforms'
	import ShowHideIcon from '$lib/components/ShowHideIcon.svelte'
	
	interface Props {
		form: SuperForm<T>
		field: FormPathLeaves<T>
		label?: string
		dataAttribute?: string
		type?: string
		reveal?: boolean
		class?: string
		labelClass?: string
		[key: string]: any
	}

	let {
		form,
		field,
		label = '',
		dataAttribute = 'true',
		type = 'text',
		reveal = $bindable(false),
		class: className = '',
		labelClass = '',
		...rest
	}: Props = $props()
	const defaultClass = 'w-full block py-3 px-4 text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-gray-300 rounded-md'
	const defaultLabelClass = 'block m-1 mt-4 text-gray-600 font-semibold'

	const { value, errors, constraints } = formFieldProxy(form, field)
</script>

{#if label}
	<label for={field} class={cn(defaultLabelClass, labelClass)} data-label={dataAttribute}>{label}</label>
{/if}
{#if type === 'password'}
	<ShowHideIcon bind:reveal={reveal}>
		{#if reveal}
			<input
				type="text"
				name={field}
				id={field}
				bind:value={$value}
				{...$constraints}
				{...rest} 
				data-text-input={dataAttribute}
				aria-describedby={$errors ? `${field}-error` : undefined}
				aria-invalid={$errors ? 'true' : undefined}
				aria-required={$constraints?.required ? "true" : undefined}
				class={cn(defaultClass, className)}
			/>
		{:else}
			<input
				type="password"
				name={field}
				id={field}
				bind:value={$value}
				{...$constraints}
				{...rest} 
				data-text-input={dataAttribute}
				aria-describedby={$errors ? `${field}-error` : undefined}
				aria-invalid={$errors ? 'true' : undefined}
				aria-required={$constraints?.required ? "true" : undefined}
				class={cn(defaultClass, className)}
			/>
		{/if}
	</ShowHideIcon>
{:else if type === 'textarea'}
	<textarea
		name={field}
		id={field}
		bind:value={$value}
		{...$constraints}
		{...rest} 
		data-text-input={dataAttribute}
		aria-describedby={$errors ? `${field}-error` : undefined}
		aria-invalid={$errors ? 'true' : undefined}
		aria-required={$constraints?.required ? "true" : undefined}
		class={cn(defaultClass, className)}
	></textarea>
{:else}
	<input
		type="text"
		name={field}
		id={field}
		bind:value={$value}
		{...$constraints}
		{...rest} 
		data-text-input={dataAttribute}
		aria-describedby={$errors ? `${field}-error` : undefined}
		aria-invalid={$errors ? 'true' : undefined}
		aria-required={$constraints?.required ? "true" : undefined}
		class={cn(defaultClass, className)}
	/>
{/if}
<span id={`${field}-error`} aria-live="assertive">
	{#if $errors?.length}
		{#each $errors as err}
			<span class="invalid" data-invalid>{err} </span>
		{/each}
	{/if}
</span>