<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import {
		PUBLIC_SITE_NAME,
		PUBLIC_SITE_URL,
		PUBLIC_SITE_LOGO,
		PUBLIC_SITE_IMAGE
	} from '$env/static/public';

	const collections = page.data.collections;
</script>

<!-- <Hero /> -->
<div class="max-w-screen-2xl bg-transparent p-2 md:p-4 2xl:mx-auto">
	<div class="relative m-0 grid w-full grid-cols-1 rounded-md">
		<div
			class="absolute inset-x-0 bottom-0 h-24 w-full rounded-md bg-gradient-to-b from-transparent via-transparent to-white"
		></div>
		<div class="absolute inset-0 rounded-md "></div>
		<header class="absolute px-6">
			<h1
				class="leading-11 mb-3 mt-6 max-w-[600px] text-3xl text-gray-900 md:my-6 md:text-5xl lg:text-7xl"
			>
				{m.hero_title()}
			</h1>
			<p class="mx-1 mt-6 hidden max-w-[400px] text-lg text-gray-900 md:block">
				{m.hero_description()}
			</p>
			<button
				type="button"
				onclick={async () => await goto(`/categories`)}
				class="my-4 inline-block whitespace-nowrap rounded-lg bg-gradient-to-r from-lime-800 to-lime-700 px-10 py-4 text-lg font-semibold tracking-wide text-white transition duration-200 hover:text-gray-900"
			>
				{m.shop_now()} →
			</button>
		</header>
		<picture class="md:h-84 m-0 w-full overflow-hidden object-cover lg:h-96">
			<img src={collections[0].featuredAsset.preview} alt={collections[0].name} />
		</picture>
	</div>
</div>
