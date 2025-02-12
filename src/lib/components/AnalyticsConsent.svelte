<script lang="ts">
	import { dev, browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';

	let showBanner = $state(false);
	let currentConsentMode: any = $state({}); // get current consent mode in localStorage onMount
	let screen = $state('MAIN'); // MAIN = accept, reject, more options, OPTIONS = toggle options;
	onMount(() => {
		if (browser && !dev) {
			currentConsentMode = localStorage.getItem('consentMode');
			if (!currentConsentMode) showBanner = true;
		}
	});
	/**
	 * This is the function we're going to use to tell Google Tag Manager
	 * the user's consent preferences, and also save their preferences in localStorage
	 * @param consent
	 */
	function setConsent(consent: any) {
		// get up dataLayer and gtag https://developers.google.com/tag- platform/tag-manager/datalayer
		//@ts-ignore
		window.dataLayer = window.dataLayer || [];
		//@ts-ignore
		function gtag() {
			//@ts-ignore
			dataLayer.push(arguments);
		}

		// set the consentMode based on the users response to the consent banner
		const consentMode = {
			functionality_storage: consent.necessary ? 'granted' : 'denied',
			security_storage: consent.necessary ? 'granted' : 'denied',
			ad_storage: consent.marketing ? 'granted' : 'denied',
			analytics_storage: consent.analytics ? 'granted' : 'denied',
			personalization_storage: consent.preferences ? 'granted' : 'denied'
		};

		// update the users consent in Google Tag Manager
		//@ts-ignore
		gtag('consent', 'update', consentMode);

		// save user's preferences to localStorage so they don't have to consent every time they visit our website
		localStorage.setItem('consentMode', JSON.stringify(consentMode));
	}

	/**
	 * This is the function that will run whenever the user clicks Accepts All on our banner
	 */
	function acceptConsent() {
		if (localStorage.getItem('consentMode') === null) {
			setConsent({
				necessary: true,
				analytics: true,
				preferences: true,
				marketing: true
			});
			showBanner = false;
		}
	}

	/**
	 * This is the function that will run whenever the user clicks Rejects All on our banner
	 */
	function rejectConsent() {
		if (localStorage.getItem('consentMode') === null) {
			setConsent({
				necessary: false,
				analytics: false,
				preferences: false,
				marketing: false
			});
			showBanner = false;
		}
	}

	/**
	 * This is the function that will run whenever the user consents to custom options
	 */
	function customizedConsent(e: any) {
		e.preventDefault();
		let newConsent = {};
		const data = new FormData(e.target);
		const consent = {
			necessary: data.get('necessary_consent'),
			marketing: data.get('marketing_consent'),
			analytics: data.get('analytics_consent'),
			preferences: data.get('preferences_consent')
		};

		// fill out the newConsent object based on options the user selected
		Object.entries(consent).forEach(([key, value]) => {
			if (value === 'on') {
				//@ts-ignore
				newConsent[key] = 'granted';
			}
		});

		setConsent(newConsent);
		showBanner = false;
	}
</script>

<svelte:head>
	<!-- disable tracking until consent is given -->
	<script>
		// get up dataLayer and gtag https://developers.google.com/tag- platform/tag-manager/datalayer

		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		// default to no consent
		if (localStorage.getItem('consentMode') === null) {
			gtag('consent', 'default', {
				ad_storage: 'denied',
				analytics_storage: 'denied',
				personalization_storage: 'denied',
				functionality_storage: 'denied',
				security_storage: 'denied'
			});
		} else {
			gtag('consent', 'default', JSON.parse(localStorage.getItem('consentMode')));
		}
	</script>

	<!-- google tag manager script that will load all tags -->
	<script>
		//https://www.googletagmanager.com/gtag/js?id=G-G2QSCNFZPV
		(function (w, d, s, l, i) {
			w[l] = w[l] || [];
			w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
			var f = d.getElementsByTagName(s)[0],
				j = d.createElement(s),
				dl = l != 'dataLayer' ? '&l=' + l : '';
			j.async = true;
			j.src = 'https://www.googletagmanager.com/gtm.js?id=G-G2QSCNFZPV' + i + dl;
			f.parentNode.insertBefore(j, f);
		})(window, document, 'script', 'dataLayer', 'YOUR_GTM_ID');
	</script>
</svelte:head>

<!--  
-- Variables we set above that we'll use now to conditionally display the consent banner

let
  showBanner = false,
  screen = 'MAIN'; // MAIN = accept, reject, more options, OPTIONS = toggle options;
-->
{#if showBanner}
	<div
		id="cookie-consent-banner"
		class="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-6 pb-6"
	>
		{#if screen === 'MAIN'}
			<div
				class="border-primary dark:border-secondary pointer-events-auto ml-auto max-w-md rounded-xl border-2 bg-gray-50 p-6 shadow-lg ring-1 ring-gray-900/10 dark:bg-gray-950"
			>
				<p class="mb-2 text-2xl font-bold leading-tight">👨🏻‍🍳 {m.cookie_banner_title()}</p>
				<p class="text-base text-gray-900 dark:text-gray-50">
					{m.cookie_banner_description()}
					<a href="/info/cookie-policy" class="font-semibold text-indigo-600">
						{m.cookie_policy()}</a
					>.
				</p>
				<div class="mt-4 flex items-center gap-x-5">
					<div class="accept-all-btn-wrapper">
						<button
							type="button"
							class="button bg-secondary relative !mt-0 !px-4 !py-1.5 text-sm font-semibold text-black hover:-translate-y-[7px]"
							onclick={acceptConsent}>{m.accept_all()}</button
						>
					</div>
					<button
						type="button"
						class="button button-white !mt-0 !px-4 !py-1.5 text-sm font-semibold"
						onclick={rejectConsent}>{m.reject_all()}</button
					>
					<button
						type="button"
						class="text-sm font-semibold leading-6 text-gray-900 hover:underline dark:text-gray-50"
						onclick={() => (screen = 'OPTIONS')}>{m.more_options()}</button
					>
				</div>
			</div>
		{:else if screen === 'OPTIONS'}
			<div
				class="border-primary dark:border-secondary pointer-events-auto ml-auto max-w-md rounded-xl border-2 bg-gray-50 p-6 shadow-lg ring-1 ring-gray-900/10 dark:bg-gray-950"
			>
				<p class="mb-2 text-2xl font-bold leading-tight">👨🏻‍🍳 {m.customize_cookies_title()}</p>
				<form action="" onsubmit={customizedConsent}>
					<label for="necessary_consent" class="flex items-center justify-between">
						<p class="capitalize">{m.necessary()}</p>
						<input type="checkbox" name="necessary_consent" id="necessary_consent" checked />
					</label>
					<label for="marketing_consent" class="flex items-center justify-between">
						<p class="capitalize">{m.marketing()}</p>
						<input type="checkbox" name="marketing_consent" id="marketing_consent" checked />
					</label>
					<label for="analytics_consent" class="flex items-center justify-between">
						<p class="capitalize">{m.marketing()}</p>
						<input type="checkbox" name="analytics_consent" id="analytics_consent" checked />
					</label>
					<label for="preferences_consent" class="flex items-center justify-between">
						<p class="capitalize">{m.preferences()}</p>
						<input type="checkbox" name="preferences_consent" id="preferences_consent" checked />
					</label>
					<div class="mt-4 flex items-center gap-x-5">
						<div class="accept-all-btn-wrapper">
							<button
								type="submit"
								class="button bg-secondary relative !mt-0 !px-4 !py-1.5 text-sm font-semibold text-black hover:-translate-y-[7px]"
								>{m.accept_selected()}</button
							>
						</div>
						<button
							type="button"
							class="text-sm font-semibold leading-6 text-gray-900 hover:underline dark:text-gray-50"
							onclick={() => (screen = 'MAIN')}>{m.back_to_main_options()}</button
						>
					</div>
				</form>
			</div>
		{/if}
	</div>
{/if}

<style>
	.accept-all-btn-wrapper {
		display: inline-block;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: transparent;
		}
	}

	:is(.dark .accept-all-btn-wrapper)::before {
		border: 1px solid gray;
	}

	.accept-all-btn-wrapper > .button {
		position: relative;
		z-index: 1;
		background: green;
		color: black !important; /* overwrite .button color */

		&:hover {
			transform: translateY(-3px);
		}
	}
</style>
