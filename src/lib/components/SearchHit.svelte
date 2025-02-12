<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	interface Props {
		hit: any;
	}

	let { hit }: Props = $props();
	const dispatch = createEventDispatcher();
</script>

<button
	onclick={() => dispatch('click', `${hit.slug}`)}
	class="cursor-pointer overflow-hidden p-4 text-left hover:bg-stone-100 dark:hover:bg-stone-700"
>
	<h3 class="font-bold">{hit.productName}</h3>
	<p class="line-clamp-4 text-sm">{hit.description}</p>
</button>
