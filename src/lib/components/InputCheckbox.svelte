<script lang="ts" module>
	type T = Record<string, unknown>
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm, type FormPathLeaves, formFieldProxy } from 'sveltekit-superforms'

	interface Props {
		form: SuperForm<T>
		field: FormPathLeaves<T>
		label?: string
		dataAttribute?: string
		[key: string]: any
	}

	let {
		form,
		field = $bindable(),
		label = '',
		dataAttribute = 'true',
		...rest
	}: Props = $props()

	const { value, errors, constraints } = formFieldProxy(form, field)
</script>

<input 
	type="checkbox" 
	name={field} 
	id={field} 
	bind:checked={field} 
	{...$constraints}
	{...rest} 
	data-checkbox-input={dataAttribute}
	aria-describedby={$errors ? `${field}-error` : undefined}
	aria-invalid={$errors ? 'true' : undefined}
	aria-required={$constraints?.required ? "true" : undefined}
/> 
{#if label}
	<label for={field} data-label={dataAttribute}> {label}</label>
{/if}
<span id={`${field}-error`} aria-live="assertive">
	{#if $errors?.length}
		{#each $errors as err}
			<span class="invalid">{err} </span>
		{/each}
	{/if}
</span>