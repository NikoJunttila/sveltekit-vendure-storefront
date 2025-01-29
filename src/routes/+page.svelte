<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Meta from '$src/lib/components/Meta.svelte';
	import Hero from '$src/lib/components/hero.svelte';
	import {
		PUBLIC_SITE_NAME,
		PUBLIC_SITE_URL,
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

<Hero />

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
<!--ABOUT US -->
<section class="relative max-w-screen-xl mx-auto rounded-lg p-4 my-8 md:my-16 overflow-hidden">
  <!-- Animated background elements -->
  <div class="absolute inset-0 -z-10 animate-gradient opacity-25">
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></div>
  </div>

  <!-- Floating blobs -->
  <div class="absolute -top-20 -left-20 w-64 h-64 bg-orange-300/20 rounded-full blur-2xl animate-float"></div>
  <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-300/20 rounded-full blur-2xl animate-float-delayed"></div>

  <!-- Content container -->
  <div class=" rounded-lg p-6 md:p-12 border-t-4 border-x-2 border-orange-400 relative backdrop-blur-sm  bg-grid">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-6">{m.about_us_title()}</h2>
      <p class="text-gray-600 dark:text-gray-100 text-2xl font-semibold  mb-8 leading-relaxed">
        {m.about_us_description()}
      </p>
      <a 
        href="/info/about/" 
        class="inline-block bg-orange-400 text-white px-8 py-3 rounded-lg 
               font-medium hover:bg-orange-500 transition-colors duration-300
               focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        aria-label="{m.learn_more_about_company()}"
      >
        {m.learn_more()}
      </a>
    </div>
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
    @keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

.animate-gradient {
  animation: gradient 12s ease infinite;
  background-size: 200% 200%;
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 8s ease-in-out infinite 2s;
}

.bg-grid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23e5e7eb'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>