
<script lang="ts">
	import type { PageData } from './$types';
	import { getContextClient } from '@urql/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { ActiveOrder, GetOrderByCode, AddOrderPayment } from '$lib/vendure';
	import { useFragment } from '$lib/gql';
	import { formatCurrency } from '$src/lib/utils';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
	import * as m from '$lib/paraglide/messages';


	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let code = data.paramVals.code;
	let order: any = $state(null);
	let loaded: boolean = $state(false);

	const client = getContextClient();

	const fetchOrder = async () => {
		await new Promise((resolve) => setTimeout(resolve, 500)) // allow the order to be processed via the webhook before the page is rendered
		const orderResult = await client
			.query(GetOrderByCode, { code }, { requestPolicy: 'network-only' })
			.toPromise();
		if (orderResult?.data?.orderByCode)
			order = useFragment(ActiveOrder, orderResult.data.orderByCode);
	};
	let lines = $derived(order?.lines || []);

async function makePayment(){
		try {
			const payload = data.paramVals
			//console.log(payload);
			let result = await client
				.mutation(AddOrderPayment, { input: { method: 'paytrail', metadata: payload } })
				.toPromise()
				.then((result) => result?.data?.addPaymentToOrder);
			console.log(result);
			switch (result?.__typename) {
				case 'Order':
					// Adding payment succeeded!
					console.log("succesful payment")
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
			console.log(e);
		}
	}
	
	onMount(async () => {
		if (browser) {
			try {
				await makePayment()
				await fetchOrder();
				// await handleSignOut()
				loaded = true;
			} catch (error) {
				console.error(error);
			}
		}
	});
</script>

{#if loaded}
	{#if order && order.code}
		<main class="lg:flex lg:max-h-screen lg:min-h-full lg:flex-row-reverse lg:overflow-hidden">
			<section class="flex-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-4 lg:pt-0">
				<div class="mx-auto max-w-lg">
					<h1 class="text-2xl font-bold mb-6">{m.order_confirmation()}</h1>
					<div class="bg-green-50 p-4 rounded-lg mb-6">
						<p class="text-green-700">{m.thank_you_order()}</p>
						<p class="text-green-700">
							{m.your_order_number()} <span class="font-bold">{code}</span>
						</p>
					</div>

					<div class="border rounded-lg overflow-hidden">
						<div class="divide-y divide-gray-200">
							{#each lines as line}
								<div class="p-4 flex gap-4">
									{#if line.featuredAsset}
										<img
											src={line.featuredAsset.preview}
											alt={line.productVariant.name}
											class="w-20 h-20 object-cover rounded"
										/>
									{/if}
									<div class="flex-1">
										<h3 class="font-medium">{line.productVariant.name}</h3>
										<div class="text-sm text-gray-500 mt-1">
											{#each line.productVariant.options as option}
												<span>{option.group.name}: {option.name}</span>
												{#if !option === line.productVariant.options[line.productVariant.options.length - 1]}
													<span class="mx-2">•</span>
												{/if}
											{/each}
										</div>
										<div class="mt-2 flex justify-between">
											<div class="text-sm">
												{m.quantity({ count: line.quantity })}
											</div>
											<div class="font-medium">
												{formatCurrency(line.linePriceWithTax, PUBLIC_DEFAULT_CURRENCY)}
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<div class="mt-6 flex justify-between text-lg font-medium">
						<span>{m.total()}</span>
						<span>{formatCurrency(order.totalWithTax, PUBLIC_DEFAULT_CURRENCY)}</span>
					</div>

					<div class="mt-8">
						<a
							href="/"
							class="inline-flex items-center text-lime-600 hover:text-lime-700"
						>
							<svg
								class="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							{m.continue_shopping()}
						</a>
					</div>
				</div>
			</section>
		</main>
	{:else}
		<div class="p-4">
			<p class="text-red-600">{m.order_not_found()}</p>
		</div>
	{/if}
{/if}