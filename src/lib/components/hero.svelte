<script lang="ts">
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
</script>

<!-- Hero Section -->
<div class=" bg-transparent 2xl:mx-auto max-h-[75vh]">
	<div class="relative min-h-[500px] w-full overflow-hidden shadow-2xl">
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

		<div class="absolute inset-0 z-10 bg-gradient-to-r from-gray-900/60 to-transparent"></div>
		<div
			class="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"
		></div>

		<div class="relative z-20 px-8 py-12 md:px-16 md:py-24 lg:py-32 xl:ml-[15%]">
			<div class="max-w-2xl space-y-6 text-white">
				<h1
					class="animate-fade-in-up text-5xl font-bold leading-tight drop-shadow-2xl md:text-6xl lg:text-7xl xl:text-8xl"
				>
					<span class="bg-gradient-to-r from-lime-400 to-emerald-500 bg-clip-text text-transparent">
						{m.hero_title()}
					</span>
				</h1>

				<p
					class="animate-fade-in-up text-xl font-medium text-gray-100 delay-100 md:text-2xl md:leading-relaxed lg:max-w-[600px]"
				>
					{m.hero_description()}
				</p>

				<button
					onclick={async () => await goto(`/categories`)}
					class="animate-fade-in-up group relative flex items-center gap-3 rounded-full bg-lime-500 px-8 py-4 text-lg font-semibold text-black shadow-lg transition-all delay-200 duration-300 hover:scale-105 hover:bg-lime-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-lime-400/30"
				>
					<span>{m.shop_now()}</span>
					<svg
						class="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
