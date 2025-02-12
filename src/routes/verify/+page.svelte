<script lang="ts">
	import { VerifyCustomerAccount } from '$lib/vendure';
	import { getContextClient } from '@urql/svelte';
	import { onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from '$lib/toast.svelte';
	import { GetCustomer } from '$src/lib/vendure/customer.graphql.js';
	import { GetActiveOrder } from '$src/lib/vendure/order.graphql.js';
	import * as m from '$lib/paraglide/messages.js';

	const { data } = $props();
	const token = $derived(data.code);
	const client = getContextClient();
	let success = $state<{
		verifyCustomerAccount: {
			id?: string;
			identifier?: string;
			errorCode?: string;
			message?: string;
			__typename: string;
		} | null;
	} | null>(null);

	onMount(async () => {
		if (token) {
			success = await client
				.mutation(VerifyCustomerAccount, { token })
				.toPromise()
				.then((result: any) => result.data);
		}
		if (success!.verifyCustomerAccount?.__typename == 'CurrentUser') {
			toast.success(m.redirect());
			setTimeout(async () => {
				await invalidateAll();
				await Promise.all([
					client.query(GetCustomer, {}, { requestPolicy: 'network-only' }).toPromise(),
					client.query(GetActiveOrder, {}, { requestPolicy: 'network-only' }).toPromise()
				]);
				goto('/user');
			}, 2000);
		}
	});
</script>

{#if token}
	{#if success && success.verifyCustomerAccount}
		{#if success.verifyCustomerAccount.__typename === 'CurrentUser'}
			<div>
				<h2>{m.account_verified()}</h2>
				<p>{m.email()}: {success.verifyCustomerAccount.identifier}</p>
			</div>
		{:else if success.verifyCustomerAccount.__typename === 'VerificationTokenInvalidError'}
			<div>
				<h2>{m.verification_failed()}</h2>
				<p>{m.unexpected_error} {success.verifyCustomerAccount.message}</p>
				<p>Code: {success.verifyCustomerAccount.errorCode}</p>
			</div>
		{:else}
			<div>{m.unexpected_type()} {success.verifyCustomerAccount.__typename}</div>
		{/if}
	{:else}
		<div>{m.verifying_account()}</div>
	{/if}
{:else}
	<div>
		{m.hello_world({ name: 'test' })}
	</div>
{/if}
