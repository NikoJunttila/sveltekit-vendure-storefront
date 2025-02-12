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
	import CollectionComponent from '$lib/components/Collection.svelte';
	import BreadcrumbsComponent from '$src/lib/components/BreadcrumbsComponent.svelte';
	import ProductGrid from '$src/lib/components/ProductGrid.svelte';
	import Filters from '$src/lib/components/Filters.svelte';
	import Banner from '$src/lib/components/Banner.svelte';
	import JsonLd from '$src/lib/components/JsonLd.svelte';

	let { data } = $props();

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
		filterSize = selectedFilters.size;
	}
</script>

<JsonLd
	schema={{
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': '#webpage',
		mainEntity: {
			'@type': 'Collection',
			name: '{collection.name}',
			description: '{collection.description}',
			image: '{collection.featuredAsset?.preview}'
		}
	}}
/>
<Meta
	config={{
		title: collection?.name,
		description: collection?.description,
		open_graph_image: collection?.featuredAsset?.preview || '',
		open_graph_image_alt: collection?.name || ''
	}}
/>
{#if collection}
	<section class="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
		<Banner name={collection.name} image={collection.featuredAsset?.preview!} />
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
	</section>
{/if}
