<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Truck from '@lucide/svelte/icons/truck';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Undo2 from '@lucide/svelte/icons/undo-2';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	const items = [
		{ icon: Truck, title: m.value_shipping_title, desc: m.value_shipping_desc },
		{ icon: ShieldCheck, title: m.value_secure_title, desc: m.value_secure_desc },
		{ icon: Undo2, title: m.value_returns_title, desc: m.value_returns_desc },
		{ icon: Sparkles, title: m.value_quality_title, desc: m.value_quality_desc }
	];
</script>

<section class="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
	<div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
		{#each items as item}
			{@const Icon = item.icon}
			<div
				class="flex flex-col items-center rounded-2xl bg-white/70 p-6 text-center shadow-sm ring-1 ring-black/5 backdrop-blur dark:bg-gray-900/60 dark:ring-white/10"
			>
				<div
					class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-300"
				>
					<Icon size={24} />
				</div>
				<h3 class="text-base font-semibold text-gray-900 md:text-lg dark:text-white">
					{item.title()}
				</h3>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
					{item.desc()}
				</p>
			</div>
		{/each}
	</div>
</section>
