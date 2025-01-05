<script lang="ts">
	import { page } from '$app/state'
	import { getContextClient, queryStore } from '@urql/svelte'
	import { useFragment } from '$lib/gql'
	import { type CollectionFragment, type SearchResultFragment } from '$lib/gql/graphql'
	import { Collection, GetCollection, SearchResult } from '$lib/vendure'
	import Image from '$lib/components/Image.svelte'

	let { data } = $props()

	// this will load the data in prerendering and initial site load
	let collection: CollectionFragment | null | undefined = $state(useFragment(Collection, data.collection))
	let products: SearchResultFragment[] = $state(useFragment(SearchResult, data.products) || [])

	// this will load the data in client side navigation
	const collectionQuery = $derived(queryStore({ client: getContextClient(), query: GetCollection, variables: { slug: page.params.slug } }))
	$effect(() => {
		if ($collectionQuery?.data?.collection) {
			collection = useFragment(Collection, $collectionQuery.data.collection)
		}
		if ($collectionQuery?.data?.search?.items) {
			products = useFragment(SearchResult, $collectionQuery.data.search.items)
		}
	})
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
	<div class="mx-auto max-w-screen-2xl">
		<h2 id="products-heading" class="sr-only">Products</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 gap-y-16 gap-x-6 my-8">
			{#each products as { slug, productName, productAsset }}
				<a href="/product/{slug}" class="group">
					<Image preview={productAsset?.preview} preset="medium" alt={productName} class="mx-auto object-cover h-80 w-80 object-center group-hover:opacity-75 overflow-hidden rounded-lg"/>
					<div class="flex">
						<div class="mx-auto">
							<h3 class="mt-4 text-lg font-bold">{productName}</h3>
							<!-- <p class="mt-1 text-lg font-medium text-gray-900">{product.price.value || product.price.min}</p> -->
						</div>
					</div>
				</a>
			{:else}
				<p>No products found</p>
			{/each}
		</div>
	</div>
</section>
{/if}
