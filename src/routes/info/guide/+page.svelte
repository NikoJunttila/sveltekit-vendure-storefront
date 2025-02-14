<script lang="ts">
import CollectionTree from "$src/lib/components/navigation/CollectionTree.svelte";
import SidebarCols from "$src/lib/components/navigation/SidebarCols.svelte";
import { arrayToTree } from "$src/lib/utils";
let { data} = $props();
//@ts-ignore
const collections = arrayToTree(data.collections)
</script>
<SidebarCols collections={collections}></SidebarCols>
<!-- <CollectionTree {collections}></CollectionTree> -->
