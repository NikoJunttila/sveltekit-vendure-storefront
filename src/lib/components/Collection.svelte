<script lang="ts">
	import { fly } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import Image from '$lib/components/Image.svelte';
	import { type CollectionFragment } from '../gql/graphql';

	interface Props {
		collection: CollectionFragment;
		index: number;
	}

	let { collection, index }: Props = $props();
	let isHovered = $state(false);
</script>

<button
	class="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
	in:fly={{ y: 20, duration: 600, delay: 100 * index }}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<a href="/collection/{collection.slug}">
		<div class="group relative block">
			<Image
				preview={collection.featuredAsset?.preview}
				alt={collection.name}
				preset="large"
				class="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
			/>

			<div
				class="absolute inset-0 bg-black/25 transition-all duration-500 group-hover:bg-black/40"
			></div>

			<div class="absolute inset-0 flex flex-col items-start justify-end p-6">
				<h3 class="text-xl font-medium text-white">{collection.name}</h3>

				<!-- 	<p class="mt-1.5 max-w-[40ch] text-xs text-white text-opacity-90">
					{collection.description}
				</p> -->

				<span
					class="mt-3 inline-block rounded-lg bg-gradient-to-r from-lime-800 to-lime-700 px-5 py-3 text-xs font-medium uppercase tracking-wide text-white transition-colors duration-300 hover:bg-lime-700"
				>
					{m.shop_collection()} →
				</span>
			</div>
		</div>
	</a>
</button>
