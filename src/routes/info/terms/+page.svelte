<script>
	import * as m from '$lib/paraglide/messages.js';
	const effectiveDate = new Date('2025-01-01').toLocaleDateString();
	import Meta from '$src/lib/components/Meta.svelte';
	import { PUBLIC_SITE_EMAIL } from '$env/static/public';
</script>

<Meta
	config={{
		title: m.orderTitle(),
		description: m.orderTitle()
	}}
/>

<main class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-50 md:text-4xl">
		{m.orderTitle()}
	</h1>

	<p class="mb-8 text-center text-lg text-gray-600 dark:text-gray-50">
		<strong>{m.effectiveDate({ date: effectiveDate })}</strong>
	</p>

	<div class="prose prose-gray max-w-none">
		<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-50">
			{m.orderIntroduction()}
		</p>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.orderProcessHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.orderProcessContent()}
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.paymentMethodsHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.paymentMethodsContent()}
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.deliveryOptionsHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.deliveryOptionsContent()}
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.returnsHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.returnsContent()}
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.liabilityHeading()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.liabilityContent()}
			</p>
		</section>

		<div class="mt-8 rounded-lg bg-gray-50 p-6">
			<p class="mb-0 leading-relaxed text-gray-700">
				{m.orderContact({ email: PUBLIC_SITE_EMAIL })}
			</p>
		</div>
	</div>
</main>

<style>
	p {
		font-size: 1.1rem;
	}
</style>
