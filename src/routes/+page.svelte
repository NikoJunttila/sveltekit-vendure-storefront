<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Meta from '$src/lib/components/Meta.svelte';
	import Hero from '$src/lib/components/hero.svelte';
	import ScrollingBanner from '$src/lib/components/ScrollingBanner.svelte';
	import { PUBLIC_SITE_NAME, PUBLIC_SITE_URL, PUBLIC_SITE_IMAGE } from '$env/static/public';
	import JsonLd from '$src/lib/components/JsonLd.svelte';
	import HotProducts from '$src/lib/components/HotProducts.svelte';
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

<!-- Collection section. -->
<section class="relative my-5 p-4 md:my-16">
	<h2 class="mb-8 text-center text-2xl">{m.collections_description()}</h2>
	<!-- Floating blobs -->
	<div
		class="animate-float absolute -left-10 top-30 h-64 w-64 rounded-full bg-orange-300/20 blur-2xl"
	></div>
	<div
		class="animate-float-delayed absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-purple-500/20 blur-2xl"
	></div>
	<div
		class="hidden md:block animate-float-delayed absolute -bottom-24 right-[50%] h-64 w-64 rounded-full bg-green-300/20 blur-2xl"
	></div>

	<div class="flex flex-wrap items-center justify-center gap-5">
		{#each topLevelCollections as col}
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

<ScrollingBanner></ScrollingBanner>

<HotProducts></HotProducts>

<!--ABOUT US -->
<section class="relative mx-auto my-4 max-w-screen-xl rounded-lg p-4 md:my-16">
	<!-- Floating blobs -->
	<div
		class="animate-float absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-300/20 blur-2xl"
	></div>
	<div
		class="animate-float-delayed absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-300/20 blur-2xl"
	></div>

	<!-- Content container -->
	<div
		class="bg-grid cool cool relative rounded-lg border-x-2 border-t-4 border-orange-400 p-6 backdrop-blur-sm md:p-12"
	>
		<div class="darkbg mx-auto max-w-2xl text-center">
			<p class=" mb-8 text-2xl font-bold leading-relaxed text-white">
				{m.about_us_description()}
			</p>
			<a
				href="/info/about/"
				class="inline-block rounded-lg bg-orange-400 px-8 py-3 font-bold
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
	.darkbg {
		padding: 15px;
		border-radius: 10px;
		background-color: rgba(3, 3, 3, 0.3);
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

	.animate-float {
		animation: float 8s ease-in-out infinite;
	}

	.animate-float-delayed {
		animation: float 8s ease-in-out infinite 2s;
	}
	.cool {
		background-color: rgba(60, 150, 20, 0.1);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23161644' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23055522'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");
	}
</style>
