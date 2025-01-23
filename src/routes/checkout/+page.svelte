<script lang="ts">
	import { getContextClient } from '@urql/svelte';
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
	} from '$lib/vendure';
	import Meta from '$lib/components/Meta.svelte';
	import { PUBLIC_SITE_NAME } from '$env/static/public';
	import CheckoutForm from '$src/lib/components/checkout/CheckoutForm.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import StripeComponent from '$src/lib/components/checkout/StripeComponent.svelte';
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
	//let selectedShippingOptions: string[] = $state([]);
	let selectedShippingOption: string = $state("");
	
	const adjustOrderLine = async (orderLineId: string, e: Event) => {
		const select = e.target as HTMLSelectElement;
		const quantity = parseInt(select.value);
		let result = await client.mutation(AdjustOrderLine, { orderLineId, quantity }).toPromise();
		console.log(result);
	};

	const getShippingOptions = async () => {
		let result = await client.query(GetOrderShippingMethods, {}).toPromise();
		if (result?.data?.eligibleShippingMethods){
			shippingOptions = result.data.eligibleShippingMethods;
			//multivendor select all shipping methods
			/*for (const method of shippingOptions) {
				//@ts-ignore
				selectedShippingOption.push(method.id);
			}*/
		}
		await selectCheapestShippingOption();
	};

	const selectCheapestShippingOption = async () => {
		if (shippingOptions) {
			let index = 0;
			if (index === useFragment(ShippingMethodQuote, shippingOptions).length) {
				errorMessage = 'There are no shipping options available.';
			} else {
				selectedShippingOption = useFragment(ShippingMethodQuote, shippingOptions)[index].id;
				const toSet = [selectedShippingOption]
				await setShippingOption(toSet);
			}
		}
	};

	const setShippingOption = async (id: string[]) => {
		let result = await client.mutation(SetOrderShippingMethod, { id }).toPromise();
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
			const validStates = ['AddingItems', 'ArrangingPayment', 'PaymentAuthorized', 'PaymentSettled'];
			if (!validStates.includes(state)) {
				throw new Error(`Invalid order state: ${state}. Must be one of: ${validStates.join(', ')}`);
			}

			const result = await client.mutation(TransitionOrderToState, { state }).toPromise();
			const transitionResult = result?.data?.transitionOrderToState;

			// Handle transition errors
			if (transitionResult?.__typename === "OrderStateTransitionError") {
				const transitionError = transitionResult.transitionError;
				
				// Handle specific case of trying to transition to same state
				if (transitionError.includes("Cannot transition Order from") && 
					transitionError.includes("to") && 
					transitionError.includes(state)) {
					toast.error(m.generic_error());
					
					// If we're stuck in ArrangingPayment, try to reset to AddingItems
					if (state === "ArrangingPayment") {
						await setOrderState("AddingItems");
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

	async function resetState(){
			await setOrderState('AddingItems');

	}	


	onMount(async () => {
		if (browser) {
			await getShippingOptions();
			loaded = true;
		}
	});
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
		description: m.checkout_description(),
	}}
/>

<div class="min-h-screen bg-gray-50">
	{JSON.stringify(selectedShippingOption)}
	<button onclick={async()=> setOrderState("ArrangingPayment")} class="button">authpAyment</button>
	<button class="button" onclick={resetState}>reset</button>
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
					<span class="text-sm font-medium text-gray-600">{m.safe_checkout()} {m.ssl_encryption()}</span>
				</div>
			</div>

			<CheckoutForm />

			<div class="mt-8">
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
					<!-- Cart Items and Shipping -->
					<div class="lg:col-span-7">
						<div class="space-y-6">
							<CartItems {order} {adjustOrderLine} />
							<!-- TODO make this working -->
							<DiscountCode />
						</div>
					</div>
					
					<!-- Order Summary -->
					<div class="lg:col-span-5">
						<div class="sticky top-8 space-y-6">
							<ShippingMethods {shippingOptions} {selectedShippingOption} {setShippingOption} />
							<OrderSummary {order}  {errorMessage}  />
						</div>
					</div>
				</div>
				<StripeComponent></StripeComponent>
			</div>
		</div>
	{/if}
</div>
