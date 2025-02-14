<script lang="ts">
  import CollectionItem from './MainColItem.svelte';

  interface Props {
    collections: any[];
  }

  let { collections }: Props = $props();
</script>

<div class="flex flex-grow">
  {#each collections as collection (collection.id)}
    <CollectionItem {collection} />
  {/each}
</div>