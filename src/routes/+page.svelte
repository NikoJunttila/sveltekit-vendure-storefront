<script lang="ts">
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import Meta from '$src/lib/components/Meta.svelte';
	import {
		PUBLIC_SITE_NAME,
		PUBLIC_SITE_URL,
		PUBLIC_SITE_LOGO,
		PUBLIC_SITE_IMAGE,
		PUBLIC_SITE_SHORT_NAME,
		PUBLIC_SITE_DESCRIPTION,
		PUBLIC_DEFAULT_CURRENCY
	} from '$env/static/public';
	import JsonLd from '$src/lib/components/JsonLd.svelte';
	import { formatCurrency } from '$lib/utils';
	import { useFragment } from '$lib/gql';
	import {
		type CollectionFragment,
		type SearchResultFragment,
	} from '$lib/gql/graphql';
	import {
		Collection,
		SearchResult
	} from '$lib/vendure';
	let { data } = $props();
	let collections: CollectionFragment[] = $state(
		useFragment(Collection, data.collections || [])
	);
	let products: SearchResultFragment[] = $state(
		useFragment(SearchResult, data.topProducts) || []
	);

	const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": PUBLIC_SITE_NAME,
    "url": PUBLIC_SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${PUBLIC_SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
</script>

<JsonLd schema={JSON.stringify(structuredData)}></JsonLd>
<Meta
config={{
  title: PUBLIC_SITE_SHORT_NAME,
  description: PUBLIC_SITE_DESCRIPTION,
  open_graph_image:PUBLIC_SITE_IMAGE || '',
  open_graph_image_alt: PUBLIC_SITE_SHORT_NAME || '',
  url:PUBLIC_SITE_URL,
}}/>

<!-- <Hero /> -->
<section class="max-w-screen-2xl bg-transparent p-2 md:p-4 2xl:mx-auto">
	<main class="relative m-0 grid w-full grid-cols-1 rounded-md">
		<div
			class="absolute inset-x-0 bottom-0 h-24 w-full rounded-md bg-gradient-to-b from-transparent via-transparent to-white"
		></div>
		<div class="absolute inset-0 rounded-md "></div>
		<header class="absolute px-6">
			<h1
				class="leading-11 mb-3 mt-6 max-w-[600px] text-3xl text-gray-900 md:my-6 md:text-5xl lg:text-7xl"
			>
				{PUBLIC_SITE_SHORT_NAME}
			</h1>
			<h2 class="mx-1 mt-6 hidden max-w-[400px] text-lg text-gray-900 md:block">
				{PUBLIC_SITE_DESCRIPTION}
			</h2>
			<button
				type="button"
				onclick={async () => await goto(`/categories`)}
				class="my-4 inline-block whitespace-nowrap rounded-lg bg-gradient-to-r from-lime-800 to-lime-700 px-10 py-4 text-lg font-semibold tracking-wide text-white transition duration-200 hover:text-gray-900"
			>
				{m.shop_now()} →
			</button>
		</header>
		<figure class="md:h-84 m-0 w-full overflow-hidden object-cover lg:h-96">
			<img 
			  src={collections[0].featuredAsset?.preview} 
			  alt={`${PUBLIC_SITE_NAME}`} 
			  loading="lazy"  
			  width="1200"  
			  height="630"
			/>
			<figcaption class="sr-only">{collections[0].description}</figcaption>
		  </figure>
	</main>
</section>


<!-- Collection section. -->
<section class="p-4 my-5 md:my-16">
	<h2 class="text-xl mb-8 text-center">{m.collections_description()}</h2>
	<div class="flex flex-wrap gap-5 items-center justify-center">
	  {#each collections.slice(0, 7) as col}
		<a 
		  href={`/collection/${col.slug}`}
		  class="relative rounded-lg duration-300"
		  aria-label={`Browse ${col.name} collection`}
		>
		  <div class="aspect-[4/3] w-36 h-36  md:w-72 md:h-72">
			<img 
			  src={col.featuredAsset?.preview} 
			  alt={col.name}
			  loading="lazy"
			  class="w-full h-full rounded-full object-cover transition-transform duration-300 hover:scale-105"
			    width="300"
  				height="300"
			/>
		  </div>
			<h2 class="text-center text-xl">
			  {col.name}
			</h2>
		</a>
	  {/each}
	</div>
  </section>

<!-- Scrolling banner text -->
<section class="max-w-screen-xl mx-auto p-4 my-8">
    <div class="overflow-hidden bg-orange-400 rounded-lg shadow-sm">
        <div class="py-4 relative group">
            <div class="scrolling-text whitespace-nowrap text-lg font-medium text-gray-800">
				{#each Array(4) as _}
				<span class="inline-block pr-8">
					<!-- PLACE HOLDER. FETCH REAL DATA LATER-->
				  {m.banner_text()}
				</span>
			  {/each}
            </div>
        </div>
    </div>
</section>

<!-- Hot products section - Mosaic grid -->
<section class="max-w-screen-2xl mx-auto p-4 my-8 ">
    <h2 class="text-3xl font-bold text-center mb-8">{m.hot_products()}</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-md overflow-hidden">
        {#each products as product, i}
            <a 
				aria-label={`Browse ${product.productName} product`}
                href={`/product/${product.slug}`}
                class="group relative overflow-hidden shadow-md
                       {i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                       {i === 3 ? 'lg:col-span-2' : ''}"
            >
                <div class="aspect-square w-full h-full">
                    <img 
						loading="lazy"
                        src={product.productAsset?.preview} 
                        alt={product.productName}
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
						width="600"
  						height="600"
                    />
                </div>
                
                <!-- Overlay content -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent p-4
                            flex flex-col justify-end">
                    <h3 class="text-white font-semibold text-center text-lg md:text-xl drop-shadow-lg">
                        {product.productName}
                    </h3>
                    <div class="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300
                                flex items-center justify-center group-hover:opacity-100 p-4">
                        <div class="text-center text-white text-xl">
							{#if product.price.__typename === "PriceRange"}
							{formatCurrency(product.price.min, PUBLIC_DEFAULT_CURRENCY)}
							{:else if product.price.__typename === "SinglePrice"}
							{formatCurrency(product.price.value, PUBLIC_DEFAULT_CURRENCY)}
							{/if}
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</section>


<style>
    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .scrolling-text {
        animation: scroll 20s linear infinite;
        display: inline-block;
        min-width: max-content;
    }
    /* Pause on hover */
    .group:hover .scrolling-text {
        animation-play-state: paused;
    }
    /* Respect reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        .scrolling-text {
            animation: none;
            white-space: normal;
        }
    }
    /* Custom grid sizing for mosaic effect */
    @media (min-width: 768px) {
        .grid {
            grid-auto-rows: minmax(200px, auto);
        }
        .md\:col-span-2 {
            grid-column: span 2;
        }
        .md\:row-span-2 {
            grid-row: span 2;
        }
    }
</style>