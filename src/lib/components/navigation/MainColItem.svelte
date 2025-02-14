<script lang="ts">

	import { Plus, Minus, MoveRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	// Import the same component to allow recursion
	import CollectionItem from './MainColItem.svelte';
	import * as m from '$lib/paraglide/messages';
	interface Props {
		collection: any;
	}

	let { collection }: Props = $props();
</script>

<li>
	<div class="flex p-1 my-1 flex-grow w-[90%] rounded-md bg-primary-400 text-center duration-300 hover:bg-primary-500 dark:bg-primary-700 dark:hover:bg-primary-500">
		<a
			href="/collection/{collection.slug}"
			class="flex flex-grow h-full w-[90%] gap-1 p-4 text-center"
			aria-label={m.menu_view_collection({ collectionName: collection.name })}
		>
			{collection.name}
            <MoveRight></MoveRight>
		</a>
	</div>

	{#if  collection.children && collection.children.length > 0}
		<ul class="ml-4 border-l pl-2 border-accent-200" transition:fade>
			{#each collection.children as child (child.id)}
				<CollectionItem collection={child} />
			{/each}
		</ul>
	{/if}
</li>

<style>
	li {
		list-style-type: none;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
