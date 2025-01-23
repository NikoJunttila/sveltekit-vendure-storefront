<script lang="ts">
	import type { PageData } from './$types';
	import { getContextClient } from '@urql/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { ActiveOrder, GetOrderByCode, SignOut } from '$lib/vendure';
	import { useFragment } from '$lib/gql';
	import { cartStore, userStore } from '$lib/stores';
	import * as m from '$lib/paraglide/messages';
	import OrderSummaryHeader from '../components/OrderSummaryHeader.svelte';
	import OrderLineItem from '../components/OrderLineItem.svelte';
	import OrderTotal from '../components/OrderTotal.svelte';
	import BackToShoppingLink from '../components/BackToShoppingLink.svelte';

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

	const handleSignOut = async () => {
		const result = await client.mutation(SignOut, {}).toPromise();
		console.log(result);
		if (result?.data?.logout?.success) {
			cartStore.set(null);
			userStore.set(null);
		}
	};
	onMount(async () => {
		if (browser) {
			try {
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
					<OrderSummaryHeader {code} />

					<div class="border rounded-lg overflow-hidden">
						<div class="divide-y divide-gray-200">
							{#each lines as line}
								<OrderLineItem {line} />
							{/each}
						</div>
					</div>

					<OrderTotal totalWithTax={order.totalWithTax} />
					<BackToShoppingLink />
				</div>
			</section>
		</main>
	{:else}
		<div class="p-4">
			<p class="text-red-600">{m.order_not_found()}</p>
		</div>
	{/if}
{/if}