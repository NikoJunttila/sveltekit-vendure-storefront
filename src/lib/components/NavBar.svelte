<script lang="ts">
	import { type FragmentType, useFragment } from '$lib/gql';
	import { Collection } from '$lib/vendure';
	import Cart from '$lib/components/Cart.svelte';
	import Account from '$lib/components/Account.svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import LanguageSwitch from './LanguageSwitch.svelte';
	let { collections = [] } = $props();
	// export let collections: FragmentType<typeof Collection>[] = []
</script>

<nav class="top-0 z-50 max-w-screen-2xl px-2 md:px-4 2xl:mx-auto">
	<div class="mt-3 flex flex-grow items-center justify-between">
		<div class="flex flex-none items-center">
			<a class="inline-block text-3xl font-bold" href="/">
				<img class="block h-11 w-auto md:hidden" src="/logo.png" alt="Company Name" />
				<img class="hidden h-14 w-auto md:block" src="/logo.png" alt="Company Name" />
			</a>
			<div class="mr-auto hidden lg:ml-6 lg:block">
				{#each useFragment(Collection, collections) as collection}
					<a
						href="/collection/{collection.slug}"
						class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
					>
						<span
							class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
						>
							{collection.name}
						</span>
					</a>
				{:else}
					Error: No collections found
				{/each}
			</div>
		</div>
		<div class="ml-4 flex flex-grow items-center justify-between align-middle">
			<SearchBox />
		</div>
		<div class="flex flex-none items-center justify-end align-middle md:ml-2 lg:ml-4">
			<div class="p-2 lg:hidden">
				<SideBar {collections} />
			</div>
			<div class="hidden p-2 md:block">
				<Account />
			</div>
			<div class="p-2">
				<ThemeSwitcher />
			</div>
			<div class="hidden p-2 md:block">
				<LanguageSwitch />
				<!-- <Account /> -->
			</div>
			<div class="pl-2">
				<Cart />
			</div>
		</div>
	</div>
</nav>
