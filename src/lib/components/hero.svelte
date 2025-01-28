<script lang="ts">
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import {
		PUBLIC_SITE_NAME,
		PUBLIC_SITE_DESCRIPTION,
	} from '$env/static/public';
</script>


<!-- Hero Section -->
<div class="max-w-screen-2xl bg-transparent px-2 py-1 md:py-4 md:px-6 2xl:mx-auto">
	<div class="relative w-full overflow-hidden rounded-2xl shadow-2xl min-h-[500px]">
		<figure class="absolute inset-0 z-0 m-0">
			<video 
				autoplay 
				muted 
				loop 
				playsinline 
				class="h-full w-full object-cover"
				poster="/img/hero-poster.webp"
			>
				<source src="/video/hero.webm" type="video/webm">
				<source src="/video/hero.mp4" type="video/mp4">
				<img 
					src="/img/hero-fallback.webp" 
					alt="{PUBLIC_SITE_NAME}"
					class="h-full w-full object-cover"
				/>
			</video>
			<figcaption class="sr-only">{PUBLIC_SITE_DESCRIPTION}</figcaption>
		</figure>

		<div class="absolute inset-0 z-10 bg-gradient-to-r from-gray-900/60 to-transparent"></div>
		<div class="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>

		<header class="relative z-20 px-8 py-12 md:px-16 md:py-24 lg:py-32">
			<div class="max-w-2xl space-y-6 text-white">
				<h1 class="text-5xl font-bold leading-tight drop-shadow-2xl md:text-6xl lg:text-7xl xl:text-8xl animate-fade-in-up">
					<span class="bg-gradient-to-r from-lime-400 to-emerald-500 bg-clip-text text-transparent">
						{m.hero_title()}
					</span>
				</h1>
				
				<p class="text-xl font-medium text-gray-100 md:text-2xl md:leading-relaxed lg:max-w-[600px] animate-fade-in-up delay-100">
					{m.hero_description()}
				</p>

				<button
					onclick={async () => await goto(`/categories`)}
					class="group relative flex items-center gap-3 rounded-full bg-lime-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-lime-600 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-lime-400/30 animate-fade-in-up delay-200"
				>
					<span>{m.shop_now()}</span>
					<svg class="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
					</svg>
				</button>
			</div>
		</header>
	</div>
</div>