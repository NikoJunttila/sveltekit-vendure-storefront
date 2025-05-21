<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';

	// --- Type Definitions ---
	interface ConsentPreferencesInternal {
		necessary: boolean;
		analytics: boolean;
		preferences: boolean;
		marketing: boolean;
	}

	interface GtmConsentMode {
		functionality_storage: 'granted' | 'denied';
		security_storage: 'granted' | 'denied';
		ad_storage: 'granted' | 'denied';
		analytics_storage: 'granted' | 'denied';
		personalization_storage: 'granted' | 'denied';
	}

	let showBanner = $state(false);
	// Stores the consent mode as it is structured for GTM (and localStorage)
	let currentGtmConsentMode: GtmConsentMode | null = $state(null);
	let screen = $state<'MAIN' | 'OPTIONS'>('MAIN'); // Explicit type for screen states

	onMount(() => {
		if (browser) {
			const storedConsentJSON = localStorage.getItem('consentMode');
			if (storedConsentJSON) {
				try {
					currentGtmConsentMode = JSON.parse(storedConsentJSON) as GtmConsentMode;
					// Banner remains hidden if consent is already stored and valid
				} catch (error) {
					console.error("Failed to parse consentMode from localStorage:", error);
					localStorage.removeItem('consentMode'); // Clear invalid entry
					showBanner = true; // Show banner if stored consent is invalid
				}
			} else {
				showBanner = true; // Show banner if no consent is stored
			}
		}
	});

	/**
	 * Updates GTM with user's consent preferences and saves them to localStorage.
	 * @param internalPreferences - User's choices with boolean flags.
	 */
	function setConsent(internalPreferences: ConsentPreferencesInternal) {
		// The gtag function is globally available from <svelte:head>

		const newGtmConsentMode: GtmConsentMode = {
			functionality_storage: internalPreferences.necessary ? 'granted' : 'denied',
			security_storage: internalPreferences.necessary ? 'granted' : 'denied',
			ad_storage: internalPreferences.marketing ? 'granted' : 'denied',
			analytics_storage: internalPreferences.analytics ? 'granted' : 'denied',
			personalization_storage: internalPreferences.preferences ? 'granted' : 'denied'
		};

		// @ts-ignore - gtag is on window, but TS might not know this in Svelte script scope without further config
		gtag('consent', 'update', newGtmConsentMode);

		localStorage.setItem('consentMode', JSON.stringify(newGtmConsentMode));
		currentGtmConsentMode = newGtmConsentMode; // Update reactive state
		showBanner = false;
	}

	/**
	 * Handles "Accept All" action.
	 */
	function acceptConsent() {
		setConsent({
			necessary: true,
			analytics: true,
			preferences: true,
			marketing: true
		});
	}

	/**
	 * Handles "Reject All" action.
	 * Necessary cookies are typically kept for site functionality.
	 */
	function rejectConsent() {
		setConsent({
			necessary: true, // Functionality & Security storage will be 'granted'
			analytics: false,
			preferences: false,
			marketing: false
		});
	}

	/**
	 * Handles customized consent submission.
	 * @param e - The form submission event.
	 */
	function customizedConsent(e: SubmitEvent) {
		e.preventDefault();
		const target = e.target as HTMLFormElement;
		const formData = new FormData(target);

		const newInternalPreferences: ConsentPreferencesInternal = {
			// 'necessary_consent' input is now disabled and checked, so always true
			necessary: true,
			marketing: formData.get('marketing_consent') === 'on',
			analytics: formData.get('analytics_consent') === 'on',
			preferences: formData.get('preferences_consent') === 'on'
		};

		setConsent(newInternalPreferences);
	}
</script>

<svelte:head>
	<script>
		// Initialize dataLayer and gtag function globally
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			window.dataLayer.push(arguments);
		}

		// Set GTM default consent state
		// This runs before GTM script loads and before any tags fire.
		try {
			const storedConsent = localStorage.getItem('consentMode');
			if (storedConsent) {
				gtag('consent', 'default', JSON.parse(storedConsent));
			} else {
				gtag('consent', 'default', {
					ad_storage: 'denied',
					analytics_storage: 'denied',
					personalization_storage: 'denied',
					functionality_storage: 'denied', // Or 'granted' if you always need basic functionality before consent
					security_storage: 'denied'       // Or 'granted' similarly
				});
			}
		} catch (e) {
			console.error("Error setting GTM default consent:", e);
			// Fallback to all denied if parsing fails
			gtag('consent', 'default', {
				ad_storage: 'denied',
				analytics_storage: 'denied',
				personalization_storage: 'denied',
				functionality_storage: 'denied',
				security_storage: 'denied'
			});
		}
	</script>

	<script>
		(function (w, d, s, l, i) {
			w[l] = w[l] || [];
			w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
			var f = d.getElementsByTagName(s)[0],
				j = d.createElement(s),
				dl = l != 'dataLayer' ? '&l=' + l : '';
			j.async = true;
			j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
			f.parentNode.insertBefore(j, f);
		})(window, document, 'script', 'dataLayer', 'GTM-KZ5LP7QN'); // <-- REPLACE WITH YOUR ACTUAL GTM CONTAINER ID
	</script>
	</svelte:head>

