<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Meta from '$src/lib/components/Meta.svelte';
	import Hero from '$src/lib/components/hero.svelte';
	import ValueProps from '$src/lib/components/ValueProps.svelte';
	import HotProducts from '$src/lib/components/HotProducts.svelte';
	import NewsletterCTA from '$src/lib/components/NewsletterCTA.svelte';
	import JsonLd from '$src/lib/components/JsonLd.svelte';
	import { env } from '$env/dynamic/public';
	const {
		PUBLIC_SITE_NAME,
		PUBLIC_SITE_URL,
		PUBLIC_SITE_IMAGE
	} = env;
	let { data } = $props();
	let topLevelCollections = $derived(data.topCollections);

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

<ValueProps />

<!-- Collections -->
<section id="collections" class="mx-auto max-w-screen-xl px-4 py-16 md:py-24">
	<div class="mb-10 text-center">
		<p class="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-300">
			{m.eyebrow_collections()}
		</p>
		<h2 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
			{m.collections_description()}
		</h2>
	</div>

	<div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
		{#each topLevelCollections as col}
			<a
				href={`/collection/${col.slug}`}
				class="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900 dark:ring-white/10"
				aria-label={`Browse ${col.name} collection`}
			>
				<div class="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
					<img
						src={col.featuredAsset?.preview}
						alt={`Preview of the ${col.name} collection`}
						loading="lazy"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						width="400"
						height="400"
					/>
				</div>
				<div
					class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-12"
				>
					<h3 class="text-lg font-semibold text-white drop-shadow-md md:text-xl">
						{col.name}
					</h3>
				</div>
			</a>
		{/each}
	</div>
</section>

<HotProducts />

<NewsletterCTA />

<!-- About -->
<section class="mx-auto my-8 max-w-screen-xl px-4 md:my-16">
	<div
		class="overflow-hidden rounded-2xl border-l-4 border-primary-500 bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12 dark:bg-gray-900 dark:ring-white/10"
	>
		<div class="mx-auto max-w-2xl text-center">
			<p
				class="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-300"
			>
				{m.eyebrow_about()}
			</p>
			<p
				class="mt-3 text-xl font-semibold leading-relaxed text-gray-900 md:text-2xl dark:text-white"
			>
				{m.about_us_description()}
			</p>
			<a
				href="/info/about/"
				class="mt-6 inline-flex items-center rounded-full bg-primary-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-400/40"
				aria-label={m.learn_more_about_company()}
			>
				{m.learn_more()}
			</a>
		</div>
	</div>
</section>
