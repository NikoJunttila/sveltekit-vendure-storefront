<script lang="ts">
	import { getContextClient } from '@urql/svelte';
	import { RequestPasswordReset } from '$lib/vendure';
	import { toast } from '$lib/toast.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const client = getContextClient();

	let stuff = $state({
		email: '',
		error: '',
		loading: false
	});

	async function resetPass(e: SubmitEvent) {
		e.preventDefault();
		stuff.loading = true;
		stuff.error = '';
		try {
			const result = await client
				.mutation(RequestPasswordReset, {
					emailAddress: stuff.email
				})
				.toPromise();
			console.log(result);
			if (result.data?.requestPasswordReset?.__typename) {
				toast.success(m.account_email_sent());
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
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
			{m.account_reset_password()}
		</h2>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-primary-200 px-4 py-8 shadow dark:bg-primary-900 sm:rounded-lg sm:px-10">
			<form class="space-y-6" onsubmit={resetPass}>
				{#if stuff.error}
					<div class="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
						<div class="flex">
							<div class="text-sm text-red-700 dark:text-red-200">
								{stuff.error}
							</div>
						</div>
					</div>
				{/if}

				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
							class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={stuff.loading}
						class="flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{stuff.loading ? m.loading() : m.request_reset()}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
