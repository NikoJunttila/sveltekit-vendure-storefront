<script lang="ts">
	import { getContextClient } from '@urql/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { type FragmentType, useFragment } from '$lib/gql';
	import { cartStore} from '$lib/stores';
	import {
		ActiveOrder,
		AddOrderPayment,
		AdjustOrderLine,
		GetOrderShippingMethods,
		SetOrderShippingMethod,
		ShippingMethodQuote,
		TransitionOrderToState
	} from '$lib/vendure';
	import { formatCurrency } from '$lib/utils';
	import Meta from '$lib/components/Meta.svelte';
	import Image from '$lib/components/Image.svelte';
	import { PUBLIC_DEFAULT_CURRENCY, PUBLIC_SITE_NAME } from '$env/static/public';
	import CheckoutForm from '$lib/components/CheckoutForm.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let disabled: boolean = $state(false);
	let paymentEmpty: boolean = true;
	let errorMessage: string = $state('');
	let loaded: boolean = $state(false);

	const client = getContextClient();

	let order = $derived(useFragment(ActiveOrder, $cartStore));
	let shippingOptions: FragmentType<typeof ShippingMethodQuote>[] = $state([]);
	let selectedShippingOption: string = $state('');
	let discountFormOpen = $state(false);

	const toggleDiscountForm = () => {
		let discountForm = document.getElementById('discount-form') as HTMLElement;
		if (discountFormOpen) {
			discountForm.classList.add('hidden');
			discountFormOpen = false;
		} else {
			discountForm.classList.remove('hidden');
			discountFormOpen = true;
		}
	};

	const adjustOrderLine = async (orderLineId: string, e: Event) => {
		const select = e.target as HTMLSelectElement;
		const quantity = parseInt(select.value);
		let result = await client.mutation(AdjustOrderLine, { orderLineId, quantity }).toPromise();
		console.log(result);
	};

	const getShippingOptions = async () => {
		let result = await client.query(GetOrderShippingMethods, {}).toPromise();
		// console.log(result)
		if (result?.data?.eligibleShippingMethods)
			shippingOptions = result.data.eligibleShippingMethods;
		// check if order already has shipping method set
		if (order?.shippingLines[0]?.shippingMethod?.id) {
			// make sure it's still available
			if (
				useFragment(ShippingMethodQuote, shippingOptions)
					.map((option) => option.id)
					.includes(order.shippingLines[0].shippingMethod.id)
			) {
				selectedShippingOption = order.shippingLines[0].shippingMethod.id;
				return;
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
				selectedShippingOption = useFragment(ShippingMethodQuote, shippingOptions)[index].id;
				await setShippingOption(selectedShippingOption);
			}
		}
	};

	const setShippingOption = async (id: string) => {
		let result = await client.mutation(SetOrderShippingMethod, { id }).toPromise();
		// console.log(result)
	};

	const setOrderState = async (state: string) => {
		let result = await client.mutation(TransitionOrderToState, { state }).toPromise();
		switch (result.data?.transitionOrderToState?.__typename) {
				case 'Order':
					// Adding payment succeeded!
					window.location.href = `/checkout/success/${order?.code}`;
					break;
				case 'OrderStateTransitionError':
					errorMessage = result.data.transitionOrderToState.transitionError;
					toast.error(`${result.data.transitionOrderToState.transitionError}}`)
					throw new Error(result.data.transitionOrderToState.transitionError)
			}
	};

	async function sendPayment() {
		errorMessage = ""
		disabled = true;
		try {
			// ensure the method set is what is showing on this page
			// protects against method being changed on another page
			// the final shipping method should be the one on the page submitted
			await setShippingOption(selectedShippingOption);
		} catch (e) {
			console.log(e);
		}
		try {
			await setOrderState('ArrangingPayment');
		} catch (e) {
			console.log(e);
			disabled = false;
			return
		}
		try {
			const payload = 'xdd'; //
			//console.log(payload);
			let result = await client
				.mutation(AddOrderPayment, { input: { method: 'standard-payment', metadata: payload } })
				.toPromise()
				.then((result) => result?.data?.addPaymentToOrder);
			console.log(result);
			switch (result?.__typename) {
				case 'Order':
					// Adding payment succeeded!
					window.location.href = `/checkout/success/${order?.code}`;
					break;
				case 'OrderStateTransitionError':
				case 'OrderPaymentStateError':
				case 'PaymentDeclinedError':
				case 'PaymentFailedError':
				// Display an error to the customer
				// dropin.clearSelectedPaymentMethod()
				case 'NoActiveOrderError':
					console.log('Active order not found');
			}
		} catch (e) {
			await setOrderState('AddingItems');
			errorMessage = 'Something went wrong when connecting to our payment provider.';
			console.log(e);
		}
		disabled = false;
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

</noscript>
<Meta
	config={{
		title: m.checkout(),
		description: m.checkout_description(),
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

			<form class="mt-8">
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-12">
					<!-- Cart Items and Shipping -->
					<div class="lg:col-span-7">
						<div class="space-y-6">
							<!-- Cart Items -->
							<section class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
								<div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
									<h2 class="text-lg font-semibold text-gray-900">{m.cart_items()}</h2>
								</div>
								<ul class="divide-y divide-gray-200">
									{#if order?.lines}
										{#each order.lines as line}
											<li class="p-6">
												<div class="flex space-x-6">
													<Image
														preview={line.featuredAsset?.preview}
														alt={line.productVariant.name}
														preset="thumb"
														class="h-24 w-24 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-32 sm:w-32"
													/>
													<div class="flex flex-1 flex-col justify-between">
														<div class="space-y-2">
															<h3 class="text-base font-medium text-gray-900">
																{line.productVariant.name}
															</h3>
															<p class="text-sm font-medium text-gray-900">
																{formatCurrency(line.unitPrice, PUBLIC_DEFAULT_CURRENCY)}
															</p>
														</div>
														<div class="flex items-center space-x-4">
															<label for="quantity" class="text-sm text-gray-600"
																>{m.quantity({ count: line.quantity })}</label
															>
															<select
																name="quantity"
																class="rounded-md text-black border-gray-300 text-sm shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm"
																onchange={async (e) => adjustOrderLine(line.id, e)}
															>
																{#each Array.from({ length: 20 }, (_, i) => i + 1) as qty}
																	<option
																		value={qty}
																		selected={qty === line.quantity}
																		class="text-sm text-black"
																	>
																		{qty}
																	</option>
																{/each}
															</select>
														</div>
													</div>
												</div>
											</li>
										{/each}
									{/if}
								</ul>
							</section>

							<!-- Shipping Method -->
							<section class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
								<div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
									<h2 class="text-lg font-semibold text-gray-900">{m.delivery_methods()}</h2>
								</div>
								<div class="p-6">
									<div class="space-y-4" role="radiogroup">
										{#each useFragment(ShippingMethodQuote, shippingOptions) as shippingOption}
											<label class="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:border-lime-500">
												<input
													onchange={() => setShippingOption(selectedShippingOption)}
													type="radio"
													name="selectedShippingOption"
													value={shippingOption.id}
													bind:group={selectedShippingOption}
													class="h-4 w-4 border-gray-300 text-lime-600 focus:ring-lime-500"
												/>
												<div class="flex flex-1 items-center justify-between">
													<span class="text-sm font-medium text-gray-900"
														>{shippingOption.name}</span
													>
													<span class="text-sm font-medium text-gray-900">
														{formatCurrency(shippingOption.price, PUBLIC_DEFAULT_CURRENCY)}
													</span>
												</div>
											</label>
										{:else}
											<p class="text-sm text-gray-500">No shipping options available</p>
										{/each}
									</div>
								</div>
							</section>

							<!-- Discount Code -->
							<section class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
								<div class="p-6">
									<button
										type="button"
										onclick={toggleDiscountForm}
										class="text-sm font-medium text-lime-600 hover:text-lime-500"
									>
										{m.discount_coupon()}
									</button>
									<div id="discount-form" class="mt-4 hidden">
										<div class="flex space-x-4">
											<input
												type="text"
												id="discount-code"
												name="discount-code"
												placeholder={m.enter_code()}
												class="block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm"
											/>
											<button
												type="submit"
												class="inline-flex items-center justify-center rounded-md bg-lime-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
											>
												{m.redeem()}
											</button>
										</div>
									</div>
								</div>
							</section>
						</div>
					</div>

					<!-- Order Summary -->
					<div class="lg:col-span-5">
						<div class="sticky top-8 space-y-6">
							<section class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
								<div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
									<h2 class="text-lg font-semibold text-gray-900">{m.order_summary()}</h2>
								</div>
								{#if order}
									<div class="p-6">
										<dl class="space-y-4 text-sm">
											{#if order.discounts.length > 0}
												{#each order.discounts as discount}
													<div class="flex justify-between">
														<dt class="font-medium text-gray-700">
															Discount
															<span
																class="ml-2 rounded-full bg-lime-50 px-2 py-0.5 text-xs font-medium text-lime-700"
																>{discount.description}</span
															>
														</dt>
														<dd class="text-gray-900">
															{formatCurrency(
																discount.amountWithTax,
																PUBLIC_DEFAULT_CURRENCY
															)}
														</dd>
													</div>
												{/each}
											{/if}
											<div class="flex justify-between">
												<dt class="font-medium text-gray-700">{m.subtotal()}</dt>
												<dd class="text-gray-900">
													{formatCurrency(order.subTotal, PUBLIC_DEFAULT_CURRENCY)}
												</dd>
											</div>
											{#if order.taxSummary.length > 0}
												{#each order.taxSummary as tax}
													{#if tax.taxTotal > 0}
														<div class="flex justify-between">
															<dt class="font-medium text-gray-700">{tax.description}</dt>
															<dd class="text-gray-900">
																{formatCurrency(tax.taxTotal, PUBLIC_DEFAULT_CURRENCY)}
															</dd>
														</div>
													{/if}
												{/each}
											{/if}
											{#if order.shippingLines.length > 0}
												{#each order.shippingLines as shippingLine}
													<div class="flex justify-between">
														<dt class="font-medium text-gray-700">
															{shippingLine.shippingMethod.name}
														</dt>
														<dd class="text-gray-900">
															{formatCurrency(
																shippingLine.priceWithTax,
																PUBLIC_DEFAULT_CURRENCY
															)}
														</dd>
													</div>
												{/each}
											{/if}
											<div class="flex justify-between border-t border-gray-200 pt-4">
												<dt class="text-base font-medium text-gray-900">{m.total()}</dt>
												<dd class="text-base font-medium text-gray-900">
													{formatCurrency(order.totalWithTax, PUBLIC_DEFAULT_CURRENCY)}
												</dd>
											</div>
										</dl>

										<div class="mt-6">
											<button
												type="button"
												class="w-full rounded-md bg-lime-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 disabled:cursor-not-allowed disabled:opacity-50"
												disabled={disabled}
												onclick={sendPayment}
											>
												{m.proceed_to_payment()}
											</button>
										</div>

										{#if errorMessage}
											<p class="mt-4 text-sm text-red-600">{errorMessage}</p>
										{/if}
									</div>
								{/if}
							</section>
						</div>
					</div>
				</div>
			</form>
		</div>
	{/if}
</div>
