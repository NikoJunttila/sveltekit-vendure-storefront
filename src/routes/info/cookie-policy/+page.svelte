<script>
	import * as m from '$lib/paraglide/messages.js';
	import Meta from '$lib/components/Meta.svelte';
</script>

<Meta
	config={{
		title: m.cookie_policy_title(),
		description: m.cookie_policy_description()
	}}
/>

<main class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-50 md:text-4xl">
		{m.cookie_policy_title()}
	</h1>

	<div class="prose prose-gray max-w-none">
		<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-50">
			{m.cookie_policy_intro()}
		</p>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.what_are_cookies_title()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.what_are_cookies_content()}
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.how_we_use_cookies_title()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.how_we_use_cookies_content()}
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.cookie_types_title()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.cookie_types_content()}
			</p>
		</section>

		<section class="mb-8">
			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-50">
				{m.manage_cookies_title()}
			</h2>
			<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-200">
				{m.manage_cookies_content()}
			</p>
		</section>
	</div>
</main>
