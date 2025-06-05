<script lang="ts">
	// Import i18n messages and components
	import LanguageSwitch from './LanguageSwitch.svelte';
	import * as m from '$lib/paraglide/messages.js';

	// Import public environment variables from SvelteKit
	import {
		PUBLIC_ORGANIZATION,
		PUBLIC_SITE_ADDRESS,
		PUBLIC_SITE_CITY,
		PUBLIC_SITE_STATE,
		PUBLIC_SITE_ZIP,
		PUBLIC_SITE_PHONE,
		PUBLIC_SITE_EMAIL,
		PUBLIC_FACEBOOK_URL,
		PUBLIC_TWITTER_URL,
		PUBLIC_YOUTUBE_URL
	} from '$env/static/public';

	let year = new Date().getFullYear();

	// Import icon components
	import Facebook from './icons/facebook.svelte';
	import Twitter from './icons/twitter.svelte';
	import YouTube from './icons/you-tube.svelte';

	// Navigation links (if these are internal routes they can remain hardcoded)
	const resources = [
		{ url: '/', name: m.footer_blog() },
		{ url: '/info/guide', name: m.footer_guides() },
		{ url: '/', name: m.footer_newsletter() }
	];
	const company = [
		{ url: '/info/about', name: m.footer_about() },
		{ url: '/', name: m.footer_careers() },
		{ url: '/info/contact', name: m.footer_contact() }
	];
	const support = [
		{ url: '/info/contact', name: m.contact() },
		{ url: '/info/terms', name: m.footer_terms() },
		{ url: '/info/privacy', name: m.footer_privacy() }
	];

	// Social media links now using environment variables
	const socials = [
		{ icon: Facebook, url: PUBLIC_FACEBOOK_URL, label: 'Facebook' },
		{ icon: Twitter, url: PUBLIC_TWITTER_URL, label: 'Twitter' },
		{ icon: YouTube, url: PUBLIC_YOUTUBE_URL, label: 'YouTube' }
	];
</script>

