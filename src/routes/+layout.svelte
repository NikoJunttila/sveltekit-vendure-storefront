<script lang="ts">
	import '../app.css';
	import { queryStore, setContextClient } from '@urql/svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { GetActiveOrder, GetCustomer } from '$lib/vendure';
	import { cartStore, userStore } from '$lib/stores';
	import { i18n } from '$lib/i18n';
	import NavBar from '$src/lib/components/navigation/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Theme from '$src/lib/components/Theme.svelte';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import ToastComponent from '$src/lib/components/Toast.svelte';
	import { onNavigate } from '$app/navigation';
	import AnalyticsConsent from '$src/lib/components/AnalyticsConsent.svelte';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { data, children } = $props();
	const collections = data.collections;
	const client = data.client;
	setContextClient(client);
	const cartQuery = queryStore({
		client,
		query: GetActiveOrder,
		pause: true,
		requestPolicy: 'network-only',
		context: { additionalTypenames: ['ActiveOrder'] }
	});
	const userQuery = queryStore({
		client,
		query: GetCustomer,
		pause: true,
		requestPolicy: 'network-only',
		context: { additionalTypenames: ['ActiveCustomer'] }
	});
	$effect(() => {
		if ($cartQuery.data?.activeOrder) cartStore.set($cartQuery.data.activeOrder);
	});
	$effect(() => {
		if ($userQuery.data?.activeCustomer) userStore.set($userQuery.data.activeCustomer);
	});

	// useful for debugging
	// $inspect() will be removed automatically in production build
	$inspect($cartStore);
	$inspect($userStore);

	const nakedPaths = ['/checkout', '/sitemap.xml'];
	let naked = $derived(nakedPaths.includes(page.url.pathname));

	onMount(async () => {
		if (browser) {
			cartQuery.resume();
			userQuery.resume();
		}
	});
</script>

<ParaglideJS {i18n}>
	{#if naked}
		{@render children?.()}
	{:else}
		<Theme />
		<ToastComponent />
		<NavBar {collections} />
		<div class="bg-gradient min-h-svh overflow-hidden">
			<div class="relative">{@render children?.()}</div>
			<AnalyticsConsent></AnalyticsConsent>
			<Footer />
		</div>
	{/if}
	<!-- <Analytics /> -->
</ParaglideJS>
