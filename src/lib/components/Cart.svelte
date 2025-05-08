<script lang="ts">
	import X from 'lucide-svelte/icons/x';
	import ShoppingBag from 'lucide-svelte/icons/shopping-bag';
	import Plus from 'lucide-svelte/icons/plus'; // Import Plus icon
	import Minus from 'lucide-svelte/icons/minus'; // Import Minus icon
	import { createDialog } from '@melt-ui/svelte';
	import { getContextClient } from '@urql/svelte';
	import { toast } from '$lib/toast.svelte';
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

	// Updated adjustOrderLine to take newQuantity directly
	const updateItemQuantity = async (orderLineId: string, newQuantity: number) => {
		if (processing) return;

		// Basic validation
		if (newQuantity < 1) {
			// Optionally, provide feedback to the user, or just don't proceed
			// toast.info(m.quantity_min_error ? m.quantity_min_error() : 'Quantity cannot be less than 1.');
			return;
		}
		if (newQuantity > 20) { // Assuming 20 is still the max desired quantity
			// toast.info(m.quantity_max_error ? m.quantity_max_error() : 'Quantity cannot exceed 20.');
			return;
		}

		processing = true;
		const result = await client
			.mutation(
				AdjustOrderLine,
				{ orderLineId: orderLineId, quantity: newQuantity },
				{ additionalTypenames: ['ActiveOrder'] } // This helps urql update the cache
			)
			.toPromise();
		if (result.error) {
			toast.error(m.unexpected_error());
			// If you were doing optimistic updates, you might revert them here
		}
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
				class="absolute right-2 top-3 z-50 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-lime-600 px-2 py-1 text-xs font-bold leading-none"
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
					in:fly={{ y: -200 }}
					class="absolute right-2 top-3 z-50 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-lime-600 px-2 py-1 text-xs font-bold leading-none"
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
			class="fixed right-0 top-0 z-50 mb-0 h-full w-[90%] overflow-auto bg-gradient-to-br from-primary-400 via-primary-400 to-accent-400 p-[25px] pb-0 shadow-xl focus:outline-none dark:from-primary-800 dark:via-primary-800 dark:to-accent-800 sm:w-4/5 md:w-2/3 lg:w-2/3 xl:w-1/2"
			transition:fly={{ x: '100%', duration: 300, opacity: 1 }}
		>
			<button
				{...$close}
				use:close
				class="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition-all hover:bg-white/20"
			>
				<span class="sr-only">{m.shopping_cart()}</span>
				<X class="h-6 w-6" />
			</button>
			<div class="px-4 sm:px-8">
				<h2
					{...$title}
					use:title
					class="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl"
				>
					{m.shopping_cart()}
				</h2>

				<ul role="list" class="divide-y divide-white/10 border-b border-t border-white/10">
					{#each lines as line (line.id)}
						<li class="py-4 sm:py-6 md:py-8">
							<div class="flex flex-col sm:flex-row sm:items-start">
								<a
									data-sveltekit-reload
									href={`/product/${line.productVariant?.product?.slug}?variant=${line.productVariant.id}`}
									class="flex-shrink-0 self-center sm:self-auto"
								>
									<div class="cursor-pointer">
										{#if line.featuredAsset?.preview}
											<Image
												preview={line.featuredAsset.preview}
												alt={line.productVariant.name}
												preset="thumb"
												class="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-lg object-cover object-center shadow-lg transition-transform duration-300 hover:scale-105"
											/>
										{:else}
											<img
												src="/img/noimg.png"
												alt={line.productVariant.name}
												class="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-lg object-cover object-center shadow-lg transition-transform duration-300 hover:scale-105"
											/>
										{/if}
									</div>
								</a>
								<div class="mt-3 flex flex-1 flex-col sm:ml-4 md:ml-6 sm:mt-0">
									<div class="flex flex-col justify-between sm:flex-row">
										<div class="flex-1">
											<a
												data-sveltekit-reload
												href={`/product/${line.productVariant?.product?.slug}?variant=${line.productVariant.id}`}
												class="cursor-pointer"
											>
												<h3 class="text-md sm:text-lg font-medium hover:text-lime-300">
													{line.productVariant.product.name}
												</h3>
												{#each line.productVariant.options as option}
													<p class="mt-1 text-xs sm:text-sm">{option.group.name}: {option.name}</p>
												{/each}
											</a>

											{#if line.customFields?.fillings || line.customFields?.extrachoicestring}
												<div class="mt-2 mr-0 sm:mr-4 md:mr-12 bg-white/5 p-2 rounded-lg text-xs sm:text-sm">
													{#if line.customFields.fillings}
														<p>
															<span class="font-medium">{m.choices()}</span>
															{line.customFields.fillings}
														</p>
													{/if}
													{#if line.customFields.extrachoicestring}
														<p class="{line.customFields.fillings ? 'mt-1' : ''} text-xs sm:text-sm">
															<span class="font-medium">{m.extras()}</span>
															{line.customFields.extrachoicestring}
														</p>
													{/if}
												</div>
											{/if}
										</div>
										<div class="mt-2 flex flex-row items-center justify-between sm:mt-0 sm:flex-col sm:items-end sm:justify-start">
											<p class="text-md sm:text-lg font-medium">
												{formatCurrency(line.linePrice, PUBLIC_DEFAULT_CURRENCY)}
											</p>
											<p class="text-xs sm:text-sm sm:mt-1">{m.quantity({ count: line.quantity })}</p>
										</div>
									</div>
									<div class="mt-4">
										<div class="flex rounded-lg bg-white/10">
											<button
												type="button"
												aria-label={m.decrease_item_quantity_label ? m.decrease_item_quantity_label({ item: line.productVariant.product.name }) : `Decrease quantity of ${line.productVariant.product.name}`}
												class="p-2 bg-primary-200  sm:p-2.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/20 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-inset"
												onclick={() => updateItemQuantity(line.id, line.quantity - 1)}
												disabled={processing || line.quantity <= 1}
											>
												<Minus class="h-4 w-4" />
											</button>
											<span
												class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-center min-w-[3ch] tabular-nums"
												aria-live="polite"
												aria-atomic="true"
												role="status"
											>
												{line.quantity}
											</span>
											<button
												type="button"
												aria-label={m.increase_item_quantity_label ? m.increase_item_quantity_label({ item: line.productVariant.product.name }) : `Increase quantity of ${line.productVariant.product.name}`}
												class="p-2 bg-primary-200 sm:p-2.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/20 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-inset"
												onclick={() => updateItemQuantity(line.id, line.quantity + 1)}
												disabled={processing || line.quantity >= 20} 
											>
												<Plus class="h-4 w-4" />
											</button>

											<button
											type="button" 
											aria-label={m.remove_item_label ? m.remove_item_label({ item: line.productVariant.product.name }) : `Remove ${line.productVariant.product.name}`}
											onclick={async () => {
												removeOrderLine(line.id);
											}}
											class="ml-auto px-2 flex items-center justify-center gap-2 rounded-lg text-xs sm:text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-lime-500"
											>
											<span class="hidden sm:inline">{m.remove()}</span>
											<svg
											class="h-4 w-4 sm:h-5 sm:w-5"
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
							</div>
						</li>
					{:else}
						<div class="py-12 text-center">
							<p class="text-md sm:text-lg">{m.cart_empty()}</p>
						</div>
					{/each}
				</ul>

				<section
					aria-labelledby="summary-heading"
					class="sticky bottom-0 mt-8 rounded-t-xl border-t border-white/10 bg-gradient-to-b from-primary-800/95 to-primary-800 px-6 py-6 text-white backdrop-blur-lg dark:from-primary-600/95 dark:to-primary-600 dark:text-black"
				>
					{#if lines.length > 0}
						<h2 id="summary-heading" class="sr-only">Order summary</h2>
						<div class="text-white">
							<dl class="space-y-4">
								<div class="flex items-center justify-between">
									<dt class="text-lg font-medium">{m.subtotal()}</dt>
									<dd class="text-lg font-medium">
										{formatCurrency(total, PUBLIC_DEFAULT_CURRENCY)}
									</dd>
								</div>
							</dl>
							<p class="mt-2 text-sm">{m.shipping_taxes_checkout()}</p>
						</div>
						<form action="/checkout" class="mt-6">
							<button
								use:close
								type="submit"
								class="w-full rounded-lg bg-lime-500 px-5 py-3.5 text-base font-medium shadow-lg transition-all duration-300 hover:bg-lime-600 hover:shadow-lime-500/25 focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
							>
								{m.checkout()}
							</button>
						</form>
					{/if}
					<button
						{...$close}
						use:close
						class="mt-4 w-full text-center font-medium text-white/80 transition-colors"
					>
						&larr; {m.continue_shopping()}
					</button>
				</section>
			</div>
		</div>
	{/if}
</div>