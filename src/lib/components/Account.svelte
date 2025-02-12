<script lang="ts">
	import CircleUserRound from 'lucide-svelte/icons/circle-user-round';
	import { createDropdownMenu } from '@melt-ui/svelte';
	import { userStore, cartStore } from '$lib/stores';
	import * as m from '$lib/paraglide/messages.js';

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
		goto('/');
	};

	const me = $derived($userStore);

	const {
		elements: { trigger, menu, item }
	} = createDropdownMenu({
		positioning: { placement: 'bottom-end' },
		arrowSize: 0,
		preventScroll: false
	});
</script>

{#if me}
	<button
		type="button"
		{...$trigger}
		use:trigger
		aria-label={m.account_menu()}
		class="grow-on-hover items-center align-middle"
	>
		<span class="sr-only">{m.view_account()}</span>
		<CircleUserRound class="h-9 w-9" />
	</button>
{:else}
	<a href="/account">
		<button type="button" class="grow-on-hover items-center align-middle">
			<span class="sr-only">{m.account_sign_in()}</span>
			<CircleUserRound class="h-9 w-9" />
		</button>
	</a>
{/if}
<div {...$menu} use:menu class="menu bg-white dark:bg-stone-400">
	<div {...$item} use:item class="item">
		<a href="/user">{m.your_profile()}</a>
	</div>
	<div {...$item} use:item class="item">
		<button type="button" onclick={handleSignOut}>{m.sign_out()}</button>
	</div>
</div>

<style lang="postcss">
	.menu {
		@apply z-50 flex flex-col shadow-lg;
		@apply rounded-lg p-1 shadow-neutral-900/30;
		@apply ring-0 !important;
	}
	.item {
		@apply relative h-6 min-h-[24px] select-none rounded-md px-8 py-6;
		@apply z-20 text-gray-900 outline-none;
		@apply data-[highlighted]:bg-stone-200 data-[highlighted]:text-purple-900;
		@apply data-[disabled]:text-neutral-300;
		@apply flex items-center text-sm leading-none;
		@apply ring-0 !important;
	}
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
		@apply text-purple-900 transition-colors hover:bg-white/90;
		@apply data-[highlighted]:ring-purple-400 data-[highlighted]:ring-offset-2 !important;
		@apply p-0 text-sm font-medium focus:ring data-[highlighted]:outline-none;
	}
</style>
