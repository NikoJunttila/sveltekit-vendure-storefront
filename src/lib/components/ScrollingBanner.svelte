<script>
	import * as m from '$lib/paraglide/messages.js';
</script>

<!-- Scrolling banner text -->
<section class="mx-auto my-8 max-w-screen-xl p-4">
	<div class="overflow-hidden rounded-lg bg-orange-400 shadow-sm">
		<div class="group relative py-4">
			<div class="scrolling-text whitespace-nowrap text-lg font-medium text-gray-800">
				{#each { length: 4 } as _}
					<span class="inline-block pr-8">
						<!-- PLACE HOLDER. FETCH REAL DATA LATER-->
						{m.banner_text()}
					</span>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
	.scrolling-text {
		animation: scroll 20s linear infinite;
		display: inline-block;
		min-width: max-content;
	}
	/* Pause on hover */
	.group:hover .scrolling-text {
		animation-play-state: paused;
	}
	/* Respect reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		.scrolling-text {
			animation: none;
			white-space: normal;
		}
	}
</style>
