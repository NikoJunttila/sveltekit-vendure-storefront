<script lang="ts">
	import Image from './Image.svelte';
	interface Props {
		name: string;
		image?: string;
	}

	const bannerSRC =
		'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=2535&auto=format&fit=crop';
	let { name, image = bannerSRC }: Props = $props();
</script>

<section class="relative mb-8 hidden w-full sm:mb-16 sm:block sm:h-80 lg:h-96">
	{#if image}
		<Image
			preview={image}
			preset="large"
			alt={name}
			class="absolute h-full w-full rounded-md object-cover"
		/>
	{/if}
	<div class="absolute inset-0 flex items-center justify-center rounded-md bg-black/30">
		<h1 class="text-2xl font-bold text-white sm:text-4xl">{name}</h1>
	</div>
</section>
