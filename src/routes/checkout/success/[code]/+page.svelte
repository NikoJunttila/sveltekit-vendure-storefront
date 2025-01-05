<script lang="ts">
	import type { PageData } from './$types'
	import { getContextClient } from '@urql/svelte'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { ActiveOrder, GetOrderByCode, SignOut } from '$lib/vendure'
	import { useFragment } from '$lib/gql'
	import { cartStore, userStore } from '$lib/stores'

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let code = data.code
	let order: any = $state(null)
	let loaded: boolean = $state(false)

	const client = getContextClient()

	const fetchOrder = async () => {
		const orderResult = await client.query(GetOrderByCode, { code }, { requestPolicy: 'network-only' }).toPromise()
		if (orderResult?.data?.orderByCode) order = useFragment(ActiveOrder, orderResult.data.orderByCode)
	}
	let lines = $derived(order?.lines || [])

	const handleSignOut = async () => {
		const result = await client.mutation(SignOut, {}).toPromise()
		console.log(result)
		if (result?.data?.logout?.success) {
			cartStore.set(null)
			userStore.set(null)
		}
	}

	onMount(async () => {
		if (browser) {
			try {
				await fetchOrder()
				// await handleSignOut()
				loaded = true
			} catch (error) {
				console.error(error)
			}
		}
	})
	
</script>
{#if loaded}
{#if order && order.code}
	<main class="lg:flex lg:min-h-full lg:flex-row-reverse lg:max-h-screen lg:overflow-hidden">
		<section class="flex-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-4 lg:pt-0">
			<div class="mx-auto max-w-lg">
				<p>Thank you for your order!</p>
				<p>Your order number is <span class="font-bold text-lime-600">{code}</span></p>
				<p class="mt-6"><a href="/">&larr; Continue Shopping</a></p>
			</div>
		</section>
	</main>
{:else}
	<p>Order not found</p>
{/if}
{/if}