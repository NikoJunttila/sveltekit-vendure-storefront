<script lang="ts">
	import { getContextClient } from '@urql/svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { AddOrderPayment, GetOrderPaymentMethods } from '$lib/vendure';
	import { useFragment } from '$lib/gql';
	import { ActiveOrder } from '$lib/vendure';
	import { cartStore } from '$lib/stores';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		setOrderState: (state: string) => Promise<boolean>;
		setShippingOption: (id: string[]) => Promise<void>;
		selectedShippingOption: string[];
	}

	let { setOrderState, setShippingOption, selectedShippingOption }: Props = $props();

	let order = $derived(useFragment(ActiveOrder, $cartStore));
	let methods = $state<{ code: string; name: string; isEligible: boolean }[]>([]);
	let selectedMethod = $state<string>('');
	let disabled = $state(false);
	let errorMessage = $state('');

	const client = getContextClient();

	onMount(async () => {
		const result = await client
			.query(GetOrderPaymentMethods, {}, { requestPolicy: 'network-only' })
			.toPromise();
		const eligible = (result?.data?.eligiblePaymentMethods ?? []).filter((mth) => mth.isEligible);
		methods = eligible;
		if (eligible.length > 0) selectedMethod = eligible[0].code;
	});

	async function sendPayment() {
		if (!selectedMethod) return;
		errorMessage = '';
		disabled = true;
		try {
			await setShippingOption(selectedShippingOption);
		} catch (e) {
			console.error(e);
		}
		try {
			await setOrderState('ArrangingPayment');
		} catch (e) {
			console.error(e);
			disabled = false;
			return;
		}
		const result = await client
			.mutation(AddOrderPayment, { input: { method: selectedMethod, metadata: {} } })
			.toPromise();

		const payment = result?.data?.addPaymentToOrder;
		if (!payment) {
			errorMessage = m.generic_error();
			disabled = false;
			return;
		}
		if (payment.__typename === 'Order') {
			goto(`/checkout/success/${order?.code}`);
			return;
		}
		errorMessage = ('message' in payment && payment.message) || m.generic_error();
		await setOrderState('AddingItems');
		disabled = false;
	}
</script>

<div>
	{#if errorMessage}
		<div class="rounded bg-red-100 p-3 text-sm text-red-700">{errorMessage}</div>
	{/if}

	{#if methods.length === 0}
		<p class="text-sm text-gray-600">No payment methods available.</p>
	{:else}
		<div class="space-y-2">
			{#each methods as method}
				<label class="flex items-center gap-2">
					<input
						type="radio"
						name="paymentMethod"
						value={method.code}
						bind:group={selectedMethod}
					/>
					<span>{method.name}</span>
				</label>
			{/each}
		</div>

		<button
			onclick={sendPayment}
			{disabled}
			class="mt-4 w-full rounded-lg bg-lime-600 px-5 py-3 text-base font-medium text-white duration-300 hover:bg-lime-700 disabled:bg-gray-500"
		>
			{m.complete_order()}
		</button>
	{/if}
</div>
