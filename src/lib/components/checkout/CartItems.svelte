<script lang="ts">
    import { formatCurrency } from '$lib/utils';
    import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
    import Image from '$lib/components/Image.svelte';
    import * as m from '$lib/paraglide/messages';

    export let order: any;
    export let adjustOrderLine: (orderLineId: string, e: Event) => Promise<void>;
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
                            </div>
                            <div class="flex items-center space-x-4">
                                <label for="quantity" class="text-sm text-gray-600"
                                    >{m.quantity({ count: line.quantity })}</label
                                >
                                <select
                                    name="quantity"
                                    class="rounded-md text-black border-gray-300 text-sm shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm"
                                    onchange={async (e) => adjustOrderLine(line.id, e)}
                                >
                                    {#each Array.from({ length: 20 }, (_, i) => i + 1) as qty}
                                        <option
                                            value={qty}
                                            selected={qty === line.quantity}
                                            class="text-sm text-black"
                                        >
                                            {qty}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                </li>
            {/each}
        {/if}
    </ul>
</section>
