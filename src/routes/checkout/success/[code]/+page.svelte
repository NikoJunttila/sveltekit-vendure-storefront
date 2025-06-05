<script lang="ts">
	import type { PageData } from './$types';
	import { getContextClient } from '@urql/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { ActiveOrder, GetOrderByCode } from '$lib/vendure';
	import { useFragment } from '$lib/gql';
	import { formatCurrency } from '$src/lib/utils';
	import { PUBLIC_DEFAULT_CURRENCY, PUBLIC_SITE_EMAIL } from '$env/static/public';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let code = data.code;
	let order: any = $state(null);
	let loaded: boolean = $state(false);

	const client = getContextClient();

	const fetchOrder = async () => {
		const orderResult = await client
			.query(GetOrderByCode, { code }, { requestPolicy: 'network-only' })
			.toPromise();
		if (orderResult?.data?.orderByCode)
			order = useFragment(ActiveOrder, orderResult.data.orderByCode);
	};

	let lines = $derived(order?.lines || []);

	onMount(async () => {
		if (browser) {
			try {
				await fetchOrder();
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
					<h1 class="mb-6 text-2xl font-bold">{m.order_confirmation()}</h1>
					<div class="mb-6 rounded-lg bg-green-50 p-4">
						<p class="text-green-700">{m.thank_you_order()}</p>
						<p class="text-green-700">
							{m.your_order_number()} <span class="font-bold">{code}</span>
						</p>
					</div>

					<div class="overflow-hidden rounded-lg border">
						<div class="divide-y divide-gray-200">
							{#each lines as line}
								<div class="flex gap-4 p-4">
									{#if line.featuredAsset}
										<img
											src={line.featuredAsset.preview}
											alt={line.productVariant.name}
											class="h-20 w-20 rounded object-cover"
										/>
									{/if}
									<div class="flex-1">
										<h3 class="font-medium">{line.productVariant.name}</h3>
										<div class="mt-1 text-sm text-gray-500">
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
						<a href="/" class="inline-flex items-center text-lime-600 hover:text-lime-700">
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
			<p>{m.if_order()}</p>
			<p>
				<span class="font-semibold">{m.footer_email()}:</span>
				<a
					href={'mailto:' + PUBLIC_SITE_EMAIL}
					class="block transition-colors hover:text-primary-600 md:inline"
				>
					{PUBLIC_SITE_EMAIL}
				</a>
			</p>
		</div>
	{/if}
{/if}
