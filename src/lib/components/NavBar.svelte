<script lang="ts">
	import { useFragment } from '$lib/gql';
	import { Collection } from '$lib/vendure';
	import Cart from '$lib/components/Cart.svelte';
	import Account from '$lib/components/Account.svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import LanguageSwitch from './LanguageSwitch.svelte';
	import { Heart, Menu } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	let { collections = [] } = $props();
	
	let isDropdownOpen = $state(false);
	const maxVisibleCollections = 2;
	
	const processedCollections = $derived(useFragment(Collection, collections));
	const visibleCollections = $derived(processedCollections.slice(0, maxVisibleCollections));
	const moreCollections = $derived(processedCollections.slice(maxVisibleCollections));
	
	function openDropdown() {
		isDropdownOpen = true;
	}
	
	function closeDropdown() {
		isDropdownOpen = false;
	}
</script>

<nav class="top-0 z-50 max-w-screen-2xl p-2 md:px-4 2xl:mx-auto border-b border-solid border-secondary-800">
	<div class="mt-3 flex flex-grow items-center justify-between">
		<div class="flex flex-none items-center">
			<a class="inline-block text-3xl font-bold" href="/">
				<img class="block h-10 w-auto md:hidden" src="/logo.png" alt="Company Name" />
				<img class="hidden h-14 w-auto md:block" src="/logo.png" alt="Company Name" />
			</a>

			<div class="mr-auto hidden lg:ml-6 lg:block">
				<div class="flex items-center gap-x-4">

					<a
					href="/all/1"
					class="group relative px-3 py-2.5 font-medium  transition-all duration-300 hover:text-lime-700 "
				>
					<span class="relative block overflow-hidden">
						<span class="block transition-transform duration-300 group-hover:-translate-y-6">
							{m.menu_products()}
						</span>
						<span class="absolute inset-0 flex h-full w-full translate-y-6 items-center justify-center transition-transform duration-300 group-hover:translate-y-0">
							{m.menu_products()}
						</span>
					</span>
					<span class="absolute bottom-0 left-0 h-0.5 w-0 bg-lime-600 transition-all duration-300 group-hover:w-full "></span>
				</a>

					{#each visibleCollections as collection}
						<a
							href="/collection/{collection.slug}"
							class="group relative px-3 py-2.5 font-medium  transition-all duration-300 hover:text-lime-700 "
						>
							<span class="relative block overflow-hidden">
								<span class="block transition-transform duration-300 group-hover:-translate-y-6">
									{collection.name}
								</span>
								<span class="absolute inset-0 flex h-full w-full translate-y-6 items-center justify-center transition-transform duration-300 group-hover:translate-y-0">
									{collection.name}
								</span>
							</span>
							<span class="absolute bottom-0 left-0 h-0.5 w-0 bg-lime-600 transition-all duration-300 group-hover:w-full "></span>
						</a>
					{/each}
			
					{#if moreCollections.length > 0}
						<div class="relative">
							<!-- svelte-ignore a11y_mouse_events_have_key_events -->
							<button
								onclick={openDropdown}
								onmouseover={openDropdown}
								onkeydown={(e) => e.key === 'Enter' && openDropdown()}
								class="group flex items-center gap-1 px-3 py-2.5 font-medium  transition-colors duration-300 hover:text-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 "
								aria-haspopup="true"
								aria-expanded={isDropdownOpen}
							>
								<span class="sr-only">More collections</span>
								<Menu class="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
							</button>
			
							{#if isDropdownOpen}
								<div
									class="absolute left-0 z-50 mt-2 w-48 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200 "
									onmouseleave={closeDropdown}
									role="menu"
									tabindex="-1"
								>
									{#each moreCollections as collection}
										<a
											href="/collection/{collection.slug}"
											class="block px-4 py-2.5 text-sm text-gray-700 transition-colors duration-200 hover:bg-lime-50 hover:text-lime-800 focus:bg-lime-50 focus:text-lime-800 focus:outline-none "
											role="menuitem"
											tabindex="-1"
										>
											{collection.name}
										</a>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>


		</div>
		<div class="ml-4 flex flex-grow items-center justify-between align-middle">
			<SearchBox />
		</div>
		<div class="flex flex-none items-center justify-end align-middle md:ml-2 lg:ml-4">
			<div class="p-2 lg:hidden">
				<SideBar {collections} />
			</div>
			<div>
				<a href="/favourites">
					<Heart class="text-red-400 w-9 h-9 grow-on-hover" fill="red" />
				</a>
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