<script lang="ts">
    import { formatCurrency } from '$src/lib/utils';
    import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
    import * as m from '$lib/paraglide/messages';

    export let totalWithTax: number;
</script>

<div class="mt-6 flex justify-between text-lg font-medium">
    <span>{m.total()}</span>
    <span>{formatCurrency(totalWithTax, PUBLIC_DEFAULT_CURRENCY)}</span>
</div>
