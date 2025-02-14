<script lang="ts">
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import Collection from '$lib/components/Collection.svelte';
	import Meta from '$src/lib/components/Meta.svelte';
	const collections = page.data.collections;
	
</script>

<Meta
	config={{
		title: m.shop_collection(),
		description: m.collections_description()
	}}
/>
<div class="min-h-screen">
	<div class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
		<header class="text-center" in:fly={{ y: 20, duration: 1000 }}>
			<h1 class="text-3xl font-bold sm:text-4xl">
				{m.our_collections()}
			</h1>
			<p class="mx-auto mt-4 max-w-md text-gray-500 dark:text-gray-200">
				{m.collections_description()}
			</p>
		</header>

		<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each collections as collection, i}
				<Collection {collection} index={i} />
			{/each}
		</div>
	</div>
</div>
