<script lang="ts">
    import { formatCurrency } from '$src/lib/utils';
    import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
    import * as m from '$lib/paraglide/messages';

    export let line: any;
</script>

<div class="p-4 flex gap-4">
    {#if line.featuredAsset}
        <img
            src={line.featuredAsset.preview}
            alt={line.productVariant.name}
            class="w-20 h-20 object-cover rounded"
        />
    {/if}
    <div class="flex-1">
        <h3 class="font-medium">{line.productVariant.name}</h3>
        <div class="text-sm text-gray-500 mt-1">
            {#each line.productVariant.options as option}
                <span>{option.group.name}: {option.name}</span>
                {#if !option === line.productVariant.options[line.productVariant.options.length - 1]}
                    <span class="mx-2">•</span>
                {/if}
            {/each}
        </div>
        <div class="mt-2 flex justify-between">
            <div class="text-sm">
                {m.quantity({ count: line.quantity })}
            </div>
            <div class="font-medium">
                {formatCurrency(line.linePriceWithTax, PUBLIC_DEFAULT_CURRENCY)}
            </div>
        </div>
    </div>
</div>
