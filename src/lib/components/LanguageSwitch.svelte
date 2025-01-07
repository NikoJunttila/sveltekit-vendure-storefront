<script lang="ts">
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}

	$: currentLang = $page.url.pathname.startsWith('/en') ? 'en' : 'fi';
</script>

<div class="relative inline-flex items-center p-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-xs">
	<button
		class="relative px-2 py-1 font-medium transition-colors duration-200 rounded focus:outline-none"
		class:active-lang={currentLang === 'en'}
		onclick={() => switchToLanguage('en')}
	>
		EN
	</button>
	<button
		class="relative px-2 py-1 font-medium transition-colors duration-200 rounded focus:outline-none"
		class:active-lang={currentLang === 'fi'}
		onclick={() => switchToLanguage('fi')}
	>
		FI
	</button>
	<div
		class="absolute h-[calc(100%-4px)] w-[calc(50%-2px)] bg-white dark:bg-gray-800 rounded transition-transform duration-200 shadow-sm"
		class:translate-x-[calc(100%+2px)]={currentLang === 'fi'}
	></div>
</div>

<style>
	.active-lang {
		@apply z-10 text-gray-800 dark:text-white;
	}
	button:not(.active-lang) {
		@apply text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300;
	}
</style>
