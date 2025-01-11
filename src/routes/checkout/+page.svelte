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
		title: 'Checkout',
		description: 'Checkout page for SnoreRx'
	}}
/>
<div class="h-full min-h-screen w-full bg-[#f1f1f1]">
	{#if loaded && !order?.lines}
		<p>{m.cart_empty()}</p>
	{:else if loaded && order?.lines && order?.lines.length > 0}
		<div class="mx-auto max-w-screen-2xl p-4 pt-6 md:flex md:justify-between">
			<div class="flex">
				<h1 class="sr-only">{m.checkout()}</h1>
				<a href="/" class="mx-auto"
					><img src="/logo.png" class="h-10 w-auto sm:m-0 md:h-12" alt={PUBLIC_SITE_NAME} /></a
				>
			</div>
			<div class="flex">
				<div class="mx-auto flex flex-nowrap items-center md:ml-auto">
					<div class="mr-3 rounded-full bg-white p-3">
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
							class="text-gray-400"
							><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
								d="M7 11V7a5 5 0 0 1 10 0v4"
							/></svg
						>
					</div>
					<span class="text-sm text-gray-400">{m.safe_checkout()} {m.ssl_encryption()}</span>
				</div>
			</div>
		</div>
		<CheckoutForm></CheckoutForm>
		<form>
			<div
				class="mx-auto grid max-w-screen-2xl grid-cols-1 gap-y-6 p-4 sm:gap-x-4 md:grid-cols-2 lg:grid-cols-3"
			>
				<div class="col-span-1 rounded-md">
					<section id="cart-items" class="rounded-t-md border border-gray-300 bg-white p-2">
						<ul role="list" class="flex-auto">
							{#if order?.lines}
								{#each order.lines as line}
									<li class="flex space-x-6 border-b border-gray-200 py-6">
										<Image
											preview={line.featuredAsset?.preview}
											alt={line.productVariant.name}
											preset="thumb"
											class="h-28 w-auto flex-none rounded-md bg-gray-200 object-cover object-center"
										/>
										<div class="my-auto flex flex-col justify-between space-y-4">
											<div class="space-y-1 text-sm font-medium">
												<h3 class="text-gray-900">{line.productVariant.name}</h3>
												<p class="text-gray-900">facets</p>
												<p class="text-gray-500">
													Price: {formatCurrency(line.unitPrice, PUBLIC_DEFAULT_CURRENCY)}
												</p>
												<div class="flex items-center space-x-2">
													<p class="text-gray-500">{m.quantity({ count: line.quantity })}</p>
													<select
														name="quantity"
														class="rounded-lg text-sm font-medium text-black focus:border-none focus:ring-gray-700"
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

					<section id="shipping-method" class="border-x border-b border-gray-300 px-4 py-6 pt-4">
						<div role="radiogroup">
							<p class="label">{m.delivery_methods()}</p>
							{#each useFragment(ShippingMethodQuote, shippingOptions) as shippingOption}
								<div class="my-1 ml-1">
									<label class="text-sm text-gray-500">
										<input
											onchange={() => setShippingOption(selectedShippingOption)}
											type="radio"
											name="selectedShippingOption"
											value={shippingOption.id}
											bind:group={selectedShippingOption}
											class="focus:ring-none mr-2 h-6 w-6 border-gray-400 text-gray-700"
										/>
										{shippingOption.name}
										{formatCurrency(shippingOption.price, PUBLIC_DEFAULT_CURRENCY)}
									</label>
								</div>
							{:else}
								No shipping options available
							{/each}
						</div>
					</section>

					<section id="discount-code" class="border-x border-b border-gray-300 bg-white px-3 py-6">
						<button type="button" onclick={toggleDiscountForm} class="underline"
							>{m.discount_coupon()}</button
						>
						<div id="discount-form" class="hidden py-2">
							<div class="flex space-x-4">
								<input
									type="text"
									id="discount-code"
									name="discount-code"
									placeholder={m.enter_code()}
									class="input"
								/>
								<button
									type="submit"
									class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#c7b598] to-[#dac8a6] px-10 py-4 text-lg font-semibold tracking-wide text-white transition duration-200 hover:text-gray-900"
									>{m.redeem()}</button
								>
							</div>
						</div>
					</section>

					<section
						id="order-summary"
						class="rounded-b-md border-x border-b border-gray-300 bg-white px-3 py-6"
					>
						{#if order}
							<dl class="space-y-6 text-sm font-medium text-gray-500">
								{#if order.discounts.length > 0}
									{#each order.discounts as discount}
										<div class="flex justify-between">
											<dt class="flex">
												Discount:
												<span
													class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600"
													>{discount.description}</span
												>
											</dt>
											<dd class="text-gray-900">
												{formatCurrency(discount.amountWithTax, PUBLIC_DEFAULT_CURRENCY)}
											</dd>
										</div>
									{/each}
								{/if}
								<div class="flex justify-between">
									<dt>{m.subtotal()}</dt>
									<dd class="text-gray-900">
										{formatCurrency(order.subTotal, PUBLIC_DEFAULT_CURRENCY)}
									</dd>
								</div>
								{#if order.taxSummary.length > 0}
									{#each order.taxSummary as tax}
										{#if tax.taxTotal > 0}
											<div class="flex justify-between">
												<dt>{tax.description}</dt>
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
											<dt>{shippingLine.shippingMethod.name}</dt>
											<dd class="text-gray-900">
												{formatCurrency(shippingLine.priceWithTax, PUBLIC_DEFAULT_CURRENCY)}
											</dd>
										</div>
									{/each}
								{/if}
							</dl>
							<p
								class="my-6 flex items-center justify-between border-t border-gray-200 py-2 text-sm font-medium text-gray-900"
							>
								<span class="text-lg">{m.total()}</span>
								<span class="text-2xl"
									>{formatCurrency(order.totalWithTax, PUBLIC_DEFAULT_CURRENCY)}</span
								>
							</p>
						{/if}
					</section>
				</div>

				<div class="col-span-1 hidden md:block lg:hidden"></div>
				<div class="col-span-1">
					<div class="col-span-2 my-6">
						<h1 class="text-red-800">{errorMessage}</h1>
						<button
							type="submit"
							class="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#c7b598] to-[#dac8a6] px-10 py-4 text-lg font-semibold tracking-wide text-white transition duration-200 hover:text-gray-900"
							{disabled}
							onclick={sendPayment}
						>
							{m.place_order()}
						</button>
					</div>
				</div>
			</div>
		</form>
	{/if}
</div>