{#if showBanner}
	<div
		id="cookie-consent-banner"
		class="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-6 pb-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="cookie-consent-title"
		aria-describedby="cookie-consent-description"
	>
		{#if screen === 'MAIN'}
			<div
				class="border-primary dark:border-secondary pointer-events-auto ml-auto max-w-md rounded-xl border-2 bg-gray-50 p-6 shadow-lg ring-1 ring-gray-900/10 dark:bg-gray-950"
			>
				<p id="cookie-consent-title" class="mb-2 text-2xl font-bold leading-tight">
					👨🏻‍🍳 {m.cookie_banner_title()}
				</p>
				<p id="cookie-consent-description" class="text-base text-gray-900 dark:text-gray-50">
					{m.cookie_banner_description()}
					<a href="/info/cookie-policy" class="font-semibold text-indigo-600">
						{m.cookie_policy()}
					</a>.
				</p>
				<div class="mt-4 flex items-center gap-x-5">
					<div class="accept-all-btn-wrapper">
						<button
							type="button"
							class="button bg-secondary !w-24 h-16 relative !mt-0 !px-4 !py-1.5 text-sm font-semibold text-black hover:-translate-y-[7px]"
							onclick={acceptConsent}
						>
							{m.accept_all()}
						</button>
					</div>
					<button
						type="button"
						class="button button-white !w-24 h-16 !mt-0 !px-4 !py-1.5 text-sm font-semibold"
						onclick={rejectConsent}
					>
						{m.reject_all()}
					</button>
					<button
						type="button"
						class="text-sm font-semibold leading-6 text-gray-900 hover:underline dark:text-gray-50"
						onclick={() => (screen = 'OPTIONS')}
					>
						{m.more_options()}
					</button>
				</div>
			</div>
		{:else if screen === 'OPTIONS'}
			<div
				class="border-primary dark:border-secondary pointer-events-auto ml-auto max-w-md rounded-xl border-2 bg-gray-50 p-6 shadow-lg ring-1 ring-gray-900/10 dark:bg-gray-950"
			>
				<p class="mb-2 text-2xl font-bold leading-tight">
					👨🏻‍🍳 {m.customize_cookies_title()}
				</p>
				<form onsubmit={customizedConsent}>
					<fieldset>
						<legend class="sr-only">{m.customize_cookies_title()}</legend>
						<div class="space-y-2">
							<label for="necessary_consent" class="flex items-center justify-between">
								<span class="capitalize">{m.necessary()}</span>
								<input
									type="checkbox"
									name="necessary_consent"
									id="necessary_consent"
									checked
									disabled
								/>
							</label>
							<label for="preferences_consent" class="flex items-center justify-between">
								<span class="capitalize">{m.preferences()}</span>
								<input
									type="checkbox"
									name="preferences_consent"
									id="preferences_consent"
									checked={currentGtmConsentMode?.personalization_storage === 'granted'}
								/>
							</label>
							<label for="analytics_consent" class="flex items-center justify-between">
								<span class="capitalize">{m.analytics()}</span>
								<input
									type="checkbox"
									name="analytics_consent"
									id="analytics_consent"
									checked={currentGtmConsentMode?.analytics_storage === 'granted'}
								/>
							</label>
							<label for="marketing_consent" class="flex items-center justify-between">
								<span class="capitalize">{m.marketing()}</span>
								<input
									type="checkbox"
									name="marketing_consent"
									id="marketing_consent"
									checked={currentGtmConsentMode?.ad_storage === 'granted'}
								/>
							</label>
						</div>
					</fieldset>
					<div class="mt-4 flex items-center gap-x-5">
						<div class="accept-all-btn-wrapper">
							<button
								type="submit"
								class="button bg-secondary relative !mt-0 !px-4 !py-1.5 text-sm font-semibold text-black hover:-translate-y-[7px]"
							>
								{m.accept_selected()}
							</button>
						</div>
						<button
							type="button"
							class="text-sm font-semibold leading-6 text-gray-900 hover:underline dark:text-gray-50"
							onclick={() => (screen = 'MAIN')}
						>
							{m.back_to_main_options()}
						</button>
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
			/* border: 1px solid transparent; /* Base border for transition or consistent spacing */
		}
	}

	:is(.dark .accept-all-btn-wrapper)::before {
		border: 1px solid gray; /* Consider your theme's secondary color here */
	}

	.accept-all-btn-wrapper > .button {
		position: relative;
		z-index: 1;
		background: green; /* Example - ensure this aligns with your theme variables if possible */
		color: black !important; /* Try to avoid !important if possible by increasing specificity or adjusting base button styles */

		&:hover {
			transform: translateY(-3px);
		}
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>