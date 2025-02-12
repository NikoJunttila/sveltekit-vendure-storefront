<script lang="ts">
	import { getContextClient } from '@urql/svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { type FragmentType, useFragment } from '$lib/gql';
	import { cartStore } from '$lib/stores';
	import {
		ActiveOrder,
		AdjustOrderLine,
		GetOrderShippingMethods,
		SetOrderShippingMethod,
		ShippingMethodQuote,
		TransitionOrderToState,
		RemoveOrderLine
	} from '$lib/vendure';
	import Meta from '$lib/components/Meta.svelte';
	import { PUBLIC_SITE_NAME, PUBLIC_VENDURE_MULTI } from '$env/static/public';
	import CheckoutForm from '$src/lib/components/checkout/CheckoutForm.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import Payment from '$src/lib/components/Payment.svelte';
	import CartItems from '$lib/components/checkout/CartItems.svelte';
	import ShippingMethods from '$lib/components/checkout/ShippingMethods.svelte';
	import DiscountCode from '$lib/components/checkout/DiscountCode.svelte';
	import OrderSummary from '$lib/components/checkout/OrderSummary.svelte';
	import { toast } from '$lib/toast.svelte';

	let errorMessage: string = $state('');
	let loaded: boolean = $state(false);

	const client = getContextClient();

	let order = $derived(useFragment(ActiveOrder, $cartStore));
	let shippingOptions: FragmentType<typeof ShippingMethodQuote>[] = $state([]);
	//multivendor stuff
	let selectedShippingOption: string[] = $state([]);
	//let selectedShippingOption: string = $state('');

	const adjustOrderLine = async (orderLineId: string, e: Event) => {
		const select = e.target as HTMLSelectElement;
		const quantity = parseInt(select.value);
		let result = await client.mutation(AdjustOrderLine, { orderLineId, quantity }).toPromise();
		console.log(result);
	};

	const getShippingOptions = async () => {
		let result = await client
			.query(GetOrderShippingMethods, {}, { requestPolicy: 'network-only' })
			.toPromise();
		if (result?.data?.eligibleShippingMethods) {
			shippingOptions = result.data.eligibleShippingMethods;

			//multivendor select all shipping methods
			if (PUBLIC_VENDURE_MULTI === 'multi') {
				for (const method of useFragment(ShippingMethodQuote, shippingOptions)) {
					if (method.name.includes('multi')) selectedShippingOption.push(method.id);
				}
			} else {
				//@ts-ignore
				selectedShippingOption.push(shippingOptions[0].id);
			}
		}
		await selectCheapestShippingOption();
	};

	const selectCheapestShippingOption = async () => {
		if (shippingOptions) {
			let index = 0;
			if (index === useFragment(ShippingMethodQuote, shippingOptions).length) {
				errorMessage = 'There are no shipping options available.';
			} else {
				await setShippingOption(selectedShippingOption);
			}
		}
	};

	const removeOrderLine = async (orderLineId: string) => {
		const result = await client
			.mutation(
				RemoveOrderLine,
				{ orderLineId: orderLineId },
				{ additionalTypenames: ['ActiveOrder'] }
			)
			.toPromise();
		if (result.error) toast.error(m.unexpected_error());
		else if (result.data) toast.success(m.item_removed());
	};

	const setShippingOption = async (id: string[]) => {
		if (PUBLIC_VENDURE_MULTI === 'multi') {
			let result = await client.mutation(SetOrderShippingMethod, { id }).toPromise();
		} else {
			const single = id[0];
			let result = await client.mutation(SetOrderShippingMethod, { id: single }).toPromise();
		}
		selectedShippingOption = id;
	};

	/**
	 * Transitions the order to a new state in the checkout process.
	 * Valid states are: 'AddingItems', 'ArrangingPayment', 'PaymentAuthorized', 'PaymentSettled'
	 *
	 * @param {string} state - The target state to transition the order to
	 * @returns {Promise<boolean>} Returns true if transition was successful, throws error otherwise
	 * @throws {Error} If the transition fails or results in an error
	 */
	const setOrderState = async (state: string): Promise<boolean> => {
		try {
			// Validate input state
			const validStates = [
				'AddingItems',
				'ArrangingPayment',
				'PaymentAuthorized',
				'PaymentSettled'
			];
			if (!validStates.includes(state)) {
				throw new Error(`Invalid order state: ${state}. Must be one of: ${validStates.join(', ')}`);
			}

			const result = await client.mutation(TransitionOrderToState, { state }).toPromise();
			const transitionResult = result?.data?.transitionOrderToState;

			// Handle transition errors
			if (transitionResult?.__typename === 'OrderStateTransitionError') {
				const transitionError = transitionResult.transitionError;

				// Handle specific case of trying to transition to same state
				if (
					transitionError.includes('Cannot transition Order from') &&
					transitionError.includes('to') &&
					transitionError.includes(state)
				) {
					toast.error(m.error_general());

					// If we're stuck in ArrangingPayment, try to reset to AddingItems
					if (state === 'ArrangingPayment') {
						await setOrderState('AddingItems');
					}
					return false;
				}

				// Handle other transition errors
				errorMessage = transitionError;
				toast.error(transitionError);
				throw new Error(transitionError);
			}

			// Clear any previous error messages on success
			errorMessage = '';
			return true;
		} catch (error) {
			// Log the error for debugging
			console.error('Order state transition failed:', error);

			// Re-throw the error to be handled by the caller
			throw error;
		}
	};
	onMount(async () => {
		if (browser) {
			await getShippingOptions();
			loaded = true;
		}
	});
	let showPaymentDialog = $state(false);
	let formValid = $state(false);
