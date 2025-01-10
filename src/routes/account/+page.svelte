<script lang="ts">
	import { page } from '$app/state';
	import { goto, invalidateAll } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signInReq, signUpReq, forgotReq, resetReq } from '$lib/validators';
    import AuthContainer from '$src/lib/components/AuthContainer.svelte';
	import { Field, Control, Label, FieldErrors } from 'formsnap';
	import AppleButton from '$lib/components/AppleButton.svelte';
    import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	type userstate = 'signIn' | 'signUp' | 'forgot' | 'reset';
	let userState: userstate = $state(data.code ? 'reset' : 'signIn');

	let processing: boolean = $state(false);

	const handleSignIn = async function () {
		await invalidateAll();
		await goto(data.rurl ? data.rurl : '/');
	};

	const signInForm = superForm(data.signInForm, {
		validators: zodClient(signInReq),
		onSubmit: () => {
            console.log("sent login request")
			processing = true;
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
                console.log(result)
				handleSignIn();
			} else {
				processing = false;
			}
		}
	});
	const { form: signInFormData, enhance: signInEnhance, message: signInMessage } = signInForm;

	const signUpForm = superForm(data.signUpForm, {
		validators: zodClient(signUpReq),
		onSubmit: () => {
			processing = true;
		},
		onResult: ({ result }) => {
			console.log(result);
			if (result.type === 'success') {
				// handleSignIn()
				// verify email
			} else {
				processing = false;
			}
		}
	});
	const { form: signUpFormData, enhance: signUpEnhance, message: signUpMessage } = signUpForm;

	const forgotForm = superForm(data.forgotForm, {
		validators: zodClient(forgotReq),
		onSubmit: () => {
			processing = true;
		},
		onResult: ({ result }) => {
			processing = false;
		}
	});
	const { form: forgotFormData, enhance: forgotEnhance, message: forgotMessage } = forgotForm;

	const resetForm = superForm(data.resetForm, {
		validators: zodClient(resetReq),
		onSubmit: () => {
			processing = true;
		},
		onResult: ({ result }) => {
			processing = false;
		}
	});
	const { form: resetFormData, enhance: resetEnhance, message: resetMessage } = resetForm;
</script>

<AuthContainer>
	{#if userState === 'signIn'}
		{#if processing}
			<div class="message">Processing...</div>
		{:else}
			<form method="POST" action="/account?/signIn" use:signInEnhance>
				<h3 class="font-heading mb-4 text-center text-3xl font-semibold text-gray-900">
					{m.account_sign_in()}
				</h3>
				{#if $signInMessage}
					<div class="message" class:text-red-600={page.status > 200}>{$signInMessage}</div>
				{:else}
					<p class="mb-6 text-lg text-gray-500">
						{m.login_text()}
					</p>
				{/if}
				<Field form={signInForm} name="email">
					<Control>
						{#snippet children({ props })}
							<Label>{m.email()}</Label>
							<input {...props} type="email" bind:value={$signInFormData.email} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
				<Field form={signInForm} name="password">
					<Control>
						{#snippet children({ props })}
							<Label>{m.password()}</Label>
							<input {...props} type="password" bind:value={$signInFormData.password} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
				<button type="submit" class="button">{m.account_sign_in()}</button>
				<AppleButton />
				<div class="text-center text-sm font-medium text-gray-900">
					<span>{m.account_need_account()}&nbsp;&nbsp;</span>
					<button
						type="button"
						onclick={() => {
							userState = 'signUp';
						}}
						class="text-orange-900 hover:text-orange-700"
					>
						{m.sign_up()}
					</button>
				</div>
				<div class="text-center text-sm font-medium text-gray-900">
					<button
						type="button"
						onclick={() => {
							userState = 'forgot';
						}}
						class="mt-4 hover:text-gray-700"
					>
                        {m.account_forgot_password()}
					</button>
				</div>
			</form>
		{/if}
	{:else if userState === 'signUp'}
		<form method="POST" action="/account?/signUp" use:signUpEnhance>
			<h3 class="font-heading mb-4 text-center text-3xl font-semibold text-gray-900">
                {m.account_create()}
			</h3>
			<p class="mb-6 text-lg text-gray-500">
                {m.create_account_big()}
			</p>
			<Field form={signUpForm} name="fname">
				<Control>
					{#snippet children({ props })}
						<Label>{m.email()}</Label>
						<input {...props} type="text" bind:value={$signUpFormData.fname} />
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>
			<Field form={signUpForm} name="lname">
				<Control>
					{#snippet children({ props })}
						<Label>{m.last_name()}</Label>
						<input {...props} type="text" bind:value={$signUpFormData.lname} />
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>
			<Field form={signUpForm} name="email">
				<Control>
					{#snippet children({ props })}
						<Label>{m.email()}</Label>
						<input {...props} type="email" bind:value={$signUpFormData.email} />
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>
			<Field form={signUpForm} name="password">
				<Control>
					{#snippet children({ props })}
						<Label>{m.password()}</Label>
						<input {...props} type="password" bind:value={$signUpFormData.password} />
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>
			<button type="submit" class="button">{m.create_account()}</button>
			<AppleButton />
			<div class="text-center text-sm font-medium text-gray-900">
				<span>{m.already_account()}&nbsp;&nbsp;</span>
				<button
					type="button"
					onclick={() => {
						userState = 'signIn';
					}}
					class="text-orange-900 hover:text-orange-700"
				>
					{m.sign_in()}
				</button>
			</div>
		</form>
	{:else if userState === 'forgot'}
		<form method="POST" action="/account?/forgot" use:forgotEnhance>
			<h3 class="font-heading mb-4 text-center text-3xl font-semibold text-gray-900">
                {m.account_reset_password}
			</h3>
			<p class="mb-6 text-lg text-gray-500">
                {m.account_reset_pass()}
			</p>
			<Field form={forgotForm} name="email">
				<Control>
					{#snippet children({ props })}
						<Label>{m.email()}</Label>
						<input {...props} type="email" bind:value={$forgotFormData.email} />
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>
			<button type="submit" class="button">{m.request_reset()}</button>
			<div class="pt-6 text-center text-sm font-medium text-gray-900">
				<button
					type="button"
					onclick={() => {
						userState = 'signIn';
					}}
					class="text-gray-900 hover:text-orange-700"
				>
					&larr;&nbsp; {m.sign_in_instead()}
				</button>
			</div>
		</form>
	{:else if userState === 'reset'}
		<form method="POST" action="/account?/reset" use:resetEnhance>
			<Field form={resetForm} name="password">
				<Control>
					{#snippet children({ props })}
						<Label>{m.password()}</Label>
						<input {...props} type="password" bind:value={$resetFormData.password} />
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>
			<button type="submit" class="button">{m.request_reset()}</button>
		</form>
	{/if}
</AuthContainer>
