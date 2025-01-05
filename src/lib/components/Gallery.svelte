<script lang="ts">
	import { type FragmentType, useFragment } from '$lib/gql'
	import { type AssetFragment } from '$lib/gql/graphql'
	import Image from '$lib/components/Image.svelte'
	import { Asset } from '$lib/vendure'

	interface Props {
		assets?: FragmentType<typeof Asset>[]
		imageTag?: string
		thumbnailTag?: string
	}
	let { assets = [], imageTag = '', thumbnailTag = '' }: Props = $props()

	let fallback = '/img/noimg.png'

	let images = $derived((imageTag)?
		useFragment(Asset, assets).filter((asset) => asset.tags?.some(tag => tag.value === imageTag)) :
		useFragment(Asset, assets))

	let thumbnails = $derived((thumbnailTag)? 
		useFragment(Asset, assets).filter((asset) => asset.tags?.some(tag => tag.value === thumbnailTag)) : 
		images)

	let selectedImage: AssetFragment|undefined = $state()
	$effect(() => {
		// go to first image when assets change
		selectedImage = images[0]
	})
	function selectImage(index: number) {
		selectedImage = images[index]
	}

</script>
<div class="grid grid-cols-1 w-full">
	<!-- Image display -->
	<div class="mx-auto">
		<Image preview={(selectedImage)? selectedImage.preview : fallback} preset="large" alt="selected image" class="max-h-[50vh] w-full object-cover rounded-md sm:rounded-lg overflow-hidden" />
	</div>
	<!-- Image selector -->
	<div class="w-full mx-auto mt-6 max-w-2xl lg:max-w-none">
		<div class="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
			{#each thumbnails as thumbnail, i}
				{#if (images[i] == selectedImage)}
					<button type="button" class="relative flex h-auto cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 focus:outline-none border-2 border-[#95805e]" aria-controls="tabs-1-panel-1" role="tab">
						<Image preview={thumbnail.preview} preset="thumb" alt={thumbnail.customFields?.alt || ''} class="h-full w-auto px-3 rounded-md object-contain" />
					</button>
				{:else}
					<button type="button" onclick={() => { selectImage(i) }} class="relative flex h-auto cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 focus:outline-none border-2 border-gray-200" aria-controls="tabs-1-panel-1" role="tab">
						<Image preview={thumbnail.preview} preset="thumb" alt={thumbnail.customFields?.alt || ''} class="h-full w-auto px-3 rounded-md object-contain" />	
					</button>
				{/if}
			{/each}
		</div>
	</div>
</div>