<!-- ProductGrid.svelte -->
<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { SearchResultFragment } from '$lib/gql/graphql';
	import { fade } from 'svelte/transition';

    interface Props {
        filteredProducts : SearchResultFragment[]
        onProductClick: any
	}
	let { filteredProducts, onProductClick }: Props = $props();
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
			<button
				onclick={() => onProductClick(p.slug)}
				class="group relative flex transform flex-col items-center rounded-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
				transition:fade
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