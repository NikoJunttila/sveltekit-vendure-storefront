<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { createDialog } from '@melt-ui/svelte';
	import Menu from 'lucide-svelte/icons/menu';
	import X from 'lucide-svelte/icons/x';
	import { fade, fly } from 'svelte/transition';
	import { type FragmentType, useFragment } from '$lib/gql';
	import { Collection } from '$lib/vendure';
	import { userStore, cartStore } from '$lib/stores';
	import * as m from '$lib/paraglide/messages';
	import { toast } from '$lib/toast.svelte';
	import { getContextClient } from '@urql/svelte';
	import { goto } from '$app/navigation';
	import { SignOut } from '$lib/vendure';
	import { MoveRight, Plus, Minus } from 'lucide-svelte';
	import SidebarCols from './SidebarCols.svelte';
	import { arrayToTree } from '../../utils';

	const client = getContextClient();
	const handleSignOut = async () => {
		const result = await client.mutation(SignOut, {}).toPromise();
		console.log(result);
		if (result?.data?.logout?.success) {
			cartStore.set(null);
			userStore.set(null);
		}
		toast.success('Logged out');
		goto('/');
	};

	let {
		collections
	}: {
		collections: FragmentType<typeof Collection>[];
	} = $props();

	const {
		elements: { trigger, portalled, overlay, content, close },
		states: { open }
	} = createDialog({ preventScroll: false });

	onNavigate(() => {
		open.set(false);
	});

	let showCollections = $state(true);
	//@ts-ignore
	const treeCols = arrayToTree(collections)
</script>

{#if $open}
	<button {...$close} class="items-center align-middle" use:close aria-label={m.menu_close()}>
		<X class="h-9 w-9" />
	</button>
{:else}
	<button class="items-center align-middle" {...$trigger} use:trigger aria-label={m.menu_open()}>
		<Menu class="h-9 w-9" />
	</button>
{/if}
<div use:portalled>
	{#if $open}
		<div
			{...$overlay}
			use:overlay
			class="fixed inset-0 z-20 bg-white/50"
			transition:fade={{ duration: 150 }}
		></div>
		<div
			{...$content}
			use:content
			class="fixed left-0 top-0 z-50 h-screen w-[80%] overflow-auto bg-primary-400 p-[20px] shadow-lg focus:outline-none dark:bg-primary-800 sm:w-[70%]"
			transition:fly={{ x: '-100%', duration: 300, opacity: 1 }}
		>
			<div class="items-middle mb-6 flex">
				<div class="mr-auto mt-3">
					<a href="/" aria-label={m.home()}>
						<img class="block h-11 w-auto" src="/logo.png" alt="Logo" />
					</a>
				</div>
				<button {...$close} use:close aria-label={m.cancel()}>
					<X class="h-9 w-9" />
				</button>
			</div>
			<div class="h-100% my-8 flex flex-col space-y-12 pb-6 text-xl font-bold">
				<!-- Products section -->
				<div class="">
					<button
						transition:fade={{ duration: 300 }}
						onclick={() => (showCollections = !showCollections)}
						class="group mr-2 flex w-full px-3 py-3 font-medium transition-all duration-200 ease-in-out"
						aria-label={m.menu_toggle_collections()}
					>
						{m.menu_products()}
						<span class="relative ml-auto">
							{#if showCollections}
								<div class="absolute right-1 top-1" in:fly={{ y: -50, duration: 200 }}>
									<Minus />
								</div>
							{:else}
								<div class="absolute right-1 top-1" out:fly={{ y: 50, duration: 200 }}>
									<Plus />
								</div>
							{/if}
						</span>
					</button>
					<!-- Collection section -->
					{#if showCollections}
						<ul class="flex flex-col" in:fade={{ duration: 200 }}>
							<a
								href="/all/1"
								class="flex h-full w-[90%] rounded-md bg-primary-600 p-4 text-center duration-300 hover:bg-primary-500"
								aria-label={m.menu_view_all_products()}
							>
								{m.menu_all_products()}
								<span class="ml-auto"><MoveRight></MoveRight></span>
							</a>

							<SidebarCols collections={treeCols}></SidebarCols>
						</ul>
					{/if}
				</div>

				<!-- Information about us section -->
				<div transition:fade={{ duration: 300, delay: 200 }}>
					<a
						href="/info/about"
						class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
						aria-label={m.menu_about_us_label()}
					>
						<span
							class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
						>
							{m.menu_about_us()}
						</span>
					</a>
				</div>

				<!-- Guide section -->
				<div transition:fade={{ duration: 300, delay: 300 }}>
					<a
						href="/info/guide"
						class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
						aria-label={m.menu_guide_label()}
					>
						<span
							class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
						>
							{m.menu_guide()}
						</span>
					</a>
				</div>

				<!-- Contact us section -->
				<div transition:fade={{ duration: 300, delay: 400 }}>
					<a
						href="/info/contact"
						class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
						aria-label={m.menu_contact_us_label()}
					>
						<span
							class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
						>
							{m.menu_contact_us()}
						</span>
					</a>
				</div>

				<!-- IGNORE BELOW -->
				<div class="mt-auto">
					{#if $userStore}
						<a
							href="/user"
							use:close
							class="mr-2 mt-12 rounded-md px-3 py-2 text-lg font-medium"
							aria-label={m.view_account()}
						>
							{m.your_profile()}
						</a>
						<form>
							<button
								type="button"
								onclick={handleSignOut}
								class="mr-2 rounded-md px-3 py-2 text-lg font-medium"
							>
								{m.sign_out()}
							</button>
						</form>
					{:else}
						<a
							href="/account"
							use:close
							class="mr-2 mt-12 rounded-md px-3 py-2 text-lg font-medium"
						>
							{m.sign_in()}
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
