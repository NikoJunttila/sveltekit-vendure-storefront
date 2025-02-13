<script lang="ts">
  import CollectionItem from './CollectionItem.svelte';

  interface Props {
    collections: any[];
  }

  let { collections }: Props = $props();
</script>

<ul>
  {#each collections as collection (collection.id)}
    <CollectionItem {collection} />
  {/each}
</ul>