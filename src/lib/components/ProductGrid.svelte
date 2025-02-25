<!-- ProductGrid.svelte -->
<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { SearchResultFragment } from '$lib/gql/graphql';
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
		filteredProducts: SearchResultFragment[];
	}
	let { filteredProducts }: Props = $props();

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
				{ variantId: variantId, quantity: 1, fillings:""},
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
		cartDialogStore.set(true);
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
	let sortBy = $state<'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('default');
	const sortedProducts = $derived.by(() => {
		if (!filteredProducts) return [];
		return [...filteredProducts].sort((a, b) => {
			const getPrice = (product: SearchResultFragment) =>
				product.price.__typename === 'PriceRange'
					? product.price.min
					: product.price.__typename === 'SinglePrice'
						? product.price.value
						: 0;

			switch (sortBy) {
				case 'price-asc':
					return getPrice(a) - getPrice(b);
				case 'price-desc':
					return getPrice(b) - getPrice(a);
				case 'name-asc':
					return a.productName.localeCompare(b.productName);
				case 'name-desc':
					return b.productName.localeCompare(a.productName);
				default:
					return 0; // Maintain original order
			}
		});
	});
</script>

<div class="lg:col-span-3">
	<div class="mb-6 flex items-center justify-end gap-4 px-4">
		<label class="text-sm font-medium"
			>{m.sort_by()}:
			<select
				class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
				aria-label={m.sort_products()}
				bind:value={sortBy}
			>
				<option value="default">{m.default_sort()}</option>
				<option value="price-asc">{m.price_low_high()}</option>
				<option value="price-desc">{m.price_high_low()}</option>
				<option value="name-asc">{m.name_a_z()}</option>
				<option value="name-desc">{m.name_z_a()}</option>
			</select>
		</label>
	</div>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each sortedProducts as p}
			<div
				class="group relative flex flex-col items-center rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg"
			>
				<div class="relative aspect-square w-full overflow-hidden rounded-t-lg">
					<Image
						preview={p.productAsset?.preview}
						preset="medium"
						alt={p.productName}
						class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
					/>
					<a
						href="/product/{p.slug}"
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
				<div class=" flex w-full flex-1 flex-col p-4 dark:bg-gray-800">
					<div class="mb-4 flex flex-col gap-2">
						<h3
							class="text-lg font-semibold transition-colors duration-300 group-hover:text-primary-600"
						>
							<a href={p.slug}>{p.productName}</a>
						</h3>
						<p class="text-xl font-bold text-primary-600">
							{#if p.price.__typename === 'PriceRange'}
								{formatCurrency(p.price.min, PUBLIC_DEFAULT_CURRENCY)}
							{:else if p.price.__typename === 'SinglePrice'}
								{formatCurrency(p.price.value, PUBLIC_DEFAULT_CURRENCY)}
							{/if}
						</p>
					</div>
					<div class="mt-auto grid w-full">
						{#if p.inStock}
						<!-- 	{#if} -->
							<button
								class="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95"
								onclick={() => addToCart(p.productVariantId)}
								aria-label={m.add_to_cart()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								{m.add_to_cart()}
							</button>
						{:else}
							<button
								class="flex w-full items-center justify-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-all duration-200"
								aria-label={m.insufficient_stock()}
								disabled
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								{m.out_of_stock()}
							</button>
						{/if}
					</div>
					<button
						onclick={() => toggleFavorite(p.slug)}
						class="absolute right-1 top-1 rounded-full p-3 transition-all hover:bg-gray-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95"
						aria-label={favorites[p.slug] ? 'Remove from favorites' : 'Add to favorites'}
					>
						<span class="text-3xl">
							{#if favorites[p.slug]}
								<Heart
									fill="red"
									class="scale-125 transition-transform duration-200 hover:scale-150"
								/>
							{:else}
								<Heart class="transition-transform duration-200 hover:scale-125" />
							{/if}
						</span>
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
