<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    export let code: string;
</script>

<h1 class="text-2xl font-bold mb-6">{m.order_confirmation()}</h1>
<div class="bg-green-50 p-4 rounded-lg mb-6">
    <p class="text-green-700">{m.thank_you_order()}</p>
    <p class="text-green-700">
        {m.your_order_number()} <span class="font-bold">{code}</span>
    </p>
</div>
