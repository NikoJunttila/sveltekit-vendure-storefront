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

<div
	class="relative inline-flex items-center rounded-md bg-gray-200 p-0.5 text-xs dark:bg-gray-700"
>
	<button
		class="relative rounded px-2 py-1 font-medium transition-colors duration-200 focus:outline-none"
		class:active-lang={currentLang === 'en'}
		onclick={() => switchToLanguage('en')}
	>
		EN
	</button>
	<button
		class="relative rounded px-2 py-1 font-medium transition-colors duration-200 focus:outline-none"
		class:active-lang={currentLang === 'fi'}
		onclick={() => switchToLanguage('fi')}
	>
		FI
	</button>
	<div
		class="absolute h-[calc(100%-4px)] w-[calc(50%-2px)] rounded bg-white shadow-sm transition-transform duration-200 dark:bg-gray-800"
		class:translate-x-[calc(100%+2px)]={currentLang === 'fi'}
	></div>
</div>

<style>
	.active-lang {
		@apply z-10 text-gray-800 dark:text-white;
	}
	button:not(.active-lang) {
		@apply text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300;
	}
</style>
