<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class=" min-h-screen py-12">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<h1 class="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">
			{m.info_title()}
		</h1>
		<h2 class="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-300">
			{m.about_us_description()}
		</h2>
		<p class="mb-8 text-lg text-gray-600 dark:text-gray-400">
			{m.info_welcome()}
		</p>

		<!-- Informational Panels -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
				<h3 class="mb-2 text-xl font-bold text-gray-800 dark:text-white">
					{m.info_our_mission_title()}
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
					{m.info_our_mission_description()}
				</p>
			</div>
			<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
				<h3 class="mb-2 text-xl font-bold text-gray-800 dark:text-white">
					{m.info_services_title()}
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
					{m.info_services_description()}
				</p>
			</div>
		</div>
	</div>
</div>
