<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import LanguageSwitch from './LanguageSwitch.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	let year = new Date().getFullYear();
	let visible = false;
	import Facebook from './icons/facebook.svelte';
	import Twitter from './icons/twitter.svelte';
	import YouTube from './icons/you-tube.svelte';

	// Show animations after component mounts
	onMount(() => {
		visible = true;
	});
	const resources = [
		{ url: '/', name: 'first' },
		{ url: '/', name: 'first' },
		{ url: '/', name: 'first' }
	];
	const company = [
		{ url: '/', name: 'first' },
		{ url: '/', name: 'first' },
		{ url: '/', name: 'first' }
	];
	const support = [
		{ url: '/', name: 'first' },
		{ url: '/', name: 'first' },
		{ url: '/', name: 'first' }
	];
	const socials = [
		{ icon: Facebook, url: 'https://facebook.com', label: 'Facebook' },
		{ icon: Twitter, url: 'https://instagram.com', label: 'Instagram' },
		{ icon: YouTube, url: 'https://twitter.com', label: 'Twitter' }
		//{ icon: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }
	];
</script>

<footer
	class="mt-6 w-full bg-gradient-to-b from-primary-700 to-[#1a1414] lg:mt-12"
	aria-labelledby="footer-heading"
>
	<hr class="hidden opacity-10 dark:block" />
	<h2 id="footer-heading" class="sr-only">Footer</h2>

	<div class="mx-auto max-w-screen-2xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
		{#if visible}
			<!-- Company Info -->
			<div
				class="grid w-full grid-cols-1 gap-6 md:grid-cols-6 xl:gap-8"
				in:fly={{ y: 50, duration: 500, delay: 200 }}
			>
				<div class="space-y-6 md:col-span-2" in:fade={{ duration: 300, delay: 300 }}>
					<div class="flex flex-col items-center space-y-4 md:items-start">
						<img
							class="h-12 transition-transform duration-300 hover:scale-105"
							src="/logo.png"
							alt="Louisiana Roasting Company"
						/>
						<div class="space-y-2 text-center text-lg md:text-left">
							<p class="font-bold text-gray-900 dark:text-white">Louisiana Roasting Company</p>
							<address class="not-italic text-gray-600 dark:text-gray-300">
								1618 Marshall Street<br />
								Shreveport, LA 71101<br />
								United States
							</address>
						</div>
						<div
							class="h-1 w-20 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
						></div>
						<div class="text-gray-600 dark:text-gray-300">
							<p>
								<span class="font-semibold">{m.footer_phone()}:</span>
								<a href="tel:+16505551234" class="transition-colors hover:text-primary-600"
									>1-650-555-1234</a
								>
							</p>
							<p>
								<span class="font-semibold">{m.footer_email()}:</span>
								<a
									href="mailto:support@example.com"
									class="transition-colors hover:text-primary-600">support@example.com</a
								>
							</p>
						</div>
					</div>
					<!-- Social Media Links -->
					<div class="flex justify-center space-x-4 md:justify-start">
						<a
							href={socials[0].url}
							class="transform text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:text-primary-600"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={socials[0].label}
						>
							<Facebook></Facebook>
						</a>
						<a
							href={socials[1].url}
							class="transform text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:text-primary-600"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={socials[1].label}
						>
							<Twitter></Twitter>
						</a>
						<a
							href={socials[2].url}
							class="transform text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:text-primary-600"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={socials[2].label}
						>
							<YouTube></YouTube>
						</a>
					</div>
				</div>

				<!-- Navigation Links -->
				<div>
					<h3 class="text-center text-lg font-semibold text-gray-900 md:text-left dark:text-white">
						{m.footer_company()}
					</h3>
					<div class="mt-4 flex flex-col space-y-3 text-white">
						{#each company as res}
							<a
								href={res.url}
								class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
							>
								<span
									class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
								>
									{res.name}
								</span>
							</a>
						{/each}
					</div>
				</div>
				<div>
					<h3 class="text-center text-lg font-semibold text-gray-900 md:text-left dark:text-white">
						{m.footer_resources()}
					</h3>
					<div class="mt-4 flex flex-col space-y-3 text-white">
						{#each resources as res}
							<a
								href={res.url}
								class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
							>
								<span
									class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
								>
									{res.name}
								</span>
							</a>
						{/each}
					</div>
				</div>
				<div>
					<h3 class="text-center text-lg font-semibold text-gray-900 md:text-left dark:text-white">
						{m.footer_support()}
					</h3>
					<div class="mt-4 flex flex-col space-y-3 text-white">
						{#each support as res}
							<a
								href={res.url}
								class="group mr-2 px-3 py-3 font-medium transition-all duration-200 ease-in-out"
							>
								<span
									class="bg-gradient-to-r from-lime-600 to-lime-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat py-2 transition-all duration-500 ease-out group-hover:bg-[length:100%_1px]"
								>
									{res.name}
								</span>
							</a>
						{/each}
					</div>
				</div>
			</div>

			<!-- Newsletter Section -->
			<div
				class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700"
				in:fly={{ y: 30, duration: 400, delay: 800 }}
			>
				<div class="mx-auto max-w-md text-center">
					<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						{m.footer_subscribe()}
					</h3>
					<form class="flex gap-2">
						<input
							type="email"
							placeholder={m.footer_email_placeholder()}
							class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
						/>
						<button
							type="submit"
							class="transform rounded-md bg-primary-600 px-6 py-2 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700"
						>
							{m.footer_subscribe_button()}
						</button>
					</form>
				</div>
			</div>

			<!-- Bottom Bar -->
			<div
				class="mt-12 flex w-full flex-col items-center justify-between gap-4 border-t border-gray-200 py-6 sm:flex-row dark:border-gray-700"
				in:fly={{ y: 20, duration: 400, delay: 1000 }}
			>
				<div class="flex items-center gap-4">
					<p class="text-gray-600 dark:text-gray-300">
						&copy; {year} Louisiana Roasting Company, LLC
					</p>
					<LanguageSwitch />
				</div>
				<div class="flex gap-4 text-gray-600 dark:text-gray-300">
					<a href="/" class="transition-colors duration-300 hover:text-primary-600"
						>{m.footer_terms()}</a
					>
					<span>•</span>
					<a href="/" class="transition-colors duration-300 hover:text-primary-600"
						>{m.footer_privacy()}</a
					>
				</div>
			</div>
		{/if}
	</div>
</footer>
