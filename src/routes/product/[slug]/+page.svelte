<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { getContextClient, queryStore } from '@urql/svelte'
	import { queryParameters } from 'sveltekit-search-params'
	import { toast } from 'svelte-sonner'
	import xss from 'xss'
	import { formatCurrency } from '$lib/utils'
	import { useFragment } from '$lib/gql'
	import { type ProductDetailFragment } from '$lib/gql/graphql'
	import { Asset, AddItemToOrder, GetProduct, ProductDetail } from '$lib/vendure'
	import Meta from '$lib/components/Meta.svelte'
	import JsonLd from '$lib/components/JsonLd.svelte'
	import FAQ from '$lib/components/FAQ.svelte'
	import Gallery from '$lib/components/Gallery.svelte'
	import Highlights from '$lib/components/Highlights.svelte'
	import { PUBLIC_DEFAULT_CURRENCY, PUBLIC_ORGANIZATION } from '$env/static/public'

	let { data } = $props()
	const client = getContextClient()
	const params = queryParameters()

	// this will load the data in prerendering and initial site load
	let product: ProductDetailFragment | null | undefined = $state(useFragment(ProductDetail, data.product))
	const featuredAsset = $derived(useFragment(Asset, product?.featuredAsset))

	// this will load the data in client side navigation
	const productQuery = $derived(queryStore({ client, query: GetProduct, variables: { slug: page.params.slug } }))
	$effect(() => {
		if ($productQuery?.data?.product) { product = useFragment(ProductDetail, $productQuery.data.product) }
	})

	let selectedVariantId = $state('')
	let selectedOptions: any[any] = $state([])
	$effect(() => {
		selectedVariantId = $params.variant || product?.variants[0]?.id || ''
	})

	let tab: string = $state('reviews')
	$effect(() => {
		tab = $params.tab
	})

	let processing: boolean = $state(false)

	const handleSelection = (optionGroup: any, option: any) => {
		selectedOptions[optionGroup.id] = option.id
		let selectedVariant = product?.variants.find((v: any) => v.options.every((o: any) => selectedOptions[o.groupId] === o.id))
		if (selectedVariant) {
			goto(`?variant=${selectedVariant.id}`)
		}
	}

	const addToCart = async (variantId: string): Promise<void> => {
		processing = true
		const result = await client.mutation(AddItemToOrder, { variantId: variantId, quantity: 1 }, { additionalTypenames: ['ActiveOrder'] }).toPromise()
		switch(result?.data?.addItemToOrder?.__typename) {
			case 'InsufficientStockError':
				toast.error('Insufficient stock')
				break
			case 'Order':
				toast.success('Item added to cart')
				break
			default:
				toast.error('Error adding item to cart')
				break
		}
		processing = false
	}

</script>
{#if product}
<Meta config={{
	title: product.name,
	description: product.description
}} />
<JsonLd schema={{
	'@type': "Product",
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
		'@type': "Offer",
		// itemCondition: product.customFields?.itemCondition as any,
		priceCurrency: product.variants[0].currencyCode,
		seller: {
			name: PUBLIC_ORGANIZATION,
			'@type': "Organization"
		},
		availability: "https://schema.org/InStock",
		price: product.variants[0].price,
		priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit'}),
		hasMerchantReturnPolicy: {
			'@type': "MerchantReturnPolicy",
			// returnFees: product.customFields?.returnFees as any,
			// returnMethod: product.customFields?.returnMethod as any,
			// returnPolicyCategory: product.customFields?.returnPolicyCategory as any,
			// merchantReturnDays: product.customFields?.merchantReturnDays as any,
			// merchantReturnLink: product.customFields?.merchantReturnLink as any
		},
	},
	// aggregateRating: {
	// 	bestRating: 5,
	// 	reviewCount: 617,
	// 	ratingValue: 4.28,
	// 	'@type': "AggregateRating"
	// },
	// review: jsonldReviews(snorerxReviews)
}} />
<div class="max-w-screen-2xl mx-auto py-6 px-6 sm:px-12 md:px-14 lg:grid lg:grid-cols-2 lg:gap-x-6">
	<div class="lg:max-w-lg">
		<h1 class="text-2xl sm:text-3xl font-bold tracking-tight">{product.name}</h1>
		<h2 id="information-heading" class="sr-only">Product information</h2>
		<p class="mt-6">{@html xss(product.description || '')}</p>
		{#each product.optionGroups as optionGroup}
			<div class="mt-6">
				<h3 class="text-sm font-medium">{optionGroup.name}</h3>
				<div class="mt-4">
					<div class="flex flex-wrap">
					{#each optionGroup.options as option}
						{#if option.id === selectedOptions[optionGroup.id]}
						<button type="button" class="uppercase whitespace-nowrap px-3 py-2 mr-2 mb-2 rounded-lg text-sm font-medium border-4 border-lime-600 bg-white hover:bg-white">
							{option.name}
						</button>
						{:else}
						<button type="button" onclick={(e) => { handleSelection(optionGroup, option) }} class="uppercase whitespace-nowrap px-3 py-2 mr-2 mb-2 rounded-lg text-sm font-medium border border-gray-400 bg-white hover:bg-stone-200">
							{option.name}
						</button>
						{/if}
					{/each}
					</div>
				</div>
			</div>
		{/each}
		<div class="mt-6">
			<h3 class="text-sm font-medium">Price</h3>
			{#if product.variants[product.variants.findIndex(v => v.id === selectedVariantId)]}
				<div class="mt-1 flex items-baseline">
					<p class="text-xl font-semibold">{formatCurrency(product.variants[product.variants.findIndex(v => v.id === selectedVariantId)].price, PUBLIC_DEFAULT_CURRENCY)}</p>
					<p class="ml-1 text-sm font-medium">/ {product.variants[product.variants.findIndex(v => v.id === selectedVariantId)]?.name}</p>
				</div>
			{:else}
				Select a Variant
			{/if}
		</div> 
		<button type="button" disabled={processing} onclick={ async () => { addToCart(selectedVariantId) }} class="mt-6 w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700">
			Add to Cart
		</button>
	</div>
	<div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 items-start">
		<Gallery assets={product.assets} />      
	</div>
	<div class="mb-4">
		<Highlights />
	</div>
	<!-- Tabs -->
	<div class="max-w-screen-lg lg:col-span-2">
		<div class="flex" aria-orientation="horizontal" role="tablist">
			<a href={`/product/${product.slug}?variant=${selectedVariantId}&tab=reviews`}>
				<button type="button" class="{tab === 'reviews' ? 
					"whitespace-nowrap p-3 pr-4 mr-4 border-b-2 font-medium border-lime-600" : 
					"whitespace-nowrap p-3 pr-4 mr-4 text-gray-500 hover:text-gray-700 border-b border-gray-300 hover:border-b-2 hover:border-gray-300"}">
					Customer Reviews
				</button>
			</a>
			<a href={`/product/${product.slug}?variant=${selectedVariantId}&tab=faq`}>
				<button type="button" class="{tab === 'faq' ? 
					"whitespace-nowrap p-3 px-4 mr-4 border-b-2 font-medium border-lime-600" : 
					"whitespace-nowrap p-3 px-4 mr-4 text-gray-500 hover:text-gray-700 border-b border-gray-300 hover:border-b-2 hover:border-gray-300"}">
					FAQ
				</button>
			</a>
		</div>
		{#if tab == 'reviews'}
			<!-- <ProductReviews bind:reviewForm={data.reviewForm} {product} {user} {reviews} /> -->
		{:else if tab == 'faq'}
			<FAQ/>
		{/if}
	</div>
</div>
{/if}