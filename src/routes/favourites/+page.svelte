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


	const client = getContextClient();

	let products = $state<ProductDetailFragment[]>([]);
	let favorites = $state<Record<string, boolean>>({});
	let loading = $state(true);
	let processing = $state(false)
	
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
		cartDialogStore.set(true)
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
						.filter(id => favorites[id])
						.map(async (id) => {
							const product = await client.query(GetProduct, { slug:id }).toPromise().then((res) => res.data?.product);
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
				products = products.filter(p => p.slug !== product.slug);
			}
		} catch (e) {
			console.error('Error saving favorites:', e);
		}
	}
</script>

<div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">{m.favorites_title()}</h1>

	{#if loading}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div class="animate-pulse bg-gray-100 rounded-lg h-96"></div>
				<div class="animate-pulse bg-gray-100 rounded-lg h-96"></div>
				<div class="animate-pulse bg-gray-100 rounded-lg h-96"></div>
		</div>
	{:else if products.length === 0}
		<div class="text-center py-16">
			<p class="text-gray-500 text-lg">{m.favorites_empty()}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each products as product (product.slug)}
				<div class="group relative  rounded-lg shadow-sm hover:shadow-md transition-shadow">
					<div class="aspect-square  rounded-t-lg overflow-hidden">
						{#if product.featuredAsset}
						<img
						src={(product.featuredAsset as unknown as any)?.preview}
						alt={product.name}
						class="w-full h-full object-cover"
					/>
						{/if}
					</div>

					<div class="p-4 flex items-center justify-center gap-3">
						<h3 class="text-lg font-medium ">
							{product.name}
						</h3>
						{#if product.variants?.[0]?.price}
							<p class="text-lg font-semibold ">
								{formatCurrency(product.variants?.[0].price, PUBLIC_DEFAULT_CURRENCY)}
							</p>
						{/if}
						<button class="button" onclick={() => addToCart(product.variants?.[0].id)}>
						{m.add_to_cart()}
						</button>

						<button
							onclick={() => toggleFavorite(product)}
							class="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-sm hover:bg-red-50 transition-colors"
						>
							<span class="text-3xl">
								<Heart fill="red"></Heart>
							</span>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>