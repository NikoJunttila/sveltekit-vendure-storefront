<script lang="ts">
	import { onMount } from 'svelte';
	import { getContextClient } from '@urql/svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import { toast } from '$lib/toast.svelte';
	import { userStore } from '$lib/stores';
	import { GetCustomer, SignIn, GetActiveOrder } from '$src/lib/vendure';
	import AuthContainer from '$lib/components/account/AuthContainer.svelte';
	import Signup from '$lib/components/account/Signup.svelte';
	import RequestPassReset from '$lib/components/account/RequestPassReset.svelte';
	import Meta from '$lib/components/Meta.svelte';

	type UserState = 'signIn' | 'signUp' | 'forgot' | 'reset';
	let userState: UserState = $state('signIn');
	let processing = $state(false);
	let errors = $state({ email: '', password: '' });
	let userInfo = $state({ email: '', password: '' });

	const client = getContextClient();

	onMount(() => {
		if ($userStore) goto('/user');
	});

	function validateForm(): boolean {
		let isValid = true;
		errors = { email: '', password: '' };

		if (!userInfo.email) {
			errors.email = m.error_email_required();
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
			errors.email = m.error_email_invalid();
			isValid = false;
		}

		if (!userInfo.password) {
			errors.password = m.error_password_required();
			isValid = false;
		} else if (userInfo.password.length < 4) {
			errors.password = m.error_password_length();
			isValid = false;
		}

		return isValid;
	}

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		if (!validateForm()) return;

		processing = true;

		try {
			const result = await client
				.mutation(SignIn, {
					username: userInfo.email,
					password: userInfo.password,
					rememberMe: true
				})
				.toPromise();

			if (result?.data?.login.__typename === 'CurrentUser') {
				await Promise.all([
					client.query(GetCustomer, {}, { requestPolicy: 'network-only' }).toPromise(),
					client.query(GetActiveOrder, {}, { requestPolicy: 'network-only' }).toPromise()
				]);

				toast.success(m.welcome());
				await invalidateAll();
				await goto('/');
			} else {
				toast.error(m.error_login_invalid());
			}
		} catch (error) {
			console.error('Sign in error:', error);
			toast.error(m.error_general());
		} finally {
			processing = false;
		}
	}
</script>

<Meta
config={{
	title: m.sign_in(),
	description: m.sign_in()
}}
/>

<AuthContainer>
	{#if processing}
		<div class="flex items-center justify-center p-4">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
		</div>
	{:else if userState === 'signIn'}
		<form onsubmit={handleLogin} class="space-y-4">
			<h3 class="font-heading mb-4 text-center text-3xl font-semibold">
				{m.account_sign_in()}
			</h3>
			<p class="mb-6 text-lg">{m.login_text()}</p>

			<div class="space-y-2">
				<label class="block text-sm font-medium" for="email">
					{m.email()}
				</label>
				<input
					id="email"
					type="email"
					bind:value={userInfo.email}
					class="input w-full"
					class:border-red-500={errors.email}
				/>
				{#if errors.email}
					<p class="text-sm text-red-500">{errors.email}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<label class="block text-sm font-medium" for="password">
					{m.password()}
				</label>
				<input
					id="password"
					type="password"
					bind:value={userInfo.password}
					class="input w-full"
					class:border-red-500={errors.password}
				/>
				{#if errors.password}
					<p class="text-sm text-red-500">{errors.password}</p>
				{/if}
			</div>

			<button type="submit" class="button w-full">
				{m.account_sign_in()}
			</button>

			<div class="space-y-4 text-center text-sm font-medium">
				<div>
					<span>{m.account_need_account()}&nbsp;</span>
					<button type="button" onclick={() => (userState = 'signUp')} class="button">
						{m.create_account()}
					</button>
				</div>

				<button type="button" onclick={() => (userState = 'forgot')} class="button">
					{m.account_forgot_password()}
				</button>
			</div>
		</form>
	{:else if userState === 'signUp'}
		<Signup />
		<div class="mt-4 text-center text-sm font-medium">
			<span>{m.already_account()}&nbsp;</span>
			<button type="button" onclick={() => (userState = 'signIn')} class="button">
				{m.sign_in()}
			</button>
		</div>
	{:else if userState === 'forgot'}
		<RequestPassReset />
		<div class="pt-6 text-center text-sm font-medium">
			<button type="button" onclick={() => (userState = 'signIn')} class="button">
				&larr;&nbsp; {m.sign_in_instead()}
			</button>
		</div>
	{/if}
</AuthContainer>
