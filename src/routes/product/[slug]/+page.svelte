<script lang="ts">
	import { page } from '$app/state';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { queryParameters } from 'sveltekit-search-params';
	import { toast } from '$lib/toast.svelte';
	import xss from 'xss';
	import { formatCurrency } from '$lib/utils';
	import { useFragment } from '$lib/gql';
	import { type ProductDetailCustomFieldsFragment } from '$lib/gql/graphql';
	import {
		Asset,
		AddItemToOrder,
		GetProduct,
		ProductDetailCustomFields
	} from '$lib/vendure';
	import Meta from '$lib/components/Meta.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Highlights from '$lib/components/Highlights.svelte';
	import { PUBLIC_DEFAULT_CURRENCY, PUBLIC_ORGANIZATION } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';
	import BreadcrumbsComponent from '$src/lib/components/BreadcrumbsComponent.svelte';
	import { onMount } from 'svelte';
	import { Heart } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { cartDialogStore } from '$lib/stores';

	let { data } = $props();
	const client = getContextClient();
	const params = queryParameters();

	let favorites = $state<Record<string, boolean>>({});

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
	onMount(() => {
		if (browser) {
			if (typeof localStorage !== 'undefined') {
				try {
					const saved = localStorage.getItem('favorites');
					favorites = saved ? JSON.parse(saved) : {};
				} catch (e) {
					console.error('Error loading favorites:', e);
				}
			}
		}
	});

	// this will load the data in prerendering and initial site load
	let product: ProductDetailCustomFieldsFragment | null | undefined = $state(
		useFragment(ProductDetailCustomFields, data.product)
	);
	const featuredAsset = $derived(useFragment(Asset, product?.featuredAsset));

	// this will load the data in client side navigation
	const productQuery = $derived(
		queryStore({ client, query: GetProduct, variables: { slug: page.params.slug } })
	);
	$effect(() => {
		if ($productQuery?.data?.product) {
			product = useFragment(ProductDetailCustomFields, $productQuery.data.product);
		}
	});

	const breadcrumbs = $derived(
		product &&
			product.collections &&
			product.collections[product.collections.length - 1].breadcrumbs
	);

	let selectedVariantId = $state('');
	$effect(() => {
		selectedVariantId = $params.variant || product?.variants[0]?.id || '';
	});

	// Derived state for selected variant
	const selectedVariant = $derived(product?.variants.find((v) => v.id === selectedVariantId));

	let tab: string = $state('reviews');
	$effect(() => {
		tab = $params.tab;
	});

	let processing: boolean = $state(false);

	const handleVariantChange = (event: Event) => {
		event.preventDefault();
		const variantId = (event.target as HTMLSelectElement).value;

		// Create a URL object from the current location
		const url = new URL(window.location.href);

		// Update the 'variant' query parameter
		url.searchParams.set('variant', variantId);

		// Update the URL without reloading the page
		window.history.pushState({}, '', url);
	};

	const addToCart = async (variantId: string): Promise<void> => {
		processing = true;
		const fillings = selectedFillings.join(", ") || ""
		const result = await client
			.mutation(
				AddItemToOrder,
				{ variantId: variantId, quantity: 1, fillings: fillings },
				{ additionalTypenames: ['ActiveOrder'] }
			)
			.toPromise();
		switch (result?.data?.addItemToOrder?.__typename) {
			case 'InsufficientStockError':
				toast.error(m.insufficient_stock());
				break;
			case 'Order':
				toast.success(m.item_added());
				cartDialogStore.set(true);
				break;
			default:
				toast.error(m.error_adding_item());
				break;
		}
		processing = false;
	};
	const isOutOfStock = $derived.by(() => {
		return product?.variants.every((variant) => variant.stockLevel !== 'IN_STOCK') ?? false;
	});

	let selectedFillings = $state<string[]>([]);

	// Add this function to handle filling selection
	function toggleFilling(filling: string) {
		const customizationOptions = product?.customFields?.customizationOptions;
		if (!customizationOptions) return;

		if (selectedFillings.includes(filling)) {
			selectedFillings = selectedFillings.filter((f) => f !== filling);
		} else if (selectedFillings.length < customizationOptions.limit!) {
			selectedFillings = [...selectedFillings, filling];
		}
	}

	// Reset selected fillings when variant changes
	$effect(() => {
		selectedFillings = [];
	});
	const selectedFilling = $derived.by(() => {
		const customizationOptions = product?.customFields?.customizationOptions;
		if(!customizationOptions?.enabled) return false
		return customizationOptions.limit == selectedFillings.length;
	});

</script>

{#if product}
	<Meta
		config={{
			title: product.name,
			description: product.description,
			open_graph_image: featuredAsset?.preview || '',
			open_graph_image_alt: featuredAsset?.name || ''
		}}
	/>
	<JsonLd
		schema={{
			'@type': 'Product',
			name: product.name,
			image: featuredAsset?.preview || '',
			description: product.description || '',
			// gtin: product.customFields?.gtin || '',
			// category: product.customFields?.category || '',
			// brand: {
			// 	name: product.customFields?.brand || '',
			// 	'@type': "Brand"
			// },
			offers: {
				'@type': 'Offer',
				// itemCondition: product.customFields?.itemCondition as any,
				priceCurrency: product.variants[0].currencyCode,
				seller: {
					name: PUBLIC_ORGANIZATION,
					'@type': 'Organization'
				},
				availability: 'https://schema.org/InStock',
				price: product.variants[0].price,
				priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toLocaleDateString(
					'fi-FI',
					{ year: 'numeric', month: '2-digit', day: '2-digit' }
				),
				hasMerchantReturnPolicy: {
					'@type': 'MerchantReturnPolicy'
					// returnFees: product.customFields?.returnFees as any,
					// returnMethod: product.customFields?.returnMethod as any,
					// returnPolicyCategory: product.customFields?.returnPolicyCategory as any,
					// merchantReturnDays: product.customFields?.merchantReturnDays as any,
					// merchantReturnLink: product.customFields?.merchantReturnLink as any
				}
			}
			// aggregateRating: {
			// 	bestRating: 5,
			// 	reviewCount: 617,
			// 	ratingValue: 4.28,
			// 	'@type': "AggregateRating"
			// },
			// review: jsonldReviews(snorerxReviews)
		}}
	/>
	<div
		class="mx-auto max-w-screen-2xl px-6 py-6 sm:px-12 md:px-14 lg:grid lg:grid-cols-2 lg:gap-x-6"
	>
		<div class="lg:max-w-lg">
			<div class="mb-2">
				<BreadcrumbsComponent {breadcrumbs} />
			</div>

			<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
				{product.name}
				<!-- Favorite Button -->
				<button
					onclick={() => toggleFavorite(product!.slug)}
					class=" z-10 rounded-full p-3 backdrop-blur-sm transition-all hover:text-yellow-400"
				>
					{#if favorites[product.slug]}
						<span class="text-2xl">
							<Heart fill="red"></Heart>
						</span>
					{:else}
						<span class="text-2xl">
							<Heart></Heart>
						</span>
					{/if}
				</button>
			</h1>
			<h2 id="information-heading" class="sr-only">Product information</h2>
			<p class="mt-6">{@html xss(product.description || '')}</p>

			{#if product.variants.length > 1}
				<div class="mt-6">
					<h3 class="text-sm font-medium">{m.select_variant()}</h3>
					<select
						bind:value={selectedVariantId}
						onchange={handleVariantChange}
						class="mt-2 w-full rounded-md border border-gray-300 p-2 text-gray-800"
					>
						{#each product.variants as variant}
							<option value={variant.id} disabled={variant.stockLevel !== 'IN_STOCK'}>
								{variant.name} -
								{#if variant.stockLevel === 'IN_STOCK'}
									{formatCurrency(variant.price, PUBLIC_DEFAULT_CURRENCY)}
								{:else}
									({m.out_of_stock()})
								{/if}
							</option>
						{/each}
					</select>
				</div>
			{/if}

			<!-- Price Display -->
			<div class="mt-6">
				<h3 class="text-sm font-medium">{m.price()}</h3>
				{#if selectedVariant}
					<div class="mt-1 flex items-baseline">
						<p class="text-xl font-semibold">
							{formatCurrency(selectedVariant.price, PUBLIC_DEFAULT_CURRENCY)}
						</p>
						<p class="ml-1 text-sm font-medium">
							/ {selectedVariant.name}
						</p>
					</div>
				{:else}
					{m.select_variant()}
				{/if}
			</div>
			{#if product.customFields?.customizationOptions?.enabled}
				<div class="mt-4">
					<h3 class="text-lg font-medium">
						{m.choose_up_to({limit:`${product.customFields.customizationOptions.limit}`})}:
					</h3>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each product.customFields.customizationOptions.filling!.split(',') as filling}
							<button
								type="button"
								onclick={() => toggleFilling(filling)}
								class:selected={selectedFillings.includes(filling)}
								class="rounded-full border-2 px-4 py-2 {selectedFillings.includes(filling)
									? 'border-lime-600 bg-lime-100 text-black'
									: 'border-gray-500'} {selectedFillings.length >=
									product.customFields.customizationOptions.limit! &&
								!selectedFillings.includes(filling)
									? 'cursor-not-allowed opacity-50'
									: ''}"
							>
								{filling}
							</button>
						{/each}
					</div>
					<p class="mt-2 text-sm ">
						{selectedFillings.length} / {product.customFields.customizationOptions.limit} {m.selected()}
					</p>
				</div>
			{/if}
			{#if isOutOfStock}
				<button
					type="button"
					disabled
					class="mt-6 w-full items-center justify-center rounded-md border border-transparent bg-gray-600 px-5 py-3 text-lg font-medium text-red-600 duration-300"
				>
					{m.out_of_stock()}
				</button>
			{:else}
				<button
					type="button"
					disabled={!selectedFilling}
					onclick={async () => {
						addToCart(selectedVariantId);
					}}
					class="disabled:bg-gray-600 mt-6 w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white duration-300 hover:bg-lime-700"
				>
					{m.add_to_cart()}
				</button>
			{/if}
		</div>
		<div class="mt-10 items-start lg:col-start-2 lg:row-span-2 lg:mt-0">
			<Gallery assets={product.assets} />
		</div>
		<div class="mb-4">
			<Highlights />
		</div>
		<!-- Tabs 
		<div class="max-w-screen-lg lg:col-span-2">
			<div class="flex" aria-orientation="horizontal" role="tablist">
				<a href={`/product/${product.slug}?variant=${selectedVariantId}&tab=reviews`}>
					<button
						type="button"
						class={tab === 'reviews'
							? 'mr-4 whitespace-nowrap border-b-2 border-lime-600 p-3 pr-4 font-medium'
							: 'mr-4 whitespace-nowrap border-b border-gray-300 p-3 pr-4 text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'}
					>
						{m.customer_reviews()}
					</button>
				</a>
				<a href={`/product/${product.slug}?variant=${selectedVariantId}&tab=faq`}>
					<button
						type="button"
						class={tab === 'faq'
							? 'mr-4 whitespace-nowrap border-b-2 border-lime-600 p-3 px-4 font-medium'
							: 'mr-4 whitespace-nowrap border-b border-gray-300 p-3 px-4 text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'}
					>
						{m.faq()}
					</button>
				</a>
			</div>
			{#if tab == 'reviews'}
				<ProductReviews bind:reviewForm={data.reviewForm} {product} {user} {reviews} /> 
			{:else if tab == 'faq'}
				<FAQ />
			{/if}
		</div>
	-->
	</div>
{/if}
