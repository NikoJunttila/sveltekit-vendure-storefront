<script lang="ts">
	import LanguageSwitch from './LanguageSwitch.svelte';
	import * as m from '$lib/paraglide/messages.js';
	let year = new Date().getFullYear();
	import Facebook from './icons/facebook.svelte';
	import Twitter from './icons/twitter.svelte';
	import YouTube from './icons/you-tube.svelte';
	
	const resources = [
		{ url: '/', name: m.footer_blog() },
		{ url: '/', name: m.footer_guides() },
		{ url: '/', name: m.footer_newsletter() }
	];
	const company = [
		{ url: '/', name: m.footer_about() },
		{ url: '/', name: m.footer_careers() },
		{ url: '/info/contact', name: m.footer_contact() }
	];
	const support = [
		{ url: '/info/contact', name: m.contact() },
		{ url: '/info/terms', name: m.footer_terms() },
		{ url: '/info/privacy', name: m.footer_privacy() }
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
	<hr class="hidden opacity-10" />
	<h2 id="footer-heading" class="sr-only">Footer</h2>

	<div class="mx-auto max-w-screen-2xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
			<!-- Main Content Grid -->
			<div
				class="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 xl:gap-12"
			>
				<!-- Company Info -->
				<div class="space-y-6 sm:col-span-2 lg:col-span-2">
					<div class="flex flex-col items-center space-y-4 md:items-start">
						<img
							class="h-12 transition-transform duration-300 hover:scale-105"
							src="/logo.png"
							alt="Louisiana Roasting Company"
						/>
						<div class="space-y-2 text-center text-lg md:text-left">
							<p class="font-bold text-gray-200">Louisiana Roasting Company</p>
							<address class="not-italic text-gray-300">
								1618 Marshall Street<br />
								Shreveport, LA 71101<br />
								United States
							</address>
						</div>
						<div class="h-1 w-20 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"></div>
						<div class="text-gray-300">
							<p>
								<span class="font-semibold">{m.footer_phone()}:</span>
								<a href="tel:+16505551234" class="block transition-colors hover:text-primary-600 md:inline">
									1-650-555-1234
								</a>
							</p>
							<p>
								<span class="font-semibold">{m.footer_email()}:</span>
								<a
									href="mailto:support@example.com"
									class="block transition-colors hover:text-primary-600 md:inline"
								>
									support@example.com
								</a>
							</p>
						</div>
					</div>
					
					<!-- Social Media Links -->
					<div class="flex justify-center space-x-5 text-gray-300 md:justify-start">
						{#each socials as social}
							<a
								href={social.url}
								class="transform transition-all duration-300 hover:-translate-y-1 hover:text-primary-600"
								target="_blank"
								rel="noopener noreferrer"
								aria-label={social.label}
							>
								<svelte:component this={social.icon}/>
							</a>
						{/each}
					</div>
				</div>

				<!-- Navigation Links Grid -->
				<div class="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-3 lg:grid-cols-3 text-white">
					<div>
						<h3 class="text-center  font-semibold  md:text-left text-xl underline underline-offset-8">
							{m.footer_company()}
						</h3>
						<div class="mt-4 flex flex-col space-y-3 text-center md:text-left">
							{#each company as res}
								<a
									href={res.url}
									class="group px-3 py-2 font-medium transition-all duration-200 ease-in-out sm:px-0"
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
						<h3 class="text-center font-semibold  md:text-left text-xl underline underline-offset-8">
							{m.footer_resources()}
						</h3>
						<div class="mt-4 flex flex-col space-y-3 text-center md:text-left">
							{#each resources as res}
								<a
									href={res.url}
									class="group px-3 py-2 font-medium transition-all duration-200 ease-in-out sm:px-0"
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

					<div class="col-span-2 sm:col-span-1 lg:col-span-1">
						<h3 class="text-center font-semibold  md:text-left text-xl underline underline-offset-8">
							{m.footer_support()}
						</h3>
						<div class="mt-4 flex flex-col space-y-3 text-center md:text-left">
							{#each support as res}
								<a
									href={res.url}
									class="group px-3 py-2 font-medium transition-all duration-200 ease-in-out sm:px-0"
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
			</div>

			<!-- Newsletter Section -->
			<div
				class="mt-12 border-t border-gray-200 pt-8"
			>
				<div class="mx-auto max-w-md text-center">
					<h3 class="mb-4 text-lg font-semibold text-gray-200">{m.footer_subscribe()}</h3>
					<form class="flex flex-col gap-4 sm:flex-row sm:items-center">
						<input
							type="email"
							placeholder={m.footer_email_placeholder()}
							class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary-500 sm:flex-1"
						/>
						<button
							type="submit"
							class="transform rounded-md bg-primary-600 px-6 py-2 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 sm:w-auto"
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
					<p class="text-center text-gray-400 sm:text-left">
						&copy; {year} Louisiana Roasting Company, LLC
					</p>
					<LanguageSwitch />
				</div>
				<div class="flex flex-wrap items-center justify-center gap-3 text-gray-300 sm:gap-4">
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