</script>

<noscript>
	<p>Please enable javascript to complete checkout.</p>
	<p>
		We use a third party (<a href="https://stripe.com">Stripe</a>) to process credit card payments
		for enhanced security. Making payments on this site using Stripe requires javascript.
	</p>
</noscript>

<Meta
	config={{
		title: m.checkout(),
		description: m.checkout_description()
	}}
/>

<div class="min-h-screen bg-gray-50">
	{#if loaded && !order?.lines}
		<div class="flex min-h-[50vh] items-center justify-center">
			<p class="text-lg text-gray-600">{m.cart_empty()}</p>
		</div>
	{:else if loaded && order?.lines && order?.lines.length > 0}
		<div class="mx-auto max-w-screen-2xl px-4 py-8">
			<div class="flex items-center justify-between border-b border-gray-200 pb-8">
				<div class="flex items-center space-x-4">
					<a href="/" class="flex-shrink-0">
						<img src="/logo.png" class="h-10 w-auto sm:h-12" alt={PUBLIC_SITE_NAME} />
					</a>
					<a href="/" class="flex duration-200 hover:scale-105">
						<ArrowLeft />
						{m.continue_shopping()}
					</a>
				</div>
				<div class="flex items-center space-x-2">
					<div class="rounded-full bg-lime-50 p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-lime-600"
						>
							<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
					</div>
					<span class="text-sm font-medium text-gray-600"
						>{m.safe_checkout()} {m.ssl_encryption()}</span
					>
				</div>
			</div>

			<CheckoutForm bind:valid={formValid} />

			<div class="mt-8">
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
					<!-- Cart Items and Shipping -->
					<div class="lg:col-span-7">
						<div class="space-y-6">
							<CartItems {order} {adjustOrderLine} {removeOrderLine} />
							<!-- TODO make this working -->
							<DiscountCode />
						</div>
					</div>
					<!-- Order Summary -->
					<div class="lg:col-span-5">
						<div class="sticky top-8 space-y-6">
							<ShippingMethods
								{shippingOptions}
								selectedShippingOption={selectedShippingOption[0]}
								{setShippingOption}
							/>
							<OrderSummary {order} {errorMessage} />
						</div>
					</div>
				</div>

				<div class="mt-8 text-center">
					<button
						id="payment"
						onclick={() => (showPaymentDialog = true)}
						disabled={!formValid}
						class="rounded-lg bg-primary-600 px-8 py-4 font-bold text-white transition-colors hover:bg-primary-700 disabled:bg-gray-500"
					>
						{m.proceed_to_payment()}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

{#if showPaymentDialog}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-black backdrop-blur-sm"
	>
		<div
			class="flex min-h-[100dvh] w-full max-w-[600px] items-center justify-center sm:h-auto sm:min-h-0"
		>
			<div
				class="relative w-full max-w-[95%] rounded-xl bg-white shadow-2xl sm:max-w-none sm:rounded-2xl"
			>
				<div
					class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent max-h-[90dvh] overflow-y-auto p-4 sm:p-6"
				>
					<div class="flex items-center justify-between pb-4">
						<h2 class="text-lg font-bold sm:text-xl">{m.payment_details()}</h2>
						<button
							onclick={() => (showPaymentDialog = false)}
							class="text-gray-600 hover:text-gray-800"
						>
							<span class="sr-only">{m.close()}</span>
							<svg
								aria-hidden="true"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<div class="space-y-4">
						<Payment {setOrderState} {setShippingOption} {selectedShippingOption} />
						<button
							onclick={() => (showPaymentDialog = false)}
							class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-lime-500 sm:text-base"
						>
							{m.cancel_payment()}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
