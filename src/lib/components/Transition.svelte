<script>
	// @ts-nocheck
	import { fade } from 'svelte/transition';
	let { key = '', duration = 300, children } = $props();
</script>

{#key key}
	<div in:fade={{ duration, delay: duration }} out:fade={{ duration }}>
		{@render children()}
	</div>
{/key}

<style>
</style>
