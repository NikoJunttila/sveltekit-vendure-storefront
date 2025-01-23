<script lang="ts">
	import { page } from '$app/state';
	import { getContextClient, queryStore } from '@urql/svelte';
	import Meta from '$src/lib/components/Meta.svelte';
	import { useFragment } from '$lib/gql';
	import {
		type CollectionFragment,
		type SearchResultFragment,
		type FacetValueResultFragment
	} from '$lib/gql/graphql';
	import {
		Collection,
		GetCollection,
		SearchResult,
		GetCollections,
		FacetValueResult,
		SearchProducts
	} from '$lib/vendure';
	import Image from '$lib/components/Image.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import CollectionComponent from '$lib/components/Collection.svelte';
	let { data } = $props();
	import { goto } from '$app/navigation';
	import BreadcrumbsComponent from '$src/lib/components/BreadcrumbsComponent.svelte';

	// this will load the data in prerendering and initial site load
	let collection: CollectionFragment | null | undefined = $state(
		useFragment(Collection, data.collection)
	);
	let products: SearchResultFragment[] = $state(
		useFragment(SearchResult, data.search?.items) || []
	);
	let facetValues: FacetValueResultFragment[] = $state(
		useFragment(FacetValueResult, data.search?.facetValues) || []
	);
	let collections: CollectionFragment[] = $state(useFragment(Collection, data.collections) || []);

	const collectionsQuery = $derived(
		queryStore({ client: getContextClient(), query: GetCollections, variables: {} })
	);
	const filteredCollections = $derived(
		collections.filter((collection) => collection.parent?.slug === page.params.slug)
	);
	const breadcrumbs = $derived(collection?.breadcrumbs || []);
	// this will load the data in client side navigation

	const collectionQuery = $derived(
		queryStore({
			client: getContextClient(),
			query: GetCollection,
			variables: { slug: page.params.slug }
		})
	);
	const searchQuery = $derived(
		queryStore({
			client: getContextClient(),
			query: SearchProducts,
			variables: { input: { collectionSlug: page.params.slug, groupByProduct: true } }
		})
	);
	$effect(() => {
		if ($searchQuery.data?.search.items) {
			products = useFragment(SearchResult, $searchQuery.data.search.items);
			filteredProducts = useFragment(SearchResult, $searchQuery.data.search.items);
		}
		if ($searchQuery.data?.search.facetValues) {
			facetValues = useFragment(FacetValueResult, $searchQuery.data.search.facetValues);
			selectedFilters.clear();
		}
		if ($collectionQuery?.data?.collection) {
			collection = useFragment(Collection, $collectionQuery.data.collection);
		}
		if ($collectionsQuery?.data?.collections?.items) {
			collections = useFragment(Collection, $collectionsQuery.data.collections.items);
		}
	});

	function showProduct(slug: string) {
		goto(`/product/${slug}`);
	}
	// Group facets by type (category/brand)
	const groupedFacets = $derived(
		facetValues.reduce(
			(acc, fv) => {
				const facetName = fv.facetValue.facet.name;
				if (!acc[facetName]) {
					acc[facetName] = [];
				}
				acc[facetName].push(fv);
				return acc;
			},
			{} as Record<string, typeof facetValues>
		)
	);

	// Selected filter values
	let selectedFilters = $state(new Set<string>());
	let filterSize = $state(0)
	// Filter products based on selected facets
	let filteredProducts = $state(useFragment(SearchResult, data.search?.items) || []);
	// Mobile filter dialog state
	let isMobileFilterOpen = $state(false);

	function toggleFilter(facetValueId: string) {
		if (selectedFilters.has(facetValueId)) {
			selectedFilters.delete(facetValueId);
		} else {
			selectedFilters.add(facetValueId);
		}
		// Filter products that contain ALL selected filters
		/* filteredProducts = products.filter((p) =>
		Array.from(selectedFilters).every((filterId) => p.facetValueIds.includes(filterId))
	); */
		filteredProducts = products.filter(
			(product) =>
				selectedFilters.size === 0 || product.facetValueIds.some((id) => selectedFilters.has(id))
		);
		filterSize = selectedFilters.size
	}

