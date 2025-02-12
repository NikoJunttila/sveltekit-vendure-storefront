<script lang="ts">
	import House from 'lucide-svelte/icons/house';
	interface Props {
		breadcrumbs: any[];
	}

	let { breadcrumbs }: Props = $props();
</script>

<div class="flex items-center">
	{#each breadcrumbs as breadcrumb}
		{#if breadcrumb.slug === '__root_collection__'}
			<a
				class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
				href="/categories"
			>
				<span
					class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
				>
					<House />
				</span></a
			>
		{:else}
			<span class="before:mr-2 before:content-['/']"></span>
			<a
				href={`/collection/${breadcrumb.slug}`}
				class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
			>
				<span
					class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
				>
					{breadcrumb.name}
				</span>
			</a>
		{/if}
	{/each}
</div>
