<!-- ProductGrid.svelte -->
<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { SearchResultFragment } from '$lib/gql/graphql';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { formatCurrency } from '$lib/utils';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
	import { Heart } from 'lucide-svelte';
	import { getContextClient } from '@urql/svelte';
	import { toast } from '../toast.svelte';
	import { AddItemToOrder } from '../vendure';
	import { cartDialogStore } from '$lib/stores';


	const client = getContextClient();
    interface Props {
        filteredProducts : SearchResultFragment[]
	}
	let { filteredProducts}: Props = $props();

    // Favorite functionality
    let favorites = $state<Record<string, boolean>>({});

    onMount(() => {
        if (typeof localStorage !== 'undefined') {
            try {
                const saved = localStorage.getItem('favorites');
                favorites = saved ? JSON.parse(saved) : {};
            } catch (e) {
                console.error('Error loading favorites:', e);
            }
        }
    });

	const addToCart = async (variantId: string): Promise<void> => {
		const result = await client
			.mutation(
				AddItemToOrder,
				{ variantId: variantId, quantity: 1 },
				{ additionalTypenames: ['ActiveOrder'] }
			)
			.toPromise();
		switch (result?.data?.addItemToOrder?.__typename) {
			case 'InsufficientStockError':
				toast.error(m.insufficient_stock());
				break;
			case 'Order':
				toast.success(m.item_added());
				break;
			default:
				toast.error(m.error_adding_item());
				break;
		}
		cartDialogStore.set(true)
	};

    function toggleFavorite(productId: string) {
        favorites = { 
            ...favorites,
            [productId]: !favorites[productId]
        };
        
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    }
</script>

<style>
	/* Basic fade animation for all browsers */
	.lg\:col-span-3 .grid > * {
	  opacity: 0;
	  transition: opacity 0.5s ease-out;
	}
  
	/* Modern browsers with animation-timeline support */
	@supports (animation-timeline: view()) {
	  @media (prefers-reduced-motion: no-preference) {
		.lg\:col-span-3 .grid > * {
		  opacity: 0;
		  scale: 0.8;
		  animation: fade-in linear forwards;
		  animation-timeline: view();
		  animation-range: 50px 28%;
		  transition: none; /* Disable basic fade for modern browsers */
		}
	  }
	}
  
	/* Fallback for browsers without animation-timeline support */
	@supports not (animation-timeline: view()) {
	  @media (prefers-reduced-motion: no-preference) {
		.lg\:col-span-3 .grid > * {
		  opacity: 1;
		  scale: 1;
		  animation: simple-fade 0.5s ease-out;
		}
	  }
	}
  
	@keyframes fade-in {
	  to {
		opacity: 1;
		scale: 1;
	  }
	}
  
	@keyframes simple-fade {
	  from {
		opacity: 0;
		transform: translateY(20px);
	  }
	  to {
		opacity: 1;
		transform: translateY(0);
	  }
	}
  </style>


<div class="lg:col-span-3">
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredProducts as p}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="group relative flex transform flex-col items-center rounded-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
				transition:fade
			>
				<div id="test" class="relative aspect-square w-full overflow-hidden rounded-lg">
					<Image
						preview={p.productAsset?.preview}
						preset="medium"
						alt={p.productName}
						class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
					/>
					<a href="/product/{p.slug}"
						class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					>
						<h3 class="mb-4 px-4 text-center text-lg font-bold text-white">
							{p.productName}
						</h3>
						<p
							
							class="inline-flex items-center rounded-md border border-white px-6 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black"
						>
							{m.show_product()}
					</p>
					</a>
				</div>
				<div class="w-full flex items-center gap-2 p-4">
					<div class="flex justify-center items-center gap-2">
					<h3
						class=" text-lg font-medium transition-colors duration-300 group-hover:text-primary-600"
					>
						{p.productName}
					</h3>
					<p class=" text-lg font-medium">
						{#if p.price.__typename === "PriceRange"}
						{formatCurrency(p.price.min, PUBLIC_DEFAULT_CURRENCY)}
						{:else if p.price.__typename === "SinglePrice"}
						{formatCurrency(p.price.value, PUBLIC_DEFAULT_CURRENCY)}
						{/if}
					</p>
					</div>
					
					<button class="button" onclick={() => addToCart(p.productVariantId)}>
						{m.add_to_cart()}
					</button>
						<button
						onclick={() => toggleFavorite(p.slug)}
						class="rounded-full ml-auto mr-5  p-2 backdrop-blur-sm transition-all  hover:text-yellow-400"
						>
						{#if favorites[p.slug]}
							<span class="text-3xl">
								<Heart fill="red"></Heart>
							</span>
						{:else}
							<span class="text-3xl">
								<Heart>

								</Heart>
							</span>
						{/if}
					</button>
				</div>
			</div>
		{:else}
			<p class="col-span-full text-center text-gray-500">
				{m.no_products_found()}
			</p>
		{/each}
	</div>
</div>