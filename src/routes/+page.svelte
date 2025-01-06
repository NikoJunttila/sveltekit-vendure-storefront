<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import * as m from '$lib/paraglide/messages.js';
	import { 
		PUBLIC_SITE_NAME, 
		PUBLIC_SITE_URL,
		PUBLIC_SITE_LOGO, 
		PUBLIC_SITE_IMAGE
	} from '$env/static/public'


	const collections = page.data.collections
</script>
<!-- <Hero /> -->
<div class="2xl:mx-auto max-w-screen-2xl p-2 md:p-4 bg-transparent">
	<div class="relative grid grid-cols-1 m-0 w-full">
		<div class="dark:hidden absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent via-transparent to-white h-24 w-full rounded-md"></div>
		<div class="absolute inset-0 dark:bg-black/30 rounded-md"></div>
		<header class="absolute px-6">
			<h1 class="text-gray-900 text-3xl md:text-5xl lg:text-7xl max-w-[600px] leading-11 mt-6 mb-3 md:my-6">
				{m.hero_title()}
			</h1>
			<p class="hidden md:block text-gray-900 max-w-[400px] text-lg mx-1 mt-6">
				{m.hero_description()}
			</p>
			<button type="button" onclick={async () => await goto(`/collection/${collections[1].slug}`)} class="inline-block my-4 py-4 px-10 text-lg font-semibold whitespace-nowrap tracking-wide text-white bg-gradient-to-r from-lime-800 to-lime-700 hover:text-gray-900 rounded-lg transition duration-200">
				{m.shop_now()} →
			</button>
		</header>
		<picture class="m-0 w-full md:h-84 lg:h-96 object-cover overflow-hidden">
			<img src={collections[0].featuredAsset.preview} alt={collections[0].name} />
		</picture>
	</div>
</div>