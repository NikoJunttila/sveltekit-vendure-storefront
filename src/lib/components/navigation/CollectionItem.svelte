<script lang="ts">

	import { Plus, Minus, MoveRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	// Import the same component to allow recursion
	import CollectionItem from './CollectionItem.svelte';
	import * as m from '$lib/paraglide/messages';
	interface Props {
		collection: any;
	}

	let { collection }: Props = $props();
	let expanded = $state(false);

	function toggleExpanded(e:any) {
        e.stopPropagation()
		expanded = !expanded;
	}
</script>

<li>
	<div class="flex justify-between gap-2 py-1 my-1 flex-grow w-[90%] rounded-md bg-primary-600 p-4 text-center duration-300 hover:bg-primary-500">
		<a
			href="/collection/{collection.slug}"
			class="flex flex-grow h-full w-[90%] gap-1 p-4 text-center"
			aria-label={m.menu_view_collection({ collectionName: collection.name })}
		>
			{collection.name}
		</a>
		{#if collection.children && collection.children.length > 0}
			<button onclick={toggleExpanded} aria-label="Toggle collection" class="p-2">
				{#if expanded}
					<Minus />
				{:else}
					<Plus />
				{/if}
			</button>
        {:else}
			<a
			aria-label={m.menu_view_collection({ collectionName: collection.name })}
			href="/collection/{collection.slug}"
            class="p-2 my-auto">
            <MoveRight></MoveRight>
            </a>
		{/if}
	</div>

	{#if expanded && collection.children && collection.children.length > 0}
		<ul class="ml-4 border-l-4 pl-2 border-accent-200" transition:fade>
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
