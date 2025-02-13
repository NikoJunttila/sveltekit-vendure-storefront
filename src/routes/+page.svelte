<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Meta from '$src/lib/components/Meta.svelte';
	import Hero from '$src/lib/components/hero.svelte';
	import {
		PUBLIC_SITE_NAME,
		PUBLIC_SITE_URL,
		PUBLIC_SITE_IMAGE,
		PUBLIC_DEFAULT_CURRENCY
	} from '$env/static/public';
	import JsonLd from '$src/lib/components/JsonLd.svelte';
	import { formatCurrency } from '$lib/utils';
	import { useFragment } from '$lib/gql';
	import { type CollectionFragment, type SearchResultFragment } from '$lib/gql/graphql';
	import { Collection, SearchResult } from '$lib/vendure';
	let { data } = $props();
	let collections: CollectionFragment[] = $state(useFragment(Collection, data.collections || []));
	let topLevelCollections = $derived(collections.filter((col) => col.parent?.name === "__root_collection__"))

	let products: SearchResultFragment[] = $state(useFragment(SearchResult, data.topProducts) || []);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: PUBLIC_SITE_NAME,
		url: PUBLIC_SITE_URL,
		potentialAction: {
			'@type': 'SearchAction',
			target: `${PUBLIC_SITE_URL}/search?q={search_term_string}`,
			'query-input': 'required name=search_term_string'
		}
	};
</script>

<JsonLd schema={JSON.stringify(structuredData)}></JsonLd>
<Meta
	config={{
		title: PUBLIC_SITE_NAME,
		description: m.hero_description(),
		open_graph_image: PUBLIC_SITE_IMAGE || '',
		open_graph_image_alt: PUBLIC_SITE_NAME || '',
		url: PUBLIC_SITE_URL
	}}
/>

<Hero />

<!-- Collection section. -->
<section class="my-5 p-4 md:my-16">
	<h2 class="mb-8 text-center text-2xl">{m.collections_description()}</h2>
	<div class="flex flex-wrap items-center justify-center gap-5">
		{#each topLevelCollections.slice(0, 7) as col}
			<a
				href={`/collection/${col.slug}`}
				class="relative rounded-lg duration-300"
				aria-label={`Browse ${col.name} collection`}
			>
				<div class="aspect-[4/3] h-36 w-36 md:h-72 md:w-72">
					<img
						src={col.featuredAsset?.preview}
						alt={`Preview of the ${col.name} collection`}
						loading="lazy"
						class="h-full w-full rounded-full object-cover transition-transform duration-300 hover:scale-105"
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
<section class="mx-auto my-8 max-w-screen-xl p-4">
	<div class="overflow-hidden rounded-lg bg-orange-400 shadow-sm">
		<div class="group relative py-4">
			<div class="scrolling-text whitespace-nowrap text-lg font-medium text-gray-800">
				{#each { length: 4 } as _}
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
<section class="mx-auto my-8 max-w-screen-2xl p-4">
	<h2 class="mb-8 text-center text-3xl font-bold">{m.hot_products()}</h2>
	<div class="grid grid-cols-2 overflow-hidden rounded-md md:grid-cols-3 lg:grid-cols-4">
		{#each products as product, i}
			<a
				aria-label={`Browse ${product.productName} product`}
				href={`/product/${product.slug}`}
				class="group relative overflow-hidden shadow-md
                       {i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                       {i === 3 ? 'lg:col-span-2' : ''}"
			>
				<div class="aspect-square h-full w-full">
					<img
						loading="lazy"
						src={product.productAsset?.preview}
						alt={product.productName}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						width="600"
						height="600"
					/>
				</div>

				<!-- Overlay content -->
				<div
					class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t
                            from-black/40 to-transparent p-4"
				>
					<h3 class="text-center text-lg font-semibold text-white drop-shadow-lg md:text-xl">
						{product.productName}
					</h3>
					<div
						class="absolute inset-0 flex items-center justify-center bg-black/60
                                p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					>
						<div class="text-center text-xl text-white">
							{#if product.price.__typename === 'PriceRange'}
								{formatCurrency(product.price.min, PUBLIC_DEFAULT_CURRENCY)}
							{:else if product.price.__typename === 'SinglePrice'}
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
<section class="relative mx-auto my-8 max-w-screen-xl overflow-hidden rounded-lg p-4 md:my-16">
	<!-- Animated background elements -->
	<div class="animate-gradient absolute inset-0 -z-10 opacity-25">
		<div class="absolute inset-0 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200"></div>
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"
		></div>
	</div>

	<!-- Floating blobs -->
	<div
		class="animate-float absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-300/20 blur-2xl"
	></div>
	<div
		class="animate-float-delayed absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-300/20 blur-2xl"
	></div>

	<!-- Content container -->
	<div
		class=" bg-grid relative rounded-lg border-x-2 border-t-4 border-orange-400 p-6 backdrop-blur-sm md:p-12"
	>
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="mb-6 text-3xl font-extrabold">{m.about_us_title()}</h2>
			<p class=" mb-8 text-2xl font-extrabold leading-relaxed">
				{m.about_us_description()}
			</p>
			<a
				href="/info/about/"
				class="inline-block rounded-lg bg-orange-400 px-8 py-3 font-medium
               text-black transition-colors duration-300 hover:bg-orange-500
               focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
				aria-label={m.learn_more_about_company()}
			>
				{m.learn_more()}
			</a>
		</div>
	</div>
</section>

<style>
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
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
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-20px) scale(1.05);
		}
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
