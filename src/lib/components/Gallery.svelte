<script lang="ts">
	import { type FragmentType, useFragment } from '$lib/gql';
	import { type AssetFragment } from '$lib/gql/graphql';
	import Image from '$lib/components/Image.svelte';
	import { Asset } from '$lib/vendure';

	interface Props {
		assets?: FragmentType<typeof Asset>[];
		imageTag?: string;
		thumbnailTag?: string;
	}
	let { assets = [], imageTag = '', thumbnailTag = '' }: Props = $props();

	let fallback = '/img/noimg.png';

	let images = $derived(
		imageTag
			? useFragment(Asset, assets).filter((asset) =>
					asset.tags?.some((tag) => tag.value === imageTag)
				)
			: useFragment(Asset, assets)
	);

	let thumbnails = $derived(
		thumbnailTag
			? useFragment(Asset, assets).filter((asset) =>
					asset.tags?.some((tag) => tag.value === thumbnailTag)
				)
			: images
	);

	let selectedImage: AssetFragment | undefined = $state();
	$effect(() => {
		// go to first image when assets change
		selectedImage = images[0];
	});
	function selectImage(index: number) {
		selectedImage = images[index];
	}
</script>

<div class="grid w-full grid-cols-1">
	<!-- Image display -->
	<div class="mx-auto">
		<Image
			preview={selectedImage ? selectedImage.preview : fallback}
			preset="large"
			alt="selected image"
			class="max-h-[50vh] w-full overflow-hidden rounded-md object-cover sm:rounded-lg"
		/>
	</div>
	<!-- Image selector -->
	<div class="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
		<div class="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
			{#each thumbnails as thumbnail, i}
				{#if images[i] == selectedImage}
					<button
						type="button"
						class="relative flex h-auto cursor-pointer items-center justify-center rounded-md border-2 border-[#95805e] bg-white text-sm font-medium uppercase text-gray-900 focus:outline-none"
						aria-controls="tabs-1-panel-1"
						role="tab"
					>
						<Image
							preview={thumbnail.preview}
							preset="thumb"
							alt={`${thumbnail.name} image`}
							class="h-full w-auto rounded-md object-contain px-3"
						/>
					</button>
				{:else}
					<button
						type="button"
						onclick={() => {
							selectImage(i);
						}}
						class="relative flex h-auto cursor-pointer items-center justify-center rounded-md border-2 border-gray-200 bg-white text-sm font-medium uppercase text-gray-900 focus:outline-none"
						aria-controls="tabs-1-panel-1"
						role="tab"
					>
						<Image
							preview={thumbnail.preview}
							preset="thumb"
							alt={`${thumbnail.name} image`}
							class="h-full w-auto rounded-md object-contain px-3"
						/>
					</button>
				{/if}
			{/each}
		</div>
	</div>
</div>
