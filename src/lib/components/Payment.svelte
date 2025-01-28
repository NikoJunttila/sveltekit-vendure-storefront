<script lang="ts">
	import { PaytrailPayment, PaytrailMultiPayment } from '../vendure';
	import { getContextClient } from '@urql/svelte';
	import Paytrail from './Paytrail.svelte';
	import StripeComponent from './checkout/StripeComponent.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		setOrderState: any;
		setShippingOption: any;
		selectedShippingOption: any;
	}
	let { setOrderState, setShippingOption, selectedShippingOption }: Props = $props();

	let disabled = $state(false);
	let errorMessage = $state('');
	let href = $state('');
	const client = getContextClient();
	
	
	async function getPaytrailMultiHref(): Promise<string> {
		console.error("xdd?")
		try{
			const res = await client
			.mutation(PaytrailMultiPayment, {})
			.toPromise()
			.then((result) => {
				return result
			});
			console.log(res)
			return res?.data?.createMultiPTintent.href || '';
		} catch (err){
			console.log(err)
			return ""
		}
	}

	async function getPaytrailHref(): Promise<string> {
		const paytrailHref = await client
			.mutation(PaytrailPayment, {})
			.toPromise()
			.then((result) => {
				return result.data;
			});
		return paytrailHref?.createPaytrailPaymentIntent.href || '';
	}

	onMount(async () => {
		/* href = await getPaytrailHref(); */
		href = await getPaytrailMultiHref();
	});

	async function sendPayment() {
		errorMessage = '';
		disabled = true;
		try {
			// ensure the method set is what is showing on this page
			// protects against method being changed on another page
			// the final shipping method should be the one on the page submitted
			await setShippingOption(selectedShippingOption);
		} catch (e) {
			console.log(e);
		}
		try {
			await setOrderState('ArrangingPayment');
		} catch (e) {
			console.log(e);
			disabled = false;
			return;
		}
		window.location.href = href;
		disabled = false;
	}
</script>

<div>
	{#if errorMessage}
		<div class="alert alert-danger">{errorMessage}</div>
	{/if}
	<div class="grid columns-2 gap-2">
		{#if href}
			<div>
				<Paytrail {sendPayment} {disabled} text={m.paytrail()} />
			</div>
		{/if}
		<div>
			<StripeComponent></StripeComponent>
		</div>
	</div>
</div>