</script>
<Meta
config={{
	title: collection?.name,
	description: collection?.description,
}}
/>
{#if collection}
	<section class="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
		<section class="relative mb-8 hidden w-full sm:mb-16 sm:block sm:h-80 lg:h-96">
			<Image
				preview={collection.featuredAsset?.preview}
				preset="large"
				alt={collection.name}
				class="absolute h-full w-full rounded-md object-cover"
			/>
			<div class="absolute inset-0 flex items-center justify-center rounded-md bg-black/30">
				<h1 class="text-2xl font-bold text-white sm:text-4xl">{collection.name}</h1>
			</div>
		</section>
		<div class="mb-2">
			<BreadcrumbsComponent {breadcrumbs} />
		</div>
		<!-- Collections Grid -->
		<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredCollections as collection, i}
				<CollectionComponent {collection} index={i} />
			{/each}
		</div>

		<!-- Products Section with Filters -->
		<div class="mt-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
			<!-- Filters Sidebar -->
			<aside class="hidden lg:block">
				{#key collection.name}
					{#each Object.entries(groupedFacets) as [facetName, values]}
					{#if values[0].count !== products.length}
						<div class="border-b border-gray-200 py-6 ">
							<h3 class="text-lg font-medium capitalize text-primary-600">
								{facetName}
							</h3>
							<div class="mt-4 space-y-4">
								{#each values as { facetValue, count }}
									<div class="flex items-center">
										<input
											id={facetValue.id}
											type="checkbox"
											checked={selectedFilters.has(facetValue.id)}
											onchange={() => toggleFilter(facetValue.id)}
											class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 "
										/>
										<label
											for={facetValue.id}
											class="ml-3 cursor-pointer text-sm text-gray-600 transition-colors hover:text-primary-600 "
										>
											{facetValue.name}
											<span class="ml-1 text-gray-400">({count})</span>
										</label>
									</div>
								{/each}
							</div>
						</div>
						{/if}
					{/each}
				{/key}
			</aside>

			<!-- Mobile filter dialog -->
			<div class="mb-6 lg:hidden">
				<button
					type="button"
					class="flex items-center gap-2 text-gray-700 transition-colors hover:text-primary-600 "
					onclick={() => isMobileFilterOpen = true}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
							clip-rule="evenodd"
						/>
					</svg>
					{m.filters()} ({filterSize})
				</button>
			</div>

			<!-- Mobile Filter Dialog -->
			{#if isMobileFilterOpen}
				<div class="fixed inset-0 z-50 overflow-y-auto lg:hidden" role="dialog" aria-modal="true">
					<button class="fixed inset-0 bg-black bg-opacity-25" onclick={() => isMobileFilterOpen = false} aria-label="close"></button>
					<div class="relative flex h-full w-full flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
						<div class="flex items-center justify-between px-4">
							<h2 class="text-lg font-medium text-gray-900">{m.filters()}</h2>
							<button
								type="button"
								class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50"
								onclick={() => isMobileFilterOpen = false}
							>
								<span class="sr-only">Close menu</span>
								<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<!-- Filters -->
						<div class="mt-4 border-t border-gray-200">
							{#key collection.name}
								{#each Object.entries(groupedFacets) as [facetName, values]}
								{#if values[0].count !== products.length}
									<div class="border-t border-gray-200 px-4 py-6">
										<h3 class="text-lg font-medium capitalize text-primary-600">
											{facetName}
										</h3>
										<div class="mt-4 space-y-4">
											{#each values as { facetValue, count }}
												<div class="flex items-center">
													<input
														id={`mobile-${facetValue.id}`}
														type="checkbox"
														checked={selectedFilters.has(facetValue.id)}
														onchange={() => toggleFilter(facetValue.id)}
														class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
													/>
													<label
														for={`mobile-${facetValue.id}`}
														class="ml-3 cursor-pointer text-sm text-gray-600 transition-colors hover:text-primary-600"
													>
														{facetValue.name}
														<span class="ml-1 text-gray-400">({count})</span>
													</label>
												</div>
											{/each}
										</div>
									</div>
									{/if}
								{/each}
							{/key}
						</div>

						<!-- Apply filters button -->
						<div class="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-4">
							<button
								type="button"
								class="text-sm text-gray-500"
								onclick={() => { selectedFilters.clear(); filteredProducts = products; }}
							>
								{m.clear_all()}
							</button>
							<button
								type="button"
								class="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
								onclick={() => isMobileFilterOpen = false}
							>
								{m.apply()}
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Product Grid -->
			<div class="lg:col-span-3">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each filteredProducts as p}
						<button
							onclick={() => showProduct(p.slug)}
							class="group relative flex transform flex-col items-center rounded-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
						>
							<div class="relative aspect-square w-full overflow-hidden rounded-lg">
								<Image
									preview={p.productAsset?.preview}
									preset="medium"
									alt={p.productName}
									class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
								/>
								<div
									class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								>
									<h3 class="mb-4 px-4 text-center text-lg font-bold text-white">
										{p.productName}
									</h3>
									<p class="mb-4 text-lg font-medium text-white">
										{p.price.__typename === 'PriceRange'
											? `${p.price.min / 100}€`
											: `${p.price.value / 100}€`}
									</p>
									<a
										href="/product/{p.slug}"
										class="inline-flex items-center rounded-md border border-white px-6 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black"
									>
										{m.show_product()}
									</a>
								</div>
							</div>
							<div class="w-full p-4">
								<h3
									class="mt-2 text-lg font-bold transition-colors duration-300 group-hover:text-primary-600"
								>
									{p.productName}
								</h3>
								<p class="mt-1 text-lg font-medium">
									{p.price.__typename === 'PriceRange'
										? `${p.price.min / 100}€`
										: `${p.price.value / 100}€`}
								</p>
							</div>
						</button>
					{:else}
						<p class="col-span-full text-center text-gray-500 0">
							{m.no_products_found()}
						</p>
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}
