<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { Plus, Minus } from 'lucide-svelte';

	interface Props {
		groupedFacets: Record<string, any>;
		selectedFilters: Set<string>;
		toggleFilter: (id: string) => void;
		filterSize: number;
		productsLength: number;
		isMobileFilterOpen: boolean;
		onClearAll: any;
	}

	let {
		groupedFacets,
		selectedFilters,
		toggleFilter,
		filterSize,
		productsLength = 0,
		isMobileFilterOpen,
		onClearAll
	}: Props = $props();

	// Initialize with all facet groups open
	let _openFacets = $state(new Set<string>(Object.keys(groupedFacets)));

	const toggleFacetGroup = (facetName: string) => {
		_openFacets = new Set(_openFacets); // Create new Set to trigger reactivity
		if (_openFacets.has(facetName)) {
			_openFacets.delete(facetName);
		} else {
			_openFacets.add(facetName);
		}
	};

	// Public readonly accessor
	const openFacets = $derived(_openFacets);
</script>

<!-- Desktop Filters -->
<aside class="hidden lg:block">
	{#key groupedFacets}
		{#each Object.entries(groupedFacets) as [facetName, values]}
			{#if values[0].count !== productsLength}
				<div class="border-b border-gray-200 py-6">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-medium capitalize text-primary-600">{facetName}</h3>
						<button
							onclick={() => toggleFacetGroup(facetName)}
							class="text-gray-400 hover:text-primary-500"
						>
							{#if openFacets.has(facetName)}
								<Minus class="h-5 w-5" />
							{:else}
								<Plus class="h-5 w-5" />
							{/if}
						</button>
					</div>
					{#if openFacets.has(facetName)}
						<div class="mt-4 space-y-4">
							{#each values as { facetValue, count }}
								<div class="flex items-center">
									<input
										id={facetValue.id}
										type="checkbox"
										checked={selectedFilters.has(facetValue.id)}
										onchange={() => toggleFilter(facetValue.id)}
										class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
									/>
									<label
										for={facetValue.id}
										class="ml-3 cursor-pointer text-sm transition-colors hover:text-primary-600"
									>
										{facetValue.name}
										<span class="ml-1 text-gray-400">({count})</span>
									</label>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	{/key}
</aside>

<!-- Mobile Filters -->
<div class="mb-6 lg:hidden">
	<button
		type="button"
		class="flex items-center gap-2 transition-colors hover:text-primary-600"
		onclick={() => (isMobileFilterOpen = true)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
		<button
			class="fixed inset-0 bg-black bg-opacity-25"
			onclick={() => (isMobileFilterOpen = false)}
			aria-label="close"
		></button>
		<div class="relative flex h-full w-full flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
			<div class="flex items-center justify-between px-4">
				<h2 class="text-lg font-medium text-gray-900">{m.filters()}</h2>
				<button
					type="button"
					class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50"
					onclick={() => (isMobileFilterOpen = false)}
				>
					<span class="sr-only">Close menu</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="mt-4 border-t border-gray-200">
				{#key groupedFacets}
					{#each Object.entries(groupedFacets) as [facetName, values]}
						{#if values[0].count !== productsLength}
							<div class="border-t border-gray-200 px-4 py-6">
								<div class="flex items-center justify-between">
									<h3 class="text-lg font-medium capitalize text-primary-600">{facetName}</h3>
									<button
										onclick={() => toggleFacetGroup(facetName)}
										class="text-gray-400 hover:text-primary-500"
									>
										{#if openFacets.has(facetName)}
											<Minus class="h-5 w-5" />
										{:else}
											<Plus class="h-5 w-5" />
										{/if}
									</button>
								</div>
								{#if openFacets.has(facetName)}
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
								{/if}
							</div>
						{/if}
					{/each}
				{/key}
			</div>

			<div
				class="sticky bottom-0 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-4"
			>
				<button type="button" class="text-sm text-gray-500" onclick={onClearAll}>
					{m.clear_all()}
				</button>
				<button
					type="button"
					class="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					onclick={() => (isMobileFilterOpen = false)}
				>
					{m.apply()}
				</button>
			</div>
		</div>
	</div>
{/if}
