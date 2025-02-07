<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class=" min-h-screen py-12">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Page Header -->
		<h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
			{m.info_title()}
		</h1>
		<h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
			{m.about_us_description()}
		</h2>
		<p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
			{m.info_welcome()}
		</p>

		<!-- Informational Panels -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
				<h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
					{m.info_our_mission_title()}
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
					{m.info_our_mission_description()}
				</p>
			</div>
			<div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
				<h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
					{m.info_services_title()}
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
					{m.info_services_description()}
				</p>
			</div>
		</div>
	</div>
</div>
