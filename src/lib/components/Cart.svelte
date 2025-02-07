<script lang="ts">
	import X from 'lucide-svelte/icons/x';
	import ShoppingBag from 'lucide-svelte/icons/shopping-bag';
	import { createDialog } from '@melt-ui/svelte';
	import { getContextClient } from '@urql/svelte';
	import {toast} from "$lib/toast.svelte"
	import { fade, fly } from 'svelte/transition';
	import { useFragment } from '$lib/gql';
	import { ActiveOrder, AdjustOrderLine, RemoveOrderLine } from '$lib/vendure';
	import { cartStore, cartDialogStore } from '$lib/stores';
	import { formatCurrency } from '$lib/utils';
	import Image from '$lib/components/Image.svelte';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';

	let order = $derived(useFragment(ActiveOrder, $cartStore));
	let lines = $derived(order?.lines || []);
	const total = $derived(order?.subTotal || 0);
	const count = $derived(order?.totalQuantity || 0);

	const client = getContextClient();
	let processing = $state(false);

	const adjustOrderLine = async (orderLineId: string, e: Event) => {
		if (processing) return;
		processing = true;
		const target = e.target as HTMLSelectElement;
		const quantity = +target.value;
		const result = await client
			.mutation(
				AdjustOrderLine,
				{ orderLineId: orderLineId, quantity: quantity },
				{ additionalTypenames: ['ActiveOrder'] }
			)
			.toPromise();
		if (result.error) toast.error(m.unexpected_error());
		processing = false;
	};

	const removeOrderLine = async (orderLineId: string) => {
		if (processing) return;
		processing = true;
		const result = await client
			.mutation(
				RemoveOrderLine,
				{ orderLineId: orderLineId },
				{ additionalTypenames: ['ActiveOrder'] }
			)
			.toPromise();
		if (result.error) toast.error(m.unexpected_error());
		else if (result.data) toast.success(m.item_removed());
		processing = false;
	};

	const {
		elements: { trigger, portalled, overlay, content, title, close },
		states: { open }
	} = createDialog({ preventScroll: true, open: cartDialogStore });
