<script lang="ts">
	import { getContextClient } from '@urql/svelte';
	import { SignUp } from '$lib/vendure';
	import { toast } from '$lib/toast.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const client = getContextClient();

	let stuff = $state({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		error: '',
		success: '',
		loading: false
	});

	async function signUp(e: SubmitEvent) {
		e.preventDefault();
		stuff.loading = true;
		stuff.error = '';
		if (stuff.password.length < 4) {
			toast.error(m.passwordTooShort());
			stuff.error = m.passwordTooShort();
			stuff.loading = false;
			return;
		}
		try {
			const result = await client
				.mutation(SignUp, {
					input: {
						emailAddress: stuff.email,
						password: stuff.password,
						firstName: stuff.firstName,
						lastName: stuff.lastName
					}
				})
				.toPromise();

			if (result.data?.registerCustomerAccount.__typename === 'Success') {
				toast.success(m.verification_email_sent());
				stuff.success = m.verification_email_sent();
			} else {
				toast.error(m.generic_error());
				//@ts-ignore
				stuff.error = result.data?.registerCustomerAccount.message || m.generic_error();
			}
		} catch (e) {
			stuff.error = m.unexpected_error();
		} finally {
			stuff.loading = false;
		}
	}
</script>

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold">
			{m.create_account()}
		</h2>
	</div>

	<div class="mt-8 text-black sm:mx-auto sm:w-full sm:max-w-md">
		<div class="border px-4 py-8 shadow sm:rounded-lg sm:px-10">
			<form class="space-y-6" onsubmit={signUp}>
				{#if stuff.error}
					<div class="rounded-md bg-red-50 p-4">
						<div class="flex">
							<div class="text-sm text-red-700">
								{stuff.error}
							</div>
						</div>
					</div>
				{/if}
				{#if stuff.success}
					<div class="rounded-md bg-green-50 p-4">
						<div class="flex">
							<div class="text-sm text-green-700">
								{stuff.success}
							</div>
						</div>
					</div>
				{/if}

				<div>
					<label for="firstName" class="block text-sm font-medium">
						{m.first_name()}
					</label>
					<div class="mt-1">
						<input
							id="firstName"
							name="firstName"
							type="text"
							required
							placeholder={m.placeholder_first_name()}
							bind:value={stuff.firstName}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<label for="lastName" class="block text-sm font-medium">
						{m.last_name()}
					</label>
					<div class="mt-1">
						<input
							id="lastName"
							name="lastName"
							type="text"
							required
							placeholder={m.placeholder_last_name()}
							bind:value={stuff.lastName}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<label for="email" class="block text-sm font-medium">
						{m.email()}
					</label>
					<div class="mt-1">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							placeholder={m.placeholder_email()}
							bind:value={stuff.email}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium">
						{m.password()}
					</label>
					<div class="mt-1">
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="new-password"
							required
							placeholder={m.placeholder_password()}
							bind:value={stuff.password}
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={stuff.loading}
						class="button disabled:cursor-not-allowed disabled:opacity-50"
					>
						{stuff.loading ? m.creating_account() : m.create_account()}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
