<script lang="ts">
  //useless file
  import CollectionTree from './CollectionTree.svelte';
  
  interface Props {
    collections: any;
  }

  let { collections }: Props = $props();
</script>

<ul>
  {#each collections as collection}
    <li>
      <a href="/collection/{collection.slug}">{collection.name}</a>
      {#if collection.children && collection.children.length > 0}
        <CollectionTree collections={collection.children} />
      {/if}
    </li>
  {/each}
</ul>
