<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import AuthContainer from '$src/lib/components/AuthContainer.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { toast } from '$lib/toast.svelte';
	import { getContextClient } from '@urql/svelte';
	import { GetCustomer } from '$src/lib/vendure/customer.graphql.js';
	import { GetActiveOrder } from '$src/lib/vendure/order.graphql.js';
	import { onMount } from 'svelte';
	import { SignIn } from '$src/lib/vendure/customer.graphql.js';
	import { userStore } from '$src/lib/stores';
	import Signup from '$src/lib/components/Signup.svelte';
	import RequestPassReset from '$src/lib/components/RequestPassReset.svelte';

	type UserState = 'signIn' | 'signUp' | 'forgot' | 'reset';
	let userState: UserState = $state('signIn');
	let processing: boolean = $state(false);
	let errors = $state({ email: '', password: '' });

	let userInfo = $state({
		email: '',
		password: ''
	});

	onMount(() => {
		if ($userStore) {
			goto('/user');
		}
	});

	const client = getContextClient();

	function validateForm(): boolean {
		let isValid = true;
		errors.email = '';
		errors.password = '';

		if (!userInfo.email) {
			errors.email = 'Email is required';
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
			errors.email = 'Please enter a valid email address';
			isValid = false;
		}

		if (!userInfo.password) {
			errors.password = 'Password is required';
			isValid = false;
		} else if (userInfo.password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
			isValid = false;
		}

		return isValid;
	}

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		
		if (!validateForm()) {
			return;
		}

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
				toast.error('Invalid email or password');
			}
		} catch (error) {
			console.error('Sign in error:', error);
			toast.error('An error occurred during sign in');
		} finally {
			processing = false;
		}
	}

	async function handleForgotPassword(event: SubmitEvent) {
		event.preventDefault();
		
		if (!userInfo.email) {
			errors.email = 'Email is required';
			return;
		}

		processing = true;
		
		try {
			// Implement your forgot password logic here
			toast.success('Password reset instructions sent to your email');
			userState = 'signIn';
		} catch (error) {
			console.error('Forgot password error:', error);
			toast.error('An error occurred while processing your request');
		} finally {
			processing = false;
		}
	}

	async function handleResetPassword(event: SubmitEvent) {
		event.preventDefault();
		
		if (!userInfo.password) {
			errors.password = 'Password is required';
			return;
		}

		processing = true;
		
		try {
			// Implement your reset password logic here
			toast.success('Password reset successfully');
			userState = 'signIn';
		} catch (error) {
			console.error('Reset password error:', error);
			toast.error('An error occurred while resetting your password');
		} finally {
			processing = false;
		}
	}
</script>

<AuthContainer>
	{#if processing}
		<div class="flex justify-center items-center p-4">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
		</div>
	{:else if userState === 'signIn'}
		<form onsubmit={handleLogin} class="space-y-4">
			<h3 class="font-heading mb-4 text-center text-3xl font-semibold">
				{m.account_sign_in()}
			</h3>
			<p class="mb-6 text-lg">
				{m.login_text()}
			</p>

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
					<p class="text-red-500 text-sm">{errors.email}</p>
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
					<p class="text-red-500 text-sm">{errors.password}</p>
				{/if}
			</div>

			<button type="submit" class="button w-full">
				{m.account_sign_in()}
			</button>

			<div class="text-center text-sm font-medium space-y-4">
				<div>
					<span>{m.account_need_account()}&nbsp;</span>
					<button
						type="button"
						onclick={() => (userState = 'signUp')}
						class="button"
					>
						{m.create_account()}
					</button>
				</div>

				<button
					type="button"
					onclick={() => (userState = 'forgot')}
					class="button"
				>
					{m.account_forgot_password()}
				</button>
			</div>
		</form>

	{:else if userState === 'signUp'}
		<Signup />
		<div class="text-center text-sm font-medium mt-4">
			<span>{m.already_account()}&nbsp;</span>
			<button
				type="button"
				onclick={() => (userState = 'signIn')}
				class="button"
			>
				{m.sign_in()}
			</button>
		</div>

	{:else if userState === 'forgot'}
	<RequestPassReset></RequestPassReset>


			<div class="pt-6 text-center text-sm font-medium">
				<button
					type="button"
					onclick={() => (userState = 'signIn')}
					class="button"
				>
					&larr;&nbsp; {m.sign_in_instead()}
				</button>
			</div>

	{:else if userState === 'reset'}
		<form onsubmit={handleResetPassword} class="space-y-4">
			<h3 class="font-heading mb-4 text-center text-3xl font-semibold">
				Reset Password
			</h3>

			<div class="space-y-2">
				<label class="block text-sm font-medium" for="new-password">
					{m.password()}
				</label>
				<input
					id="new-password"
					type="password"
					bind:value={userInfo.password}
					class="input w-full"
					class:border-red-500={errors.password}
				/>
				{#if errors.password}
					<p class="text-red-500 text-sm">{errors.password}</p>
				{/if}
			</div>

			<button type="submit" class="button w-full">
				{m.request_reset()}
			</button>
		</form>
	{/if}
</AuthContainer>