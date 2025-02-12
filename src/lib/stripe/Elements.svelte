<script lang="ts">
	import type { Appearance, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { dev, browser } from '$app/environment';
	import { stripeClient, stripeElements } from '$lib/stripe/stores';

	interface Props {
		publicKey: string;
		elementsOptions?: StripeElementsOptions | undefined;
		children?: import('svelte').Snippet<[any]>;
	}

	let { publicKey, elementsOptions = undefined, children }: Props = $props();

	let mounted = $state(false);

	// @ts-ignore
	onMount(async () => {
		if (!publicKey) {
			if (dev) console.error('No public key provided');
			return;
		}

		if (browser) {
			try {
				const client: Stripe | null = await loadStripe(publicKey);
				// @ts-ignore
				let elements = client?.elements(elementsOptions);
				stripeClient.set(client);
				stripeElements.set(elements);
			} catch (e) {
				if (dev) console.error(e);
			}
			mounted = true;
		}

		return () => {
			mounted = false;
		};
	});
</script>

{#if mounted}
	{@render children?.({ elements: $stripeElements, stripe: $stripeClient })}
{/if}
