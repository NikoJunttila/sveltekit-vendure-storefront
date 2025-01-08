<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getContextClient, queryStore } from '@urql/svelte';
	import { queryParameters } from 'sveltekit-search-params';
	import { toast } from 'svelte-sonner';
	import xss from 'xss';
	import { formatCurrency } from '$lib/utils';
	import { useFragment } from '$lib/gql';
	import { type ProductDetailFragment } from '$lib/gql/graphql';
	import { Asset, AddItemToOrder, GetProduct, ProductDetail } from '$lib/vendure';
	import Meta from '$lib/components/Meta.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Highlights from '$lib/components/Highlights.svelte';
	import { PUBLIC_DEFAULT_CURRENCY, PUBLIC_ORGANIZATION } from '$env/static/public';
	import * as m from '$lib/paraglide/messages.js';
	

	let { data } = $props();
	const client = getContextClient();
	const params = queryParameters();

	// this will load the data in prerendering and initial site load
	let product: ProductDetailFragment | null | undefined = $state(
		useFragment(ProductDetail, data.product)
	);
	const featuredAsset = $derived(useFragment(Asset, product?.featuredAsset));

	// this will load the data in client side navigation
	const productQuery = $derived(
		queryStore({ client, query: GetProduct, variables: { slug: page.params.slug } })
	);
	$effect(() => {
		if ($productQuery?.data?.product) {
			product = useFragment(ProductDetail, $productQuery.data.product);
		}
	});

	const breadcrumbs = $derived(
		product &&
			product.collections &&
			product.collections[product.collections.length - 1].breadcrumbs
	);

	let selectedVariantId = $state('');
	let selectedOptions: any[any] = $state([]);
	$effect(() => {
		selectedVariantId = $params.variant || product?.variants[0]?.id || '';
	});

	let tab: string = $state('reviews');
	$effect(() => {
		tab = $params.tab;
	});

	let processing: boolean = $state(false);

	const handleSelection = (optionGroup: any, option: any) => {
		selectedOptions[optionGroup.id] = option.id;
		let selectedVariant = product?.variants.find((v: any) =>
			v.options.every((o: any) => selectedOptions[o.groupId] === o.id)
		);
		if (selectedVariant) {
			goto(`?variant=${selectedVariant.id}`);
		}
	};

	const addToCart = async (variantId: string): Promise<void> => {
		processing = true;
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
		processing = false;
	};
</script>

{#if product}
	<Meta
		config={{
			title: product.name,
			description: product.description
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
					'fr-CA',
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
				{#each breadcrumbs as breadcrumb}
					{#if breadcrumb.slug === '__root_collection__'}
						<a
							class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
							href="/">							<span
							class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
						>
							{m.home()}
						</span></a
						>
					{:else}
						<span class="before:mr-2 before:content-['/']"></span>
						<a
							href={`/collection/${breadcrumb.slug}`}
							class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
						>
							<span
								class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
							>
								{breadcrumb.name}
							</span>
						</a>
					{/if}
				{/each}
			</div>
			<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
			<h2 id="information-heading" class="sr-only">Product information</h2>
			<p class="mt-6">{@html xss(product.description || '')}</p>
			{#each product.optionGroups as optionGroup}
				<div class="mt-6">
					<h3 class="text-sm font-medium">{optionGroup.name}</h3>
					<div class="mt-4">
						<div class="flex flex-wrap">
							{#each optionGroup.options as option}
								{#if option.id === selectedOptions[optionGroup.id]}
									<button
										type="button"
										class="mb-2 mr-2 whitespace-nowrap rounded-lg border-4 border-lime-600 bg-white px-3 py-2 text-sm font-medium uppercase text-black hover:bg-white"
									>
										{option.name}
									</button>
								{:else}
									<button
										type="button"
										onclick={(e) => {
											handleSelection(optionGroup, option);
										}}
										class="mb-2 mr-2 whitespace-nowrap rounded-lg border border-gray-400 bg-white px-3 py-2 text-sm font-medium uppercase text-black hover:bg-stone-200"
									>
										{option.name}
									</button>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{/each}
			<div class="mt-6">
				<h3 class="text-sm font-medium">{m.price()}</h3>
				{#if product.variants[product.variants.findIndex((v) => v.id === selectedVariantId)]}
					<div class="mt-1 flex items-baseline">
						<p class="text-xl font-semibold">
							{formatCurrency(
								product.variants[product.variants.findIndex((v) => v.id === selectedVariantId)]
									.price,
								PUBLIC_DEFAULT_CURRENCY
							)}
						</p>
						<p class="ml-1 text-sm font-medium">
							/ {product.variants[product.variants.findIndex((v) => v.id === selectedVariantId)]
								?.name}
						</p>
					</div>
				{:else}
					{m.select_variant()}
				{/if}
			</div>
			<button
				type="button"
				disabled={processing}
				onclick={async () => {
					addToCart(selectedVariantId);
				}}
				class="mt-6 w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700"
			>
				{m.add_to_cart()}
			</button>
		</div>
		<div class="mt-10 items-start lg:col-start-2 lg:row-span-2 lg:mt-0">
			<Gallery assets={product.assets} />
		</div>
		<div class="mb-4">
			<Highlights />
		</div>
		<!-- Tabs -->
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
				<!-- <ProductReviews bind:reviewForm={data.reviewForm} {product} {user} {reviews} /> -->
			{:else if tab == 'faq'}
				<FAQ />
			{/if}
		</div>
	</div>
{/if}