<footer class="mt-3 w-full lg:mt-6" aria-labelledby="footer-heading">
	<h2 id="footer-heading" class="sr-only">Footer</h2>

	<div
		class="mx-auto max-w-screen-2xl border-t-2 border-solid border-black px-4 pt-3 dark:border-white sm:px-6 sm:pt-7 lg:px-8 lg:pt-10"
	>
		<!-- Main Content Grid -->
		<div class="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 xl:gap-12">
			<!-- Company Info -->
			<div class="space-y-6 sm:col-span-2 lg:col-span-2">
				<div class="flex flex-col items-center space-y-4 md:items-start">
					<!-- Use env logo (or fallback to /logo.png if needed) -->
					<img
						class="h-12 transition-transform duration-300 hover:scale-105"
						src="/logo.png"
						alt={PUBLIC_ORGANIZATION}
					/>
					<div class="space-y-2 text-center text-lg md:text-left">
						<p class="font-bold">{PUBLIC_ORGANIZATION}</p>
						<address class="not-italic">
							{PUBLIC_SITE_ADDRESS}<br />
							{PUBLIC_SITE_CITY}, {PUBLIC_SITE_STATE}
							{PUBLIC_SITE_ZIP}<br />
							{m.company_country()}
						</address>
					</div>
					<div class="h-1 w-20 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"></div>
					<div class="">
						<p>
							<span class="font-semibold">{m.footer_phone()}:</span>
							<a
								href={'tel:' + PUBLIC_SITE_PHONE}
								class="block transition-colors hover:text-primary-600 md:inline"
							>
								{PUBLIC_SITE_PHONE}
							</a>
						</p>
						<p>
							<span class="font-semibold">{m.footer_email()}:</span>
							<a
								href={'mailto:' + PUBLIC_SITE_EMAIL}
								class="block transition-colors hover:text-primary-600 md:inline"
							>
								{PUBLIC_SITE_EMAIL}
							</a>
						</p>
					</div>
				</div>

				<!-- Social Media Links -->
				<div class="flex justify-center space-x-5 md:justify-start">
					{#each socials as social}
						<a
							href={social.url}
							class="transform transition-all duration-300 hover:-translate-y-1 hover:text-primary-600"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}
						>
							<svelte:component this={social.icon} />
						</a>
					{/each}
				</div>
			</div>

			<!-- Navigation Links Grid -->
			<div class="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-3 lg:grid-cols-3">
				<div>
					<h3 class="text-center text-xl font-semibold underline underline-offset-8 md:text-left">
						{m.footer_company()}
					</h3>
					<div class="mt-4 flex flex-col space-y-3 text-center md:text-left">
						{#each company as res}
							<a
								href={res.url}
								class="group px-3 py-2 font-medium transition-all duration-200 ease-in-out sm:px-0"
							>
								<span
									class="bg-gradient-to-r from-lime-800 to-lime-900 bg-[length:0%_4px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_4px] dark:from-lime-600 dark:to-lime-600"
								>
									{res.name}
								</span>
							</a>
						{/each}
					</div>
				</div>

				<div>
					<h3 class="text-center text-xl font-semibold underline underline-offset-8 md:text-left">
						{m.footer_resources()}
					</h3>
					<div class="mt-4 flex flex-col space-y-3 text-center md:text-left">
						{#each resources as res}
							<a
								href={res.url}
								class="group px-3 py-2 font-medium transition-all duration-200 ease-in-out sm:px-0"
							>
								<span
									class="bg-gradient-to-r from-lime-800 to-lime-900 bg-[length:0%_4px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_4px] dark:from-lime-600 dark:to-lime-600"
								>
									{res.name}
								</span>
							</a>
						{/each}
					</div>
				</div>

				<div class="col-span-2 sm:col-span-1 lg:col-span-1">
					<h3 class="text-center text-xl font-semibold underline underline-offset-8 md:text-left">
						{m.footer_support()}
					</h3>
					<div class="mt-4 flex flex-col space-y-3 text-center md:text-left">
						{#each support as res}
							<a
								href={res.url}
								class="group px-3 py-2 font-medium transition-all duration-200 ease-in-out sm:px-0"
							>
								<span
									class="bg-gradient-to-r from-lime-800 to-lime-900 bg-[length:0%_4px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_4px] dark:from-lime-600 dark:to-lime-600"
								>
									{res.name}
								</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Newsletter Section -->
		<div class="mt-12 border-t border-gray-200 pt-8">
			<div class="mx-auto max-w-md text-center">
				<h3 class="mb-4 text-lg font-semibold">{m.footer_subscribe()}</h3>
				<form class="flex flex-col gap-4 sm:flex-row sm:items-center">
					<input
						type="email"
						placeholder={m.footer_email_placeholder()}
						class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary-500 sm:flex-1"
					/>
					<button
						type="submit"
						class="transform rounded-md bg-primary-500 px-6 py-2 text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 dark:bg-primary-800 dark:text-white sm:w-auto"
					>
						{m.footer_subscribe_button()}
					</button>
				</form>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div
			class="mt-12 flex w-full flex-col items-center justify-between gap-4 border-t border-gray-200 py-6 sm:flex-row"
		>
			<div class="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
				<p class="text-center sm:text-left">
					&copy; {year}
					{PUBLIC_ORGANIZATION}
				</p>
				<div class="bg-accent-500 p-1 rounded-md">
					
					<LanguageSwitch />
				</div>
			</div>
			<div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
				<a href="/info/terms" class="transition-colors duration-300 hover:text-primary-600">
					{m.footer_terms()}
				</a>
				<span class="hidden sm:inline">•</span>
				<a href="/info/privacy" class="transition-colors duration-300 hover:text-primary-600">
					{m.footer_privacy()}
				</a>
			</div>
		</div>
	</div>
</footer>
