<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	let { children } = $props();

	const infoLinks = [
		{ url: '/', name: m.home() },
		{ url: '/info', name: 'Info' },
		{ url: '/info/about', name: m.footer_about() },
		{ url: '/info/guide', name: m.footer_guides() },
		{ url: '/info/contact', name: m.footer_contact() },
		{ url: '/info/terms', name: m.footer_terms() },
		{ url: '/info/privacy', name: m.footer_privacy() },
		{ url: '/info/cookie-policy', name: m.cookie_policy() }
	];

	const isActive = $derived((url: string) => {
		return page.url.pathname === url;
	});
</script>

<header class="border-b border-gray-200">
	<nav class="container mx-auto px-4 py-6">
		<ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:flex md:justify-center md:gap-8">
			{#each infoLinks as link}
				<li class="text-center">
					<a
						href={link.url}
						class="relative py-1 font-medium text-gray-700 transition-colors duration-200 dark:text-gray-200
						{isActive(link.url) ? 'text-blue-600' : 'hover:text-blue-600'}"
						aria-current={isActive(link.url) ? 'page' : undefined}
					>
						{link.name}
						{#if isActive(link.url)}
							<span class="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"></span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<main class="container mx-auto px-4 py-8">
	{@render children?.()}
</main>
