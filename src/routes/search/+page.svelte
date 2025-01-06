<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte'
	import { queryParam } from 'sveltekit-search-params'
	import { useFragment } from '$lib/gql'
	import { SearchResult, SearchProducts } from '$lib/vendure'
	import MetaTags from '$lib/components/Meta.svelte'
	import SearchHit from '$lib/components/SearchHit.svelte'
	import * as m from '$lib/paraglide/messages.js'

	const q = queryParam('q')
	let hits: any = $state([])
	const searchQuery = $derived(queryStore({ 
		client: getContextClient(), 
		query: SearchProducts, 
		variables: { input: { term: $q, take: 10, skip: 0, groupByProduct: true } }, 
		pause: !$q 
	}))
	$effect(() => {
		if ($searchQuery?.data?.search?.items) { hits = useFragment(SearchResult, $searchQuery.data.search.items) }
	})

	const handleClick = function(e: any) {
		$q = ''
		window.location.href = `/product/${e.detail}`
	}
</script>
<MetaTags config={{
	title: m.search()
 }} />
<div class="max-w-screen-2xl mx-auto my-8 px-6 md:px-8">
		<label for="q" class="sr-only">{m.search()}</label>
		<input type="search" bind:value={$q} class="w-full block py-3 px-4 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500" aria-label={m.search()} placeholder={m.search_placeholder()} />
	{#each hits as hit}
		<SearchHit {hit} on:click={handleClick} />
	{:else}
		{#if $q}
			<p>{m.no_results()}</p>
		{:else}
			<p>{m.enter_search()}</p>
		{/if}
	{/each}
</div>