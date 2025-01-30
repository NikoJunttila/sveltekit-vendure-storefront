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
	class="flex flex-col sm:flex-row items-center rounded-md p-0.5 text-xs bg-primary-900 text-white"
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

<style>
	.active-lang {
		@apply z-10 text-white bg-primary-500;
	}
	button:not(.active-lang) {
		@apply text-gray-500 hover:text-secondary-600;
	}
</style>
