<script lang="ts">
	import { page } from '$app/state';
	import { getContextClient, queryStore } from '@urql/svelte';
	import Meta from '$src/lib/components/Meta.svelte';
	import { useFragment } from '$lib/gql';
	import * as m from '$lib/paraglide/messages';
	import {
		type SearchResultFragment,
		type FacetValueResultFragment,
		type SearchInput
	} from '$lib/gql/graphql';
	import { SearchResult, FacetValueResult, SearchProducts } from '$lib/vendure';
	let { data } = $props();
	import { goto } from '$app/navigation';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import Banner from '$lib/components/Banner.svelte';
	import Paginations from '$src/lib/components/Paginations.svelte';

	let products: SearchResultFragment[] = $state(
		useFragment(SearchResult, data.search?.items ?? [])
	);
	let facetValues: FacetValueResultFragment[] = $state(
		useFragment(FacetValueResult, data.search?.facetValues ?? [])
	);
	const total = $derived(data.search?.totalItems || 0);

	// this will load the data in client side navigation
	const currentPage = $derived(Number(page.params.slug));
	const skip = $derived(currentPage * 20 - 20 || 0);
	const take = 20;
	const input: SearchInput = $derived({
		term: '',
		groupByProduct: true,
		//facetValueIds: $filtersStore,
		take,
		skip: skip
	});

	const searchQuery = $derived(
		queryStore({
			client: getContextClient(),
			query: SearchProducts,
			variables: { input }
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
	});

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
	let filterSize = $state(0);
	// Filter products based on selected facets
	let filteredProducts = $state(useFragment(SearchResult, data.search?.items ?? []));
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
		filterSize = selectedFilters.size;
	}
	function navigate(page: number) {
		goto(`/all/${page}`);
	}
</script>

<Meta
	config={{
		title: m.menu_all_products(),
		description: m.menu_all_products()
	}}
/>

{#if products}
	<section class="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
		<Banner name={m.menu_all_products()} />
		<div class="mt-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
			<Filters
				{groupedFacets}
				{selectedFilters}
				{toggleFilter}
				{filterSize}
				productsLength={products.length}
				{isMobileFilterOpen}
				onClearAll={() => {
					selectedFilters.clear();
					filteredProducts = products;
				}}
			/>
			<ProductGrid {filteredProducts} />
		</div>
		<Paginations totalCount={total} {currentPage} perPage={take} {navigate} />
	</section>
{/if}
