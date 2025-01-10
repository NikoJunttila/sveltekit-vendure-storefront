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
	import { toast } from 'svelte-sonner';
	import { getContextClient } from '@urql/svelte';
	import { GetCustomer } from '$src/lib/vendure/customer.graphql.js';
	import { GetActiveOrder } from '$src/lib/vendure/order.graphql.js';
	import { onMount } from 'svelte';
	import { SignIn } from '$src/lib/vendure/customer.graphql.js';
	import { userStore } from '$src/lib/stores';
	let { data } = $props();

	type userstate = 'signIn' | 'signUp' | 'forgot' | 'reset';
	let userState: userstate = $state(data.code ? 'reset' : 'signIn');

	let userInfo = $state({
		email: '',
		password: ''
	});

	onMount(() => {
		if ($userStore) {
			goto('/user');
		}
	});

	let processing: boolean = $state(false);

	const client = getContextClient();

	async function login() {
		try {
			const result = await client
				.mutation(SignIn, {
					username: userInfo.email,
					password: userInfo.password,
					rememberMe: true
				})
				.toPromise();
			console.log(result);
			if (result?.data?.login.__typename === 'CurrentUser') {
				const result2 = await client
					.query(GetCustomer, {}, { requestPolicy: 'network-only' })
					.toPromise();
				const result3 = await client
					.query(GetActiveOrder, {}, { requestPolicy: 'network-only' })
					.toPromise();
				// Successfully logged in
				toast.success('Welcome');
				await invalidateAll();
				await goto('/');
			} else {
				// Login error
				console.log('error');
			}
		} catch (error) {
			console.error('Sign in error:', error);
		}
	}
	const signInForm = superForm(data.signInForm, {
		validators: zodClient(signInReq),
		onSubmit: () => {
			processing = true;
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
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
				toast.success(m.verification_email_sent());
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
			<form onsubmit={login}>
				<h3 class="font-heading mb-4 text-center text-3xl font-semibold">
					{m.account_sign_in()}
				</h3>
				{#if $signInMessage}
					<div class="message" class:text-red-600={page.status > 200}>{$signInMessage}</div>
				{:else}
					<p class="mb-6 text-lg">
						{m.login_text()}
					</p>
				{/if}
				<Field form={signInForm} name="email">
					<Control>
						{#snippet children({ props })}
							<Label>{m.email()}</Label>
							<input {...props} type="email" class="input" bind:value={userInfo.email} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
				<Field form={signInForm} name="password">
					<Control>
						{#snippet children({ props })}
							<Label>{m.password()}</Label>
							<input {...props} type="password" class="input" bind:value={userInfo.password} />
						{/snippet}
					</Control>
					<FieldErrors />
				</Field>
				<button type="submit" class="button">{m.account_sign_in()}</button>
				<AppleButton />
				<div class="text-center text-sm font-medium">
					<span>{m.account_need_account()}&nbsp;&nbsp;</span>
					<button
						type="button"
						onclick={() => {
							userState = 'signUp';
						}}
						class=""
					>
						{m.sign_up()}
					</button>
				</div>
				<div class="text-center text-sm font-medium">
					<button
						type="button"
						onclick={() => {
							userState = 'forgot';
						}}
						class="mt-4"
					>
						{m.account_forgot_password()}
					</button>
				</div>
			</form>
		{/if}
	{:else if userState === 'signUp'}
		<form method="POST" action="/account?/signUp" use:signUpEnhance>
			<h3 class="font-heading mb-4 text-center text-3xl font-semibold">
				{m.account_create()}
			</h3>
			<p class="mb-6 text-lg">
				{m.create_account_big()}
			</p>
			<Field form={signUpForm} name="fname">
				<Control>
					{#snippet children({ props })}
						<Label>{m.first_name()}</Label>
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
			<div class="text-center text-sm font-medium">
				<span>{m.already_account()}&nbsp;&nbsp;</span>
				<button
					type="button"
					onclick={() => {
						userState = 'signIn';
					}}
					class=""
				>
					{m.sign_in()}
				</button>
			</div>
		</form>
	{:else if userState === 'forgot'}
		<form method="POST" action="/account?/forgot" use:forgotEnhance>
			<h3 class="font-heading mb-4 text-center text-3xl font-semibold">
				{m.account_reset_password}
			</h3>
			<p class="mb-6 text-lg">
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
			<div class="pt-6 text-center text-sm font-medium">
				<button
					type="button"
					onclick={() => {
						userState = 'signIn';
					}}
					class=""
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
