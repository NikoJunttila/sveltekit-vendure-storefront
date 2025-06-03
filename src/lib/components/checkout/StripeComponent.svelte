<script lang="ts">
	import { getContextClient } from '@urql/svelte';
	import {
		PUBLIC_DEFAULT_CURRENCY,
		PUBLIC_STRIPE_KEY,
		PUBLIC_STRIPE_REDIRECT_URL
	} from '$env/static/public';
	import { StripePaymentIntent, ActiveOrder, TransitionOrderToState } from '../../vendure';
	import { useFragment } from '../../gql';
	import { Elements, PaymentElement } from '../../stripe/index';
	import { cartStore } from '../../stores';
	const client = getContextClient();
	import * as m from '$lib/paraglide/messages';

	let order = $derived(useFragment(ActiveOrder, $cartStore));
	let processing = $state(false);
	let errorMessage: string | undefined = $state('');

	const startPayment = async () => {
		const result = await client.mutation(StripePaymentIntent, {}).toPromise();
		console.log(result);
		return result?.data?.createStripePaymentIntent ? result.data.createStripePaymentIntent : '';
	};

	const setOrderState = async (state: string) => {
		let result = await client.mutation(TransitionOrderToState, { state }).toPromise();
	};
</script>

<main class="lg:flex lg:max-h-screen lg:min-h-full lg:flex-row-reverse lg:overflow-hidden">
	<section
		aria-labelledby="payment-heading"
		class="flex-auto overflow-auto px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-4"
	>
		<div class="mx-auto max-w-lg">
			<!-- Checkout Form -->
			<Elements
				publicKey={PUBLIC_STRIPE_KEY}
				let:stripe
				let:elements
				elementsOptions={{
					appearance: {
						theme: 'stripe'
					},
					mode: 'payment',
					currency: PUBLIC_DEFAULT_CURRENCY.toLowerCase(),
					amount: order?.totalWithTax
				}}
			>
				<form
					class="grid gap-y-8"
					onsubmit={async (e) => {
						e.preventDefault();
						if (processing) return;
						processing = true;
						try {
							await setOrderState('ArrangingPayment');

							const clientSecret = await startPayment();
							console.log('Client Secret:', clientSecret); // Debug this

							if (!clientSecret || !clientSecret.includes('_secret_')) {
								throw new Error('Invalid client secret received');
							}
							//@ts-ignore
							const { error: submitError } = await elements?.submit();
							if (submitError) {
								errorMessage = submitError.message;
								processing = false;
								return;
							}
							//@ts-ignore
							const { error } = await stripe?.confirmPayment({
								elements,
								clientSecret,
								confirmParams: {
									return_url: `${PUBLIC_STRIPE_REDIRECT_URL}/${order?.code}`
								}
							});

							if (error) {
								errorMessage = error.message;
								processing = false;
							}
						} catch {
							await setOrderState('AddingItems');
							errorMessage = m.generic_error();
							processing = false;
						}
					}}
				>
					<!-- Payment -->
					<section id="payment">
						<h3 class="mb-3 text-xl font-medium text-gray-900" id="payment-heading">Payment</h3>
						<PaymentElement />
					</section>
					{#if errorMessage}
						<p class="text-lg font-semibold text-red-600">{errorMessage}</p>
					{/if}
					<!-- Submission -->
					<button
						disabled={processing}
						type="submit"
						class="w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700"
					>
						{#if processing}
							{m.processing()}...{:else}
							{m.complete_order()}
						{/if}
					</button>
					<p class="flex justify-center pb-4 text-sm font-medium text-gray-500">
						<svg
							class="mr-1.5 h-5 w-5 text-gray-400"
							aria-hidden="true"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
								clip-rule="evenodd"
							/>
						</svg>
						{m.stripe_handles()}
					</p>
				</form>
			</Elements>
		</div>
	</section>
</main>
