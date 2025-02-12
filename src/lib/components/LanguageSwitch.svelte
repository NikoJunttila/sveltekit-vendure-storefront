<script lang="ts">
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route(page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}

	const currentLang = $derived(page.url.pathname.startsWith('/en') ? 'en' : 'fi');
</script>

<div
	class="flex flex-col items-center rounded-md bg-primary-900 p-0.5 text-xs text-white sm:flex-row"
>
	<button
		class="relative rounded px-2 py-1 font-medium transition-colors duration-200 focus:outline-none"
		class:active-lang={currentLang === 'en'}
		onclick={() => switchToLanguage('en')}
	>
		EN
	</button>
	<button
		class="relative w-full rounded px-2 py-1 font-medium transition-colors duration-200 focus:outline-none"
		class:active-lang={currentLang === 'fi'}
		onclick={() => switchToLanguage('fi')}
	>
		FI
	</button>
</div>

<style lang="postcss">
	.active-lang {
		@apply z-10 bg-primary-600 text-white; /* Darker background for better contrast */
	}
	button:not(.active-lang) {
		@apply text-gray-300 hover:text-secondary-500; /* Darker text for better readability */
	}
</style>
