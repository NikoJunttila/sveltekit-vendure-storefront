<script lang="ts">
	import { cartStore } from '$lib/stores'
	import { useFragment } from '$lib/gql'
	import { ActiveOrder } from '$lib/majel'
	import { formatCurrency } from '$lib/utils'
	import Image from '$lib/components/Image.svelte'

	interface Props {
		currency: string;
	}

	let { currency }: Props = $props();

	let order = $derived(useFragment(ActiveOrder, $cartStore))
	let lines = $derived(order?.lines || [])

</script>
{#if order}
<section class="flex-col w-fullp-6 overflow-auto">
	<h2 id="summary-heading" class="sr-only">Order summary</h2>
	<div class="mx-auto max-w-lg">
			<ul role="list" class="flex-auto">
				{#each lines as line}
				<li class="flex space-x-6 py-6 border-b border-gray-200">
					<Image preview={line.featuredAsset?.preview} alt={line.productVariant.name} preset="thumb" class="h-28 w-auto flex-none rounded-md bg-gray-200 object-cover object-center" />
					<div class="flex flex-col justify-between space-y-4 my-auto">
						<div class="space-y-1 text-sm font-medium">
							<h3 class="text-gray-900">{line.productVariant.name}</h3>
							<p class="text-gray-900">facets</p>
							<p class="text-gray-500">Price: {formatCurrency(line.unitPrice, currency)}</p>
							<p class="text-gray-500">Quantity: {line.quantity}</p>
						</div>
					</div>
				</li>
				{/each}
			</ul>
			

			<dl class="py-6 space-y-6 text-sm font-medium text-gray-500">
				<div class="flex justify-between">
					<dt>Subtotal</dt>
					<dd class="text-gray-900">{formatCurrency(order.subTotal, currency)}</dd>
				</div>
				{#if order.discounts.length > 0}
					{#each order.discounts as discount}
						<div class="flex justify-between">
							<dt class="flex">
								Discount
								<span class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">{discount.description}</span>
							</dt>
							<dd class="text-gray-900">{formatCurrency(discount.amountWithTax, currency)}</dd>
						</div>
					{/each}
				{/if}
				{#if order.taxSummary.length > 0}
					{#each order.taxSummary as tax}
						{#if tax.taxTotal > 0}
							<div class="flex justify-between">
								<dt>{tax.description}</dt>
								<dd class="text-gray-900">{formatCurrency(tax.taxTotal, currency)}</dd>
							</div>
						{/if}
					{/each}
				{/if}
				{#if order.shippingLines.length > 0}
					{#each order.shippingLines as shippingLine}
						<div class="flex justify-between">
							<dt>{shippingLine.shippingMethod.name}</dt>
							<dd class="text-gray-900">{formatCurrency(shippingLine.priceWithTax, currency)}</dd>
						</div>
					{/each}
				{/if}
			</dl>
			
			<p class="py-6 flex items-center justify-between border-t border-gray-200 text-sm font-medium text-gray-900">
				<span class="text-base">Total</span>
				<span class="text-base">{formatCurrency(order.totalWithTax, currency)}</span>
			</p>
	</div>
</section>
{/if}