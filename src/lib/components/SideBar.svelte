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
	import { toast } from 'svelte-sonner';
	import { getContextClient } from '@urql/svelte';
	import { goto } from '$app/navigation';
	import { SignOut } from '$lib/vendure';
	
	const client = getContextClient();
	const handleSignOut = async () => {
		const result = await client.mutation(SignOut, {}).toPromise();
		console.log(result);
		if (result?.data?.logout?.success) {
			cartStore.set(null);
			userStore.set(null);
		}
		toast.success("Logged out")
		goto("/")
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
</script>

{#if $open}
	<button {...$close} class="grow-on-hover items-center align-middle" use:close aria-label="close">
		<X class="h-9 w-9" />
	</button>
{:else}
	<button
		class="grow-on-hover items-center align-middle"
		{...$trigger}
		use:trigger
		aria-label="open"
	>
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
			class="fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-primary-700 p-[20px] text-white shadow-lg focus:outline-none"
			transition:fly={{ x: '-100%', duration: 300, opacity: 1 }}
		>
			<div class="items-middle mb-6 flex">
				<div class="mr-auto mt-3">
					<a href="/" aria-label={m.home()}>
						<img class="block h-11 w-auto" src="/logo.png" alt="SnoreRx Logo" />
					</a>
				</div>
				<button {...$close} use:close aria-label={m.cancel()}>
					<X class="h-9 w-9" />
				</button>
			</div>
			<div class="my-8 flex flex-col space-y-12 pb-6">
				<div class="flex flex-col">
					{#each useFragment(Collection, collections) as collection}
						<a
							href="/collection/{collection.slug}"
							class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
							aria-label="View {collection.name} collection"
						>
							<span
								class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
							>
								{collection.name}
							</span>
						</a>
					{/each}
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
							<button type="button" onclick={handleSignOut} class="mr-2 rounded-md px-3 py-2 text-lg font-medium">
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
