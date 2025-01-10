<script lang="ts">
	import { onNavigate } from '$app/navigation'
	import { createDialog } from '@melt-ui/svelte'
	import Menu from 'lucide-svelte/icons/menu'
	import X from 'lucide-svelte/icons/x'
	import { fade, fly } from 'svelte/transition'
	import { type FragmentType, useFragment } from '$lib/gql'
	import { Collection } from '$lib/vendure'
	import { userStore } from '$lib/stores'
	let { collections }: {
		collections: FragmentType<typeof Collection>[]
	} = $props()
	
	const { 
		elements: { trigger, portalled, overlay, content, close },
		states: { open, } 
	} = createDialog( { preventScroll: false } )
	
	onNavigate(() => {
		open.set(false)
	})
</script>
	{#if $open}
	<button {...$close} class="align-middle items-center grow-on-hover" use:close aria-label="close">
		<X class="w-9 h-9" />
	</button>
	{:else}
	<button class="align-middle items-center grow-on-hover" {...$trigger} use:trigger aria-label="open">
		<Menu class="w-9 h-9" />
	</button>
	{/if}
	<div use:portalled>
		{#if $open}
		<div {...$overlay} use:overlay class="fixed inset-0 z-20 bg-white/50" transition:fade={{ duration: 150 }}></div>
		<div {...$content} use:content class="overflow-auto fixed left-0 top-0 z-50 h-screen w-full bg-black text-white p-[20px] shadow-lg focus:outline-none" transition:fly={{ x: '-100%', duration: 300, opacity: 1, }}>
			<div class="flex items-middle mb-6">
				<div class="mr-auto mt-3">
					<a href="/" aria-label="Home">
						<img class="block h-11 w-auto" src="/logo.png" alt="SnoreRx Logo">
					</a>
				</div>
				<button {...$close} use:close aria-label="Close">
					<X class="w-9 h-9" />
				</button>
			</div>
			<div class="flex flex-col space-y-12 my-8 pb-6">
				<div class="flex flex-col">
					{#each useFragment(Collection, collections) as collection}
					<a 
						href="/collection/{collection.slug}" 
						class="py-3 px-3 mr-2 font-medium group transition-all duration-200 ease-in-out"
						aria-label="View {collection.name} collection"
					>
						<span class="py-2 bg-left-bottom bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-all duration-500 ease-out">
							{collection.name}
						</span>
					</a>
					{/each}
					{#if $userStore}
					<a href="/user" use:close class="py-2 px-3 mr-2 mt-12 rounded-md font-medium text-lg" aria-label="View your profile">
						Your Profile
					</a>
					<form action="/account?/signOut" method="POST">
						<button type="submit" class="py-2 px-3 mr-2 rounded-md font-medium text-lg">Sign Out</button>
					</form>
					{:else}
					<a href="/account" use:close class="py-2 px-3 mr-2 mt-12 rounded-md font-medium text-lg">Sign In</a>
					{/if}
				</div>
			</div>
		</div>
		{/if}
	</div>
	