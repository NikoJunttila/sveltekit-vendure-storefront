<script lang="ts">
	import Search from 'lucide-svelte/icons/search';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { useFragment } from '$lib/gql';
	import { SearchResult, SearchProducts } from '$lib/vendure';
	import { clickOutside } from '$lib/utils';
	import * as m from '$lib/paraglide/messages.js';
	import SearchHit from '$lib/components/SearchHit.svelte';

	let q: string = '';
	let hits: any = [];
	const client = getContextClient();
	$: resultStore = queryStore({
		client,
		query: SearchProducts,
		variables: { input: { term: q, take: 10, skip: 0, groupByProduct: true } }
	});
	$: {
		if ($resultStore.data?.search?.items)
			hits = useFragment(SearchResult, $resultStore.data.search.items);
	}

	const handleClick = function (e: any) {
		q = '';
		window.location.href = `/product/${e.detail}`;
	};
</script>

<div class="relative mx-auto hidden w-full max-w-xl md:block">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<Search class="h-7 w-7 text-gray-700" />
	</div>
	<label for="q" class="sr-only">Search</label>
	<input
		type="search"
		placeholder={m.search()}
		bind:value={q}
		class="block w-full rounded-md border border-stone-300 py-3 pl-12 pr-3 leading-5 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500"
	/>
	{#if q}
		<div
			use:clickOutside
			on:clickOutside={() => (q = '')}
			class="absolute z-50 max-h-[80vh] w-full overflow-auto rounded-b-xl border border-gray-200 bg-white"
		>
			{#each hits as hit}
				<SearchHit {hit} on:click={handleClick} />
			{:else}
				<div class="p-4">
					<p>{m.no_results()}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
<div class="ml-auto self-end p-2 md:hidden">
	<button type="button" class="grow-on-hover items-center align-middle">
		<a href="/search">
			<Search class="grow-on-hover h-9 w-9" />
		</a>
	</button>
</div>
