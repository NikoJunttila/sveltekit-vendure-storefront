<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { themeStore, setTheme } from '$lib/stores';
	const theme = $derived($themeStore.theme);
	const resolvedTheme = $derived($themeStore.resolvedTheme);
</script>

{#if theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')}
	<button aria-label="light-theme" onclick={() => setTheme('light')} class="grow-on-hover items-center align-middle">
		<Sun class="h-9 w-9" />
	</button>
{:else}
	<button aria-label="dark-theme" onclick={() => setTheme('dark')} class="grow-on-hover items-center align-middle">
		<Moon class="h-9 w-9" />
	</button>
{/if}
