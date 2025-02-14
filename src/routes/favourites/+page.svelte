<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { Heart } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { getContextClient } from '@urql/svelte';
	import { GetProduct, AddItemToOrder } from '$src/lib/vendure';
	import type { ProductDetailFragment } from '$lib/gql/graphql';
	import { formatCurrency } from '$src/lib/utils';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
	import { toast } from '$src/lib/toast.svelte';
	import { cartDialogStore } from '$lib/stores';
	import Image from '$src/lib/components/Image.svelte';

	const client = getContextClient();

	let products = $state<ProductDetailFragment[]>([]);
	let favorites = $state<Record<string, boolean>>({});
	let loading = $state(true);
	let processing = $state(false);

	const addToCart = async (variantId: string): Promise<void> => {
		processing = true;
		const result = await client
			.mutation(
				AddItemToOrder,
				{ variantId: variantId, quantity: 1 },
				{ additionalTypenames: ['ActiveOrder'] }
			)
			.toPromise();
		switch (result?.data?.addItemToOrder?.__typename) {
			case 'InsufficientStockError':
				toast.error(m.insufficient_stock());
				break;
			case 'Order':
				toast.success(m.item_added());
				break;
			default:
				toast.error(m.error_adding_item());
				break;
		}
		cartDialogStore.set(true);
		processing = false;
	};

	onMount(async () => {
		try {
			if (typeof localStorage !== 'undefined') {
				const saved = localStorage.getItem('favorites');
				favorites = saved ? JSON.parse(saved) : {};

				// Fetch all favorite products
				await Promise.all(
					Object.keys(favorites)
						.filter((id) => favorites[id])
						.map(async (id) => {
							const product = await client
								.query(GetProduct, { slug: id })
								.toPromise()
								.then((res) => res.data?.product);
							if (product) {
								//@ts-ignore
								products = [...products, product];
							}
						})
				);
			}
		} catch (e) {
			console.error('Error loading favorites:', e);
		} finally {
			loading = false;
		}
	});

	async function toggleFavorite(product: ProductDetailFragment) {
		const newFavorites = {
			...favorites,
			[product.slug]: !favorites[product.slug]
		};
		try {
			localStorage.setItem('favorites', JSON.stringify(newFavorites));
			favorites = newFavorites;
			// Update products array
			if (favorites[product.slug]) {
				products = [...products, product];
			} else {
				products = products.filter((p) => p.slug !== product.slug);
			}
		} catch (e) {
			console.error('Error saving favorites:', e);
		}
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-3xl font-bold">{m.favorites_title()}</h1>

	{#if loading}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<div class="h-96 animate-pulse rounded-lg bg-gray-100"></div>
			<div class="h-96 animate-pulse rounded-lg bg-gray-100"></div>
			<div class="h-96 animate-pulse rounded-lg bg-gray-100"></div>
		</div>
	{:else if products.length === 0}
		<div class="py-16 text-center">
			<p class="text-lg text-gray-500 dark:text-gray-200">{m.favorites_empty()}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each products as p (p.slug)}
				<div
					class="group relative flex flex-col items-center rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg"
				>
					<div class="relative aspect-square w-full overflow-hidden rounded-t-lg">
						<Image
							preview={(p.featuredAsset as unknown as any)?.preview}
							preset="medium"
							alt={p.name}
							class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
						/>
						<a
							href="/product/{p.slug}"
							class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<h3 class="mb-4 px-4 text-center text-lg font-bold text-white">
								{p.name}
							</h3>
							<p
								class="inline-flex items-center rounded-md border border-white px-6 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black"
							>
								{m.show_product()}
							</p>
						</a>
					</div>
					<div class=" flex w-full flex-1 flex-col p-4 dark:bg-gray-800">
						<div class="mb-4 flex flex-col gap-2">
							<h3
								class="text-lg font-semibold transition-colors duration-300 group-hover:text-primary-600"
							>
								<a href={p.slug}>{p.name}</a>
							</h3>
							{#if p.variants?.[0]?.price}
								<p class="text-lg font-semibold">
									{formatCurrency(p.variants?.[0].price, PUBLIC_DEFAULT_CURRENCY)}
								</p>
							{/if}
						</div>
						<div class="mt-auto grid w-full">
							<button
								class="flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95"
								onclick={() => addToCart(p.variants[0].id)}
								aria-label={m.add_to_cart()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								{m.add_to_cart()}
							</button>
							<!-- 				Check for product in stock	
					{#if p.}
					{:else}
					<button
						class="flex min-w-[120px] items-center justify-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95"
						aria-label="{m.insufficient_stock()}"
						disabled
						>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
						</svg>
						{m.add_to_cart()}
					</button>
					{/if} -->
						</div>

						<button
							onclick={() => toggleFavorite(p)}
							class="absolute right-1 top-1 rounded-full p-3 transition-all hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
							aria-label={favorites[p.slug] ? 'Remove from favorites' : 'Add to favorites'}
						>
							<span class="text-3xl">
								{#if favorites[p.slug]}
									<Heart
										fill="red"
										class="scale-125 transition-transform duration-200 hover:scale-150"
									/>
								{:else}
									<Heart class="transition-transform duration-200 hover:scale-125" />
								{/if}
							</span>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