</script>
{#if $open}
	<button {...$close} use:close class="grow-on-hover relative items-center align-middle">
		<span class="sr-only">{m.shopping_cart()}</span>
		<X class="h-10 w-10" />
		{#if count > 0}
			<span
				class="absolute right-2 top-3 z-50 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-lime-600 px-2 py-1 text-xs font-bold leading-none "
			>
				{count}
			</span>
		{/if}
	</button>
{:else}
	<button {...$trigger} use:trigger class="grow-on-hover relative items-center align-middle">
		<span class="sr-only">{m.shopping_cart()}</span>
		<ShoppingBag class="h-9 w-9" />
		{#if count > 0}
		{#key count}	
		<span
		in:fly={{y:-200}}
		class="absolute right-2 top-3 z-50 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-lime-600 px-2 py-1 text-xs font-bold leading-none "
		>
		{count}
	</span>
	{/key}
		{/if}
	</button>
{/if}
<div use:portalled>
	{#if $open}
		<div
			{...$overlay}
			use:overlay
			class="fixed inset-0 z-20 bg-black/50"
			transition:fade={{ duration: 150 }}
		></div>
		<div
			{...$content}
			use:content
			class="fixed right-0 top-0 z-50 mb-0 h-full w-full overflow-auto bg-gradient-to-br from-primary-400 via-primary-400 to-accent-400 dark:from-primary-800 dark:via-primary-800 dark:to-accent-800 p-[25px] pb-0 shadow-xl focus:outline-none sm:w-4/5 md:w-2/3 lg:w-2/3 xl:w-1/2"
			transition:fly={{ x: '100%', duration: 300, opacity: 1 }}
		>
			<button {...$close} use:close class="absolute right-4 top-4 rounded-full bg-white/10 p-2  transition-all hover:bg-white/20">
				<span class="sr-only">{m.shopping_cart()}</span>
				<X class="h-6 w-6" />
			</button>
			<div class="px-4 sm:px-8">
				<h2
					{...$title}
					use:title
					class="mb-8 text-center text-3xl font-bold tracking-tight  sm:text-4xl"
				>
					{m.shopping_cart()}
				</h2>
				<ul
					role="list"
					class="divide-y divide-white/10 border-t border-b border-white/10"
				>
					{#each lines as line}
						<li class="py-8">
							<div class="flex flex-col sm:flex-row sm:items-center">
								<a
									data-sveltekit-reload
									href={`/product/${line.productVariant?.product?.slug}?variant=${line.productVariant.id}`}
									class="flex-shrink-0"
								>
									<div class="cursor-pointer">
										{#if line.featuredAsset?.preview}
											<Image
												preview={line.featuredAsset.preview}
												alt={line.productVariant.name}
												preset="thumb"
												class="h-32 w-32 rounded-lg object-cover object-center shadow-lg transition-transform duration-300 hover:scale-105 sm:h-40 sm:w-40"
											/>
										{:else}
											<img
												src="/img/noimg.png"
												alt={line.productVariant.name}
												class="h-32 w-32 rounded-lg object-cover object-center shadow-lg transition-transform duration-300 hover:scale-105 sm:h-40 sm:w-40"
											/>
										{/if}
									</div>
								</a>
								<div class="mt-4 flex flex-1 flex-col sm:mt-0 sm:ml-6">
									<div class="flex flex-col justify-between sm:flex-row">
										<div class="flex-1">
											<a
												data-sveltekit-reload
												href={`/product/${line.productVariant?.product?.slug}?variant=${line.productVariant.id}`}
												class="cursor-pointer"
											>
												<h3 class="text-lg font-medium  hover:text-lime-300">
													{line.productVariant.product.name}
												</h3>
												{#each line.productVariant.options as option}
													<p class="mt-1 text-sm ">{option.group.name}: {option.name}</p>
												{/each}
											</a>
										</div>
										<div class="mt-4 flex flex-col items-end sm:mt-0">
											<p class="text-lg font-medium ">
												{formatCurrency(line.linePrice, PUBLIC_DEFAULT_CURRENCY)}
											</p>
											<p class="mt-1 text-sm ">{m.quantity({ count: line.quantity })}</p>
										</div>
									</div>
									<div class="mt-6 flex items-center justify-between">
										<select
											name="quantity"
											class="rounded-lg border-none bg-white/10 px-6 py-2 text-sm font-medium  transition-colors hover:bg-white/20 focus:border-none focus:ring-2 focus:ring-lime-500"
											onchange={async (e) => adjustOrderLine(line.id, e)}
										>
										{#each Array.from({ length: 20 }, (_, i) => i + 1) as qty}
												<option
													value={qty}
													selected={qty === line.quantity}
													class="bg-primary-700 text-white">{qty}</option
												>
											{/each}
										</select>
										<button
											type="submit"
											aria-label="delete"
											onclick={async () => {
												removeOrderLine(line.id);
											}}
											class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium  transition-colors hover:bg-white/10 "
										>
											<span>{m.remove()}</span>
											<svg
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
												aria-hidden="true"
											>
												<path
													fill-rule="evenodd"
													d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</li>
					{:else}
						<div class="py-12 text-center">
							<p class="text-lg ">{m.cart_empty()}</p>
						</div>
					{/each}
				</ul>
				<section
					aria-labelledby="summary-heading"
					class="sticky bottom-0 mt-8 rounded-t-xl border-t text-white dark:text-black border-white/10 bg-gradient-to-b from-primary-800/95 to-primary-800 dark:from-primary-600/95 dark:to-primary-600 px-6 py-6 backdrop-blur-lg"
				>
					{#if lines.length > 0}
						<h2 id="summary-heading" class="sr-only">Order summary</h2>
						<div>
							<dl class="space-y-4">
								<div class="flex items-center justify-between">
									<dt class="text-lg font-medium ">{m.subtotal()}</dt>
									<dd class="text-lg font-medium ">
										{formatCurrency(total, PUBLIC_DEFAULT_CURRENCY)}
									</dd>
								</div>
							</dl>
							<p class="mt-2 text-sm ">{m.shipping_taxes_checkout()}</p>
						</div>
						<form action="/checkout" class="mt-6">
							<button
								use:close
								type="submit"
								class="w-full rounded-lg bg-lime-500 px-5 py-3.5 text-base font-medium  shadow-lg transition-all duration-300 hover:bg-lime-600 hover:shadow-lime-500/25 focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
							>
								{m.checkout()}
							</button>
						</form>
					{/if}
					<button {...$close} use:close class="mt-4 w-full text-center font-medium text-white/80 transition-colors ">
						&larr; {m.continue_shopping()}
					</button>
				</section>
			</div>
		</div>
	{/if}
</div>
