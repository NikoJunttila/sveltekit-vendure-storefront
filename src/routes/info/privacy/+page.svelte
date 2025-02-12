<script>
	import * as m from '$lib/paraglide/messages.js';
	const effectiveDate = new Date('2025-01-01').toLocaleDateString();
	import Meta from '$src/lib/components/Meta.svelte';
	import { PUBLIC_SITE_EMAIL } from '$env/static/public';
</script>

<Meta
	config={{
		title: m.privacyTitle(),
		description: m.privacyTitle()
	}}
/>

<main class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-50 md:text-4xl">
		{m.privacyTitle()}
	</h1>

	<p class="mb-8 text-center text-lg text-gray-600 dark:text-gray-50">
		<strong>{m.effectiveDate({ date: effectiveDate })}</strong>
	</p>

	<div class="prose prose-gray max-w-none">
		<!-- Introduction -->
		<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-50">
			{m.introduction()}
		</p>

		<!-- Information We Collect -->
		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.informationCollectionHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.informationCollectionContent()}
			</p>
		</section>

		<!-- How We Use Your Data -->
		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.dataUsageHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.dataUsageContent()}
			</p>
		</section>

		<!-- Data Protection -->
		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.dataProtectionHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.dataProtectionContent()}
			</p>
		</section>

		<!-- Your Rights -->
		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.userRightsHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.userRightsContent()}
			</p>
		</section>

		<!-- Policy Changes -->
		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.changesHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.changesContent()}
			</p>
		</section>

		<!-- Contact Information -->
		<div class="mt-8 rounded-lg bg-gray-50 p-6">
			<p class="mb-0 leading-relaxed text-gray-700">
				{m.contactUs({ email: PUBLIC_SITE_EMAIL || 'privacy@example.com' })}
			</p>
		</div>
	</div>
</main>

<style>
	p {
		font-size: 1.1rem;
	}
</style>
