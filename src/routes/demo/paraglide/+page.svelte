<script lang="ts">
	import type { Locale } from '$lib/paraglide/runtime';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';

	function switchToLanguage(newLanguage: Locale) {
		const localisedPath = localizeHref(page.url.pathname, { locale: newLanguage });
		goto(localisedPath);
	}
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => switchToLanguage('en')}>en</button>
	<button onclick={() => switchToLanguage('fi')}>fi</button>
</div>
