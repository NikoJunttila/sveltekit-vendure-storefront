<script lang="ts">
	import { page } from '$app/state'
	import { fly } from 'svelte/transition'
	import * as m from '$lib/paraglide/messages.js'
	import Collection from '$lib/components/Collection.svelte'

	const collections = page.data.collections
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
	<div class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
		<header class="text-center" in:fly={{ y: 20, duration: 1000 }}>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
				{m.our_collections()}
			</h1>
			<p class="mx-auto mt-4 max-w-md text-gray-500 dark:text-gray-400">
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