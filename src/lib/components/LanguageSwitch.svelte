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

	// Determine the current language based on the URL.
	const currentLang = page.url.pathname.startsWith('/en') ? 'en' : 'fi';
</script>

<div
	role="tablist"
	class="flex flex-col items-center rounded-md bg-primary-900  text-xs text-white sm:flex-row "
>
	<button
		role="tab"
		aria-selected={currentLang === 'en'}
		class="relative rounded px-4 py-2 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
		class:active-lang={currentLang === 'en'}
		onclick={() => switchToLanguage('en')}
	>
		EN
	</button>
	<button
		role="tab"
		aria-selected={currentLang === 'fi'}
		class="relative rounded px-4 py-2 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
		class:active-lang={currentLang === 'fi'}
		onclick={() => switchToLanguage('fi')}
	>
		FI
	</button>
</div>

<style lang="postcss">
	.active-lang {
		@apply z-10 bg-primary-600 text-white; /* Darker background for the active tab */
	}
	button:not(.active-lang) {
		@apply text-gray-300 hover:text-secondary-500; /* Contrast for inactive tabs */
	}
</style>
