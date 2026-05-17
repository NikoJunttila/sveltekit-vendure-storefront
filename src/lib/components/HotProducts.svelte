<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { formatCurrency } from '$lib/utils';
	import { getContextClient } from '@urql/svelte';
	import {
		type ProductListOptions,
		SortOrder,
		type ProductDetailCustomFieldsFragment
	} from '$lib/gql/graphql';
	import { GetProducts } from '../vendure';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';

	const client = getContextClient();
	const options: ProductListOptions = {
		take: 8,
		skip: 0,
		sort: {
			createdAt: SortOrder.Desc
		}
	};

	let products: ProductDetailCustomFieldsFragment[] | any[] = $state([]);
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function getProducts() {
		loading = true;
		error = null;

		try {
			const result = await client.query(GetProducts, { options });
			if (result.error) {
				throw new Error(`GraphQL Error: ${result.error.message}`);
			}
			if (!result.data?.products.items) {
				throw new Error('No data returned');
			}
			products = result.data?.products.items || [];
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

<section class="mx-auto max-w-screen-xl px-4 py-16 md:py-24">
	<div class="mb-10 text-center">
		<p class="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-300">
			{m.eyebrow_products()}
		</p>
		<h2 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
			{m.hot_products()}
		</h2>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-16">
			<div class="text-base text-gray-600 dark:text-gray-300">{m.products_loading()}</div>
		</div>
	{:else if error}
		<div
			class="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-950/30"
		>
			<p class="font-semibold text-red-800 dark:text-red-300">{m.products_error()}</p>
			<button
				onclick={() => getProducts()}
				class="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
			>
				{m.products_retry()}
			</button>
		</div>
	{:else if products.length === 0}
		<div class="py-16 text-center">
			<p class="text-gray-600 dark:text-gray-300">{m.products_empty()}</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
			{#each products as product}
				<a
					aria-label={`Browse ${product.name} product`}
					href={`/product/${product.slug}`}
					class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900 dark:ring-white/10"
				>
					<div class="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
						{#if product.featuredAsset}
							<img
								loading="lazy"
								src={product.featuredAsset.preview}
								alt={product.featuredAsset.name}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								width="600"
								height="600"
							/>
						{/if}
					</div>
					<div class="flex flex-1 flex-col justify-between gap-2 p-4">
						<h3
							class="line-clamp-2 text-base font-semibold text-gray-900 md:text-lg dark:text-white"
						>
							{product.name}
						</h3>
						<p class="text-base font-medium text-primary-700 dark:text-primary-300">
							{formatCurrency(product.variants[0].priceWithTax, PUBLIC_DEFAULT_CURRENCY)}
						</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</section>
