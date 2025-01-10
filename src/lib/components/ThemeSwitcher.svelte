<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { themeStore, setTheme } from '$lib/stores';
	$: theme = $themeStore.theme;
	$: resolvedTheme = $themeStore.resolvedTheme;
</script>

{#if theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')}
	<button on:click={() => setTheme('light')} class="grow-on-hover items-center align-middle">
		<Sun class="h-9 w-9" />
	</button>
{:else}
	<button on:click={() => setTheme('dark')} class="grow-on-hover items-center align-middle">
		<Moon class="h-9 w-9" />
	</button>
{/if}
