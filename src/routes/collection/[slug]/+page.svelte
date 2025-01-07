<script lang="ts">
	//@ts-nocheck
	import { page } from '$app/state'
	import { getContextClient, queryStore } from '@urql/svelte'
	import { useFragment } from '$lib/gql'
	import { type CollectionFragment, type SearchResultFragment } from '$lib/gql/graphql'
	import { Collection, GetCollection, SearchResult, GetCollections } from '$lib/vendure'
	import Image from '$lib/components/Image.svelte'
	import * as m from '$lib/paraglide/messages.js'
	import CollectionComponent from '$lib/components/Collection.svelte'
	let { data } = $props()
	import { goto } from '$app/navigation'
	// this will load the data in prerendering and initial site load
	let collection: CollectionFragment | null | undefined = $state(useFragment(Collection, data.collection))
	let products: SearchResultFragment[] = $state(useFragment(SearchResult, data.products) || [])
	let collections: CollectionFragment[] = $state(useFragment(Collection, data.collections) || [])

	const collectionsQuery = $derived(queryStore({ client: getContextClient(), query: GetCollections, variables: {} }))
	const filteredCollections = $derived(collections.filter(collection => collection.parent?.slug === page.params.slug))
	// this will load the data in client side navigation
	
	const collectionQuery = $derived(queryStore({ client: getContextClient(), query: GetCollection, variables: { slug: page.params.slug } }))
	$effect(() => {
		if ($collectionQuery?.data?.collection) {
			collection = useFragment(Collection, $collectionQuery.data.collection)
		}
		if ($collectionQuery?.data?.search?.items) {
			products = useFragment(SearchResult, $collectionQuery.data.search.items)
		}
		if ($collectionsQuery?.data?.collections?.items) {
			collections = useFragment(Collection, $collectionsQuery.data.collections.items)
		}
	})
	function showProduct(slug:string){
		goto(`/product/${slug}`)
	}
</script>
{#if collection}
<section class="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
	<!-- <h1 class="text-2xl sm:text-3xl font-bold tracking-tight my-4 sm:my-6">{collection.name}</h1> -->
	<section class="relative hidden sm:block sm:h-80 lg:h-96 w-full mb-8 sm:mb-16">
		<Image preview={collection.featuredAsset?.preview} preset="large" alt={collection.name} class="absolute object-cover w-full h-full rounded-md"/>
		<div class="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
			<h1 class="text-2xl sm:text-4xl font-bold text-white">{collection.name}</h1>
		</div>
	</section>
		<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredCollections as collection, i}
				<CollectionComponent {collection} index={i} />
			{/each}
		</div>
	<div class="mx-auto max-w-screen-2xl">
		<h2 id="products-heading" class="sr-only">{m.products_heading()}</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 gap-y-16 gap-x-6 my-8">
			{#each products as p}
				<button onclick={() => showProduct(p.slug)} class="group relative flex flex-col items-center transform transition duration-300 hover:-translate-y-1 hover:shadow-xl rounded-lg">
					<div class="relative w-80 h-80 overflow-hidden rounded-lg">
						<Image 
							preview={p.productAsset?.preview} 
							preset="medium" 
							alt={p.productName} 
							class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
						/>
						<div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<h3 class="text-white text-lg font-bold text-center px-4 mb-4">
								{p.productName}
							</h3>
							<p class="text-white text-lg font-medium mb-4">
								{p.price?.min ? `${p.price.min / 100}€` : 'not found'}
							</p>
							<a
								href="/product/{p.slug}"
								class="inline-flex items-center px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 rounded-md"
							>
								{m.show_product()}
							</a>
						</div>
					</div>
					<div class="w-full p-4">
						<h3 class="mt-2 text-lg font-bold transition-colors duration-300 group-hover:text-primary-600">
							{p.productName}
						</h3>
						<p class="mt-1 text-lg font-medium text-gray-900">
							{p.price?.min ? `${p.price.min / 100}€` : 'not found'}
						</p>
					</div>
				</button>
			{:else}
				<p>{m.no_products_found()}</p>
			{/each}
		</div>
	</div>
</section>
{/if}
