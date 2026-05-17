<script lang="ts">
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
</script>

<!-- Hero Section -->
<div class="bg-transparent 2xl:mx-auto">
	<div class="relative min-h-[55vh] w-full overflow-hidden shadow-2xl md:min-h-[70vh]">
		<figure class="absolute inset-0 z-0 m-0">
			<video
				aria-hidden="true"
				autoplay
				muted
				loop
				playsinline
				class="h-full w-full object-cover"
				poster="/img/hero-poster.webp"
			>
				<source src="/video/hero.webm" type="video/webm" />
				<source src="/video/hero.mp4" type="video/mp4" />
			</video>
			<figcaption class="sr-only">{m.hero_title()}</figcaption>
		</figure>

		<div
			class="absolute inset-0 z-10 bg-gradient-to-r from-gray-950/80 via-gray-950/60 to-gray-950/20"
		></div>
		<div
			class="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent"
		></div>

		<div
			class="relative z-20 mx-auto flex min-h-[55vh] max-w-screen-xl items-center px-6 py-16 md:min-h-[70vh] md:px-12 md:py-24"
		>
			<div class="max-w-2xl space-y-6 text-white">
				<h1
					class="animate-fade-in-up text-5xl font-bold leading-[1.05] tracking-tight drop-shadow-lg md:text-6xl lg:text-7xl"
				>
					<span class="bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent">
						{m.hero_title()}
					</span>
				</h1>

				<p
					class="animate-fade-in-up max-w-xl text-lg font-medium text-gray-100/90 delay-100 md:text-xl md:leading-relaxed"
				>
					{m.hero_description()}
				</p>

				<div class="animate-fade-in-up flex flex-wrap items-center gap-3 pt-2 delay-200">
					<button
						onclick={async () => await goto(`/categories`)}
						class="group flex items-center gap-2 rounded-full bg-primary-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-primary-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-400/40 md:text-lg"
					>
						<span>{m.shop_now()}</span>
						<ArrowRight
							size={20}
							class="transition-transform duration-300 group-hover:translate-x-1"
						/>
					</button>
					<a
						href="#collections"
						class="rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/30 md:text-lg"
					>
						{m.hero_secondary_cta()}
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
	:global(.animate-fade-in-up) {
		animation: fade-in-up 0.7s ease-out both;
	}
</style>
