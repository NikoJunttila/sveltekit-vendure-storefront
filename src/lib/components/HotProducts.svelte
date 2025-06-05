<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { formatCurrency } from '$lib/utils';
	import { getContextClient } from '@urql/svelte';
	import { type ProductListOptions, SortOrder, type ProductDetailCustomFieldsFragment} from '$lib/gql/graphql';
	import {  GetProducts} from '../vendure';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';

	const client = getContextClient();
	const options: ProductListOptions = {
		take: 8,
		skip: 0,
        sort : {
            popularityScore : SortOrder.Desc
        }
	};

	let products: ProductDetailCustomFieldsFragment[] | any[] = $state([]);

	let loading = $state(false);
	let error = $state<string | null>(null);

	async function getProducts() {
		loading = true;
		error = null;
		
		try {
			const result = await client.query(GetProducts, {options});
			// console.log('Query result:', result);
			// Check for GraphQL errors
			if (result.error) {
				throw new Error(`GraphQL Error: ${result.error.message}`);
			}
			
			// Check if we have data
			if (!result.data?.products.items) {
				throw new Error('No search data returned from server');
			}
			products = result.data?.products.items || [];
			console.log('Processed products:', products);
			
		} catch (err) {
			console.error('Error fetching products:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch products';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		getProducts();
	});
</script>

<!-- Hot products section - Mosaic grid -->
<section class="mx-auto my-8 max-w-screen-2xl p-4">
	<h2 class="mb-8 text-center text-3xl font-bold">{m.hot_products()}</h2>
	
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="text-lg text-gray-600">Loading products...</div>
		</div>
	{:else if error}
		<div class="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
			<p class="text-red-800 font-medium">Error loading products</p>
			<p class="text-red-600 text-sm mt-1">{error}</p>
			<button 
				onclick={() => getProducts()}
				class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
			>
				Try Again
			</button>
		</div>
	{:else if products.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-600">No products found</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 overflow-hidden rounded-md md:grid-cols-3 lg:grid-cols-4">
			{#each products as product, i}
				<a
					aria-label={`Browse ${product.name} product`}
					href={`/product/${product.slug}`}
					class="group relative overflow-hidden shadow-md
	                       {i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
	                       {i === 3 ? 'lg:col-span-2' : ''}"
				>
					<div class="aspect-square h-full w-full">
                        {#if product.featuredAsset}
						<img
							loading="lazy"
							src={product.featuredAsset.preview}
							alt={product.featuredAsset.name}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							width="600"
							height="600"
						/>
                        {/if}
					</div>
					<!-- Overlay content -->
					<div
						class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t
	                            from-black/40 to-transparent p-4"
					>
						<h3 class="text-center text-lg font-semibold text-white drop-shadow-lg md:text-xl">
							{product.name}
						</h3>
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/60
	                                p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<div class="text-center text-xl text-white">
									{formatCurrency(product.variants[0].priceWithTax, PUBLIC_DEFAULT_CURRENCY)}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</section>

<style>
	/* Custom grid sizing for mosaic effect */
	@media (min-width: 768px) {
		.grid {
			grid-auto-rows: minmax(200px, auto);
		}
		.md\:col-span-2 {
			grid-column: span 2;
		}
		.md\:row-span-2 {
			grid-row: span 2;
		}
	}
</style>