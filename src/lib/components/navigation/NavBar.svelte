<script lang="ts">
	import { useFragment } from '$lib/gql';
	import { Collection } from '$lib/vendure';
	import Cart from '$lib/components/Cart.svelte';
	import Account from '$src/lib/components/account/Account.svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import SideBar from '$lib/components/navigation/SideBar.svelte';
	import ThemeSwitcher from '../ThemeSwitcher.svelte';
	import LanguageSwitch from '../LanguageSwitch.svelte';
	import { Heart, Menu, Info } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { PUBLIC_SITE_NAME } from '$env/static/public';
	import { arrayToTree } from '../../utils';
	import MainNavCols from './MainNavCols.svelte';
	import { fade } from 'svelte/transition';
	import { clickOutside } from '../../utils';

	let { collections = [] } = $props();

	let isDropdownOpen = $state(false);

	const moreCollections = arrayToTree(useFragment(Collection, collections));
	function openDropdown() {
		isDropdownOpen = true;
	}
	function closeDropdown() {
		isDropdownOpen = false;
	}
	/* 	ANIMATED NAV BAR. HIDES ON SCROLL DOWN.
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	let y = $state(0);
	let maxScrollY = $state(0);
	let prevY = $state(0);
	const SCROLL_UP_THRESHOLD = 50;
	const TOP_THRESHOLD = 50;

	const navbarVisible = $derived(
		y < TOP_THRESHOLD || (maxScrollY - y) >= SCROLL_UP_THRESHOLD
	);

 	onMount(() => {
		if (browser) {
			const handleScroll = () => {
				const newY = window.scrollY;
				y = newY;
				
				if (newY > maxScrollY) {
					maxScrollY = newY;
				}
				
				if (newY < TOP_THRESHOLD) {
					maxScrollY = 0;
				}
				
				prevY = newY;
			};

			window.addEventListener('scroll', handleScroll);
			handleScroll(); // Initial call to set values
			
			return () => window.removeEventListener('scroll', handleScroll);
		}
			class:visible={navbarVisible} TO NAVBAR ID
	}); */
</script>

<header
	id="navbar"
	class={'navbar sticky top-0 z-40 border-b border-solid border-secondary-800 bg-slate-100 p-2 dark:bg-slate-800 md:px-4 2xl:mx-auto'}
>
	<div class="mt-3 flex flex-grow items-center justify-between">
		<div class="flex flex-none items-center">
			<a class="inline-block text-3xl font-bold duration-300 hover:scale-105" href="/">
				<img class="block h-14 w-auto md:hidden" src="/logo.png" alt={PUBLIC_SITE_NAME} />
				<img class="hidden h-14 w-auto md:block" src="/logo.png" alt={PUBLIC_SITE_NAME} />
			</a>

			<div class="ml-auto hidden lg:ml-6 lg:block">
				<div class="flex items-center gap-x-4">
					<a
						href="/all/1"
						class="group relative px-3 py-2.5 font-medium transition-all duration-300 hover:text-lime-700"
					>
						<span class="relative block overflow-hidden">
							<span class="block transition-transform duration-300 group-hover:-translate-y-6">
								{m.menu_products()}
							</span>
							<span
								class="absolute inset-0 flex h-full w-full translate-y-6 items-center justify-center transition-transform duration-300 group-hover:translate-y-0"
							>
								{m.menu_products()}
							</span>
						</span>
						<span
							class="absolute bottom-0 left-0 h-0.5 w-0 bg-lime-600 transition-all duration-300 group-hover:w-full"
						></span>
					</a>
					<div class="">
						<a
							href="/categories"
							class="group relative px-3 py-2.5 font-medium transition-all duration-300 hover:text-lime-700"
							onmouseover={openDropdown}
							onfocus={openDropdown}
						>
							<span class="relative block overflow-hidden">
								<span class="block transition-transform duration-300 group-hover:-translate-y-6">
									{m.our_collections()}
								</span>
								<span
									class="absolute inset-0 flex h-full w-full translate-y-6 items-center justify-center transition-transform duration-300 group-hover:translate-y-0"
								>
									{m.our_collections()}
								</span>
							</span>
							<span
								class="absolute bottom-0 left-0 h-0.5 w-0 bg-lime-600 transition-all duration-300 group-hover:w-full"
							></span>
						</a>
						{#if isDropdownOpen}
							<div
								use:clickOutside
								onoutsideclick={closeDropdown}
								class="absolute left-2 flex-wrap justify-center items-center z-40 max-w-[95vw] mt-2 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-lg bg-primary-200 p-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 dark:bg-primary-800"
								onmouseleave={closeDropdown}
								role="menu"
								tabindex="-1"
								transition:fade={{duration:300}}
							>
								<MainNavCols collections={moreCollections}></MainNavCols>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="ml-0 flex flex-grow items-center justify-between max-w-[1000px] align-middle sm:ml-4">
			<SearchBox />
		</div>
		<div class="ml-0 flex flex-none items-center justify-end align-middle sm:ml-2 lg:ml-4">
			<div class="p-1 lg:hidden">
				<SideBar {collections} />
			</div>
			<div>
				<a href="/favourites" aria-label="Go to favourites">
					<Heart class="grow-on-hover h-9 w-9 text-red-400" fill="red" />
					<span class="sr-only">Go to favourites</span>
				</a>
			</div>
			<div class="hidden p-2 lg:block">
				<Account />
			</div>
			<div class="hidden p-2 lg:block">
				<a href="/info">
					<button type="button" class="grow-on-hover items-center align-middle">
						<span class="sr-only">Info</span>
						<Info class="h-9 w-9" />
					</button>
				</a>
			</div>
			<div class="p-2">
				<ThemeSwitcher />
			</div>
			<div class="p-2">
				<LanguageSwitch />
				<!-- <Account /> -->
			</div>
			<div class="pl-2">
				<Cart />
			</div>
		</div>
	</div>
</header>

<style>
	header {
		view-transition-name: header;
	}
	/*.navbar {
		transition: transform 0.3s ease;
		transform: translateY(-100%);
	}
	
	.visible {
		transform: translateY(0);
	}*/
</style>
