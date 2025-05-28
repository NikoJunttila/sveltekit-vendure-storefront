<script lang="ts">
	import { formatCurrency } from '$lib/utils';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
	import Image from '$lib/components/Image.svelte';
	import * as m from '$lib/paraglide/messages';
	interface Props {
		order: any;
		adjustOrderLine: (orderLineId: string, e: Event) => Promise<void>;
		removeOrderLine: (orderLineId: string) => Promise<void>; // New prop for removal
	}

	let { order, adjustOrderLine, removeOrderLine }: Props = $props();
</script>
<section class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
	<div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
		<h2 class="text-lg font-semibold text-gray-900">{m.cart_items()}</h2>
	</div>
	<ul class="divide-y divide-gray-200">
		{#if order?.lines}
			{#each order.lines as line}
				<li class="p-6">
					<div class="flex space-x-6">
						<Image
							preview={line.featuredAsset?.preview}
							alt={line.productVariant.name}
							preset="thumb"
							class="h-24 w-24 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-32 sm:w-32"
						/>
						<div class="flex flex-1 flex-col justify-between">
							<div class="space-y-2">
								<h3 class="text-base font-medium text-gray-900">
									{line.productVariant.name}
								</h3>
								<p class="text-sm font-medium text-gray-900">
									{formatCurrency(line.unitPrice, PUBLIC_DEFAULT_CURRENCY)}
								</p>
								{#if line.quantity > 1}
									<p class="text-sm font-medium text-gray-900">
										{m.total()}: {formatCurrency(
											line.unitPrice * line.quantity,
											PUBLIC_DEFAULT_CURRENCY
										)}
									</p>
								{/if}
								
								{#if line.customFields.fillings || line.customFields.extrachoicestring}
									<div class="mt-2 space-y-1 rounded-md bg-gray-50 p-3 text-sm">
										{#if line.customFields.fillings}
											<p class="text-gray-700">
												<span class="font-medium text-gray-900">{m.choices()}</span> {line.customFields.fillings}
											</p>
										{/if}
										{#if line.customFields.extrachoicestring}
											<p class="text-gray-700">
												<span class="font-medium text-gray-900">{m.extras()}</span> {line.customFields.extrachoicestring}
											</p>
										{/if}
									</div>
								{/if}
							</div>
							<div class="mt-4 flex items-center space-x-4">
								<label for="quantity" class="text-sm text-gray-600"
									>{m.quantity({ count: line.quantity })}</label
								>
								<select
									name="quantity"
									class="rounded-md border-gray-300 text-sm text-black shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm"
									onchange={async (e) => adjustOrderLine(line.id, e)}
								>
									{#each { length: 20 } as _, qty}
										<option value={qty + 1} selected={qty + 1 === line.quantity} class="text-sm text-black">
											{qty + 1}
										</option>
									{/each}
								</select>
								<button
									onclick={async () => await removeOrderLine(line.id)}
									aria-label="delete"
									class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
								>
									<span>{m.remove()}</span>
									<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path
											fill-rule="evenodd"
											d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</li>
			{/each}
		{/if}
	</ul>
	{#if order?.subTotal}
		<div class="border-t border-gray-200 p-6">
			<div class="flex justify-between text-lg font-semibold">
				<span>{m.total()}</span>
				<span>
					{formatCurrency(order.subTotal, PUBLIC_DEFAULT_CURRENCY)}
				</span>
			</div>
		</div>
	{/if}
</section>