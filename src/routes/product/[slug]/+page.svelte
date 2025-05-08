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
		//@ts-ignore
		useFragment(ProductDetailCustomFields, data.product)
	);
	const featuredAsset = $derived(useFragment(Asset, product?.featuredAsset));

	// this will load the data in client side navigation
	const productQuery = $derived(
		queryStore({ client, query: GetProduct, variables: { slug: page.params.slug } })
	);
	$effect(() => {
		if ($productQuery?.data?.product) {
		//@ts-ignore
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

	// Parse extra options from JSON
	const extraOptionsMap = $derived.by(() => {
		try {
			if (!product?.customFields?.extraoptions?.extrachoices) return {};
			// Handle both string JSON format or direct object
			const extraChoicesRaw = product.customFields.extraoptions.extrachoices;
			return typeof extraChoicesRaw === 'string' ? JSON.parse(extraChoicesRaw) : extraChoicesRaw;
		} catch (e) {
			console.error('Error parsing extra options:', e);
			return {};
		}
	});

	// Get array of extra options
	const extraOptionsList = $derived.by(() => {
		return Object.keys(extraOptionsMap);
	});

	// Track selected extras and their prices
	interface SelectedExtra {
		name: string;
		price: number;
	}
	
	let selectedExtras = $state<SelectedExtra[]>([]);

	const addToCart = async (variantId: string): Promise<void> => {
		processing = true;
		const fillings = selectedFillings.join(", ") || "";
		const extrachoicestring = selectedExtras.length > 0 ? selectedExtras.map(item => `${item.name} ${item.price/100}€`).join(", ") : "";
		console.log("string", extrachoicestring)
		// For backward compatibility with the backend schema
		// Encode the JSON information about extras in the extrachoices field
		// Format: "option1:price1,option2:price2"
		const extrachoices = selectedExtras.length > 0
			? selectedExtras.map(item => `${item.name}:${item.price}`).join(",")
			: "";
		
		const result = await client
			.mutation(
				AddItemToOrder,
				{ variantId: variantId, quantity: 1, 
					customFields: {
						fillings, 
						extrachoicestring,
						extraoptions: {
							enabled: product!.customFields?.extraoptions?.enabled,
							price: product!.customFields?.extraoptions?.price,
							extrachoices: extrachoices
						}
					} 
				},
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

	// State for fillings selection
	let selectedFillings = $state<string[]>([]);

	// Handle filling selection
	function toggleFilling(filling: string) {
		const customizationOptions = product?.customFields?.customizationOptions;
		if (!customizationOptions) return;

		if (selectedFillings.includes(filling)) {
			selectedFillings = selectedFillings.filter((f) => f !== filling);
		} else if (selectedFillings.length < customizationOptions.limit!) {
			selectedFillings = [...selectedFillings, filling];
		}
	}

	// Handle extra options selection
	function toggleExtra(extra: string) {
		const price = extraOptionsMap[extra] || 0;
		const isSelected = selectedExtras.some(item => item.name === extra);
		
		if (isSelected) {
			selectedExtras = selectedExtras.filter(item => item.name !== extra);
		} else {
			selectedExtras = [...selectedExtras, { name: extra, price }];
		}
	}

	// Reset selections when variant changes
	$effect(() => {
		selectedFillings = [];
		selectedExtras = [];
	});
	
	// Check if correct number of fillings is selected
	const fillingRequirementMet = $derived.by(() => {
		const customizationOptions = product?.customFields?.customizationOptions;
		if(!customizationOptions?.enabled) return true;
		return customizationOptions.limit == selectedFillings.length;
	});

	// Calculate extra price
	const extraPrice = $derived.by(() => {
		if (selectedExtras.length === 0) return 0;
		return selectedExtras.reduce((sum, item) => sum + item.price, 0);
	});

	// Total price calculation
	const totalPrice = $derived.by(() => {
		if(!selectedVariant) return 0;
		return selectedVariant.price + extraPrice;
	});

	// Format ingredients and allergens for display
	const ingredientsList = $derived.by(() => {
		const list = product?.customFields?.incredientlist;
		return list ? list.split(',').map(item => item.trim()) : [];
	});

	const allergensList = $derived.by(() => {
		const list = product?.customFields?.allergenlist;
		return list ? list.split(',').map(item => item.trim()) : [];
	});

	// Show ingredient info panel
	let showIngredientInfo = $state(false);
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
			offers: {
				'@type': 'Offer',
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
				}
			}
		}}
	/>
	<div
		class="mx-auto max-w-screen-2xl px-6 py-6 sm:px-12 md:px-14 lg:grid lg:grid-cols-2 lg:gap-x-6"
	>
		<div class="lg:max-w-lg">
			<div class="mb-2">
				{#if breadcrumbs}
				<BreadcrumbsComponent {breadcrumbs} />
				{/if}
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

			<!-- Ingredients & Allergen Info Button -->
			{#if ingredientsList.length > 0 || allergensList.length > 0}
				<button
					onclick={() => (showIngredientInfo = !showIngredientInfo)}
					class="mt-4 text-sm font-medium text-lime-600 hover:text-lime-800"
				>
					{showIngredientInfo ? m.hide_ingredients_allergens() : m.show_ingredients_allergens()}
				</button>
				
				{#if showIngredientInfo}
					<div class="mt-2 rounded-md border border-gray-200 bg-gray-50 p-4">
						{#if ingredientsList.length > 0}
							<div class="mb-3">
								<h3 class="font-medium text-black">{m.ingredients()}</h3>
								<p class="text-sm text-gray-600">{ingredientsList.join(', ')}</p>
							</div>
						{/if}
						
						<h3 class="font-medium text-black">{m.allergens()}</h3>
						{#if allergensList.length > 0}
							<div>
								<p class="text-sm text-gray-600 font-bold">{allergensList.join(', ')}</p>
							</div>
						{:else}
							<div>
								<p class="text-sm text-gray-600 font-bold">{m.no_allergens()}</p>
							</div>
						{/if}
					</div>
				{/if}
			{/if}

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
							{formatCurrency(totalPrice, PUBLIC_DEFAULT_CURRENCY)}
						</p>
						<p class="ml-1 text-sm font-medium">
							/ {selectedVariant.name}
						</p>
					</div>
					{#if extraPrice > 0}
						<p class="text-sm text-gray-600 dark:text-gray-200">
							({m.base()} {formatCurrency(selectedVariant.price, PUBLIC_DEFAULT_CURRENCY)} + 
							{m.extras()} {formatCurrency(extraPrice, PUBLIC_DEFAULT_CURRENCY)})
						</p>
					{/if}
				{:else}
					{m.select_variant()}
				{/if}
			</div>
			
			<!-- Customization Options (Fillings) -->
			{#if product.customFields?.customizationOptions?.enabled}
				<div class="mt-4">
					<h3 class="text-lg font-medium">
						{m.choose_up_to({limit:`${product.customFields.customizationOptions.limit}`})}:
					</h3>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each product.customFields.customizationOptions.filling!.split(',') as filling}
							<button
								type="button"
								onclick={() => toggleFilling(filling.trim())}
								class:selected={selectedFillings.includes(filling.trim())}
								class="rounded-full border-2 px-4 py-2 {selectedFillings.includes(filling.trim())
									? 'border-lime-600 bg-lime-100 text-black'
									: 'border-gray-500'} {selectedFillings.length >=
									product.customFields.customizationOptions.limit! &&
								!selectedFillings.includes(filling.trim())
									? 'cursor-not-allowed opacity-50'
									: ''}"
							>
								{filling.trim()}
							</button>
						{/each}
					</div>
					<p class="mt-2 text-sm">
						{selectedFillings.length} / {product.customFields.customizationOptions.limit} {m.selected()}
					</p>
				</div>
			{/if}
			
			<!-- Extra Options -->
			{#if product.customFields?.extraoptions?.enabled && extraOptionsList.length > 0}
				<div class="mt-6">
					<h3 class="text-lg font-medium">
						{m.add_extras()}
					</h3>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each extraOptionsList as extra}
							<button
								type="button"
								onclick={() => toggleExtra(extra.trim())}
								class:selected={selectedExtras.some(item => item.name === extra.trim())}
								class="rounded-full border-2 px-4 py-2 {selectedExtras.some(item => item.name === extra.trim())
									? 'border-lime-600 bg-lime-100 text-black'
									: 'border-gray-500'}"
							>
								{extra.trim()} (+{formatCurrency(extraOptionsMap[extra], PUBLIC_DEFAULT_CURRENCY)})
							</button>
						{/each}
					</div>
					{#if selectedExtras.length > 0}
						<p class="mt-2 text-sm">
							{m.extras_selected({count:selectedExtras.length, price:formatCurrency(extraPrice, PUBLIC_DEFAULT_CURRENCY)})}
						</p>
					{/if}
				</div>
			{/if}
			
			<!-- Add to Cart Button -->
			{#if isOutOfStock}
				<button
					type="button"
					disabled
					class="mt-6 w-full items-center justify-center rounded-md border border-transparent bg-gray-600 px-5 py-3 text-lg font-medium text-red-600 duration-300"
				>
					{m.out_of_stock()}
				</button>
			{:else if product.customFields?.customizationOptions?.enabled}
				<button
					type="button"
					disabled={!fillingRequirementMet}
					onclick={async () => {
						addToCart(selectedVariantId);
					}}
					class="disabled:bg-gray-600 mt-6 w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white duration-300 hover:bg-lime-700"
				>
					{!fillingRequirementMet ? m.choose_up_to({limit:`${product.customFields.customizationOptions.limit}`}) : m.add_to_cart()}
				</button>
			{:else}	
				<button
					type="button"
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
		<!-- Tabs section commented out as in original code -->
	</div>
{/if}