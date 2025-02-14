<script>
	import * as m from '$lib/paraglide/messages.js';
	import Meta from '$src/lib/components/Meta.svelte';
	import {
		PUBLIC_SITE_ADDRESS,
		PUBLIC_SITE_CITY,
		PUBLIC_SITE_STATE,
		PUBLIC_SITE_ZIP,
		PUBLIC_SITE_PHONE,
		PUBLIC_SITE_EMAIL
	} from '$env/static/public';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let isSubmitted = $state(false);

	function handleSubmit() {
		// Add your form submission logic here
		isSubmitted = true;
	}
</script>

<Meta
	config={{
		title: m.contactTitle(),
		description: m.contactTitle()
	}}
/>

<main class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold md:text-4xl">
		{m.contactTitle()}
	</h1>

	<div class="prose prose-gray max-w-none text-black dark:text-white">
		<p class=" mb-6 text-center leading-relaxed">
			{m.contactIntroduction()}
		</p>

		<div class="mb-12 grid gap-8 md:grid-cols-2">
			<div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
				<h2 class="mb-4 text-xl font-semibold text-black dark:text-white">
					{m.contactDetails()}
				</h2>
				<ul class="space-y-2">
					<li class="flex items-center">
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"
							/>
						</svg>
						{PUBLIC_SITE_EMAIL || m.contactEmail()}
					</li>
					<li class="flex items-center">
						<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
							/>
						</svg>
						{PUBLIC_SITE_PHONE || m.contactPhone()}
					</li>
					<li class="flex items-start">
						<svg class="mr-2 mt-1 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
							/>
						</svg>
						<span>
							<address class="not-italic">
								{PUBLIC_SITE_ADDRESS}<br />
								{PUBLIC_SITE_CITY}, {PUBLIC_SITE_STATE}
								{PUBLIC_SITE_ZIP}<br />
								{m.company_country()}
							</address>
						</span>
					</li>
				</ul>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
				<h2 class="mb-4 text-xl font-semibold text-black dark:text-white">
					{m.businessHours()}
				</h2>
				<ul class="space-y-2">
					<li class="">{m.hoursWeekdays()}</li>
					<li class="">{m.hoursWeekends()}</li>
					<li class="">{m.hoursHolidays()}</li>
				</ul>
			</div>
		</div>

		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-semibold text-black dark:text-white">
				{m.contactFormHeading()}
			</h2>

			<form onsubmit={handleSubmit} class="space-y-6">
				{#if isSubmitted}
					<div class="rounded-lg bg-green-50 p-4 text-green-700">
						{m.contactSuccessMessage()}
					</div>
				{:else}
					<div>
						<label class="mb-2 block" for="name">
							{m.nameLabel()}
						</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							class="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							required
							placeholder={m.namePlaceholder()}
						/>
					</div>

					<div>
						<label class="mb-2 block" for="email">
							{m.emailLabel()}
						</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							class="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							required
							placeholder={m.emailPlaceholder()}
						/>
					</div>

					<div>
						<label class="mb-2 block" for="message">
							{m.messageLabel()}
						</label>
						<textarea
							id="message"
							bind:value={message}
							rows="4"
							class="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							required
							placeholder={m.messagePlaceholder()}
						></textarea>
					</div>

					<button
						type="submit"
						class="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
					>
						{m.submitButton()}
					</button>
				{/if}
			</form>
		</section>

		<div class="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
			<h2 class="mb-4 text-center text-xl font-semibold text-black dark:text-white">
				{m.locationHeading()}
			</h2>
			<div class="flex aspect-video items-center justify-center rounded-lg">
				<!-- svelte-ignore a11y_missing_attribute -->
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2823.8043652622987!2d24.982276665068113!3d60.17459553332388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bdfb47017a1%3A0xebfbc9dbb5cdaf66!2sKorkeasaari%20Zoo!5e1!3m2!1sen!2sfi!4v1738841712785!5m2!1sen!2sfi"
					width="600"
					height="450"
					style="border:0;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</div>
	</div>
</main>
