<script>
	import Meta from '$src/lib/components/Meta.svelte';
	import { fade } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import { PUBLIC_SITE_NAME } from '$env/static/public';
	// Sample images - replace with your actual image paths
	const teamPhotos = [
		{
			image:
				'https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: 'Whiskers McFluff',
			title: 'Chief Napping Officer'
		},
		{
			image:
				'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: 'Lord Pawington III',
			title: 'Senior Box Inspector'
		},
		{
			image:
				'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: 'Captain Mittens',
			title: 'Head of Yarn Acquisition'
		},
		{
			image:
				'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			name: 'Luna Whiskerton',
			title: 'VP of Midnight Zoomies'
		}
	];

	let activeTab = $state('story');
	let isTeamGrid = $state(true);
</script>

<Meta
	config={{
		title: m.aboutTitle({ name: PUBLIC_SITE_NAME }),
		description: m.aboutDescription({ name: PUBLIC_SITE_NAME })
	}}
/>

<main class="bg-white dark:bg-gray-900">
	<!-- Hero Section -->
	<section class="relative flex h-96 items-center justify-center py-10">
		<img
			src="https://plus.unsplash.com/premium_photo-1707353402061-c31b6ba8562e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt={m.heroTitle()}
			class="absolute inset-0 h-full w-full object-cover opacity-90"
		/>
		<div class="relative z-10 px-4 text-center">
			<h1
				class="mb-6 text-4xl font-bold text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] md:text-6xl"
			>
				{m.heroTitle()}
			</h1>
			<p class="mx-auto max-w-2xl text-xl text-white/90 [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
				{m.heroSubtitle()}
			</p>
		</div>
	</section>

	<!-- Content Tabs -->
	<nav class="sticky top-0 z-20 bg-white shadow-sm dark:bg-gray-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex justify-center gap-4 space-x-8">
				<button
					class:font-bold={activeTab === 'story'}
					class="border-b-2 border-transparent px-1 py-4 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:text-gray-300"
					onclick={() => (activeTab = 'story')}
				>
					{m.ourStory()}
				</button>
				<button
					class:font-bold={activeTab === 'values'}
					class="border-b-2 border-transparent px-1 py-4 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:text-gray-300"
					onclick={() => (activeTab = 'values')}
				>
					{m.ourValues()}
				</button>
				<button
					class:font-bold={activeTab === 'team'}
					class="border-b-2 border-transparent px-1 py-4 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:text-gray-300"
					onclick={() => (activeTab = 'team')}
				>
					{m.ourTeam()}
				</button>
			</div>
		</div>
	</nav>

	<!-- Tab Content -->
	<div class="mx-auto mb-5 max-w-7xl gap-2 px-4 py-32 sm:px-6 lg:px-8">
		{#if activeTab === 'story'}
			<section class="grid items-center gap-6 md:grid-cols-2" transition:fade>
				<img
					src="https://plus.unsplash.com/premium_photo-1707353402061-c31b6ba8562e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					alt={m.ourStory()}
					class="h-96 w-full rounded-lg object-cover shadow-xl"
				/>
				<div>
					<h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">{m.storyTitle()}</h2>
					<div class="prose prose-lg dark:prose-invert">
						<p>{m.storyContent1({ founder: 'Niko Junttila' })}</p>
						<p class="mt-4">{m.storyContent2()}</p>
					</div>
				</div>
			</section>
		{:else if activeTab === 'values'}
			<div class="grid gap-8 md:grid-cols-3" transition:fade>
				{#each [m.valueSustainability(), m.valueQuality(), m.valueCommunity()] as value, i}
					<div
						class="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800"
					>
						<div
							class="mb-6 flex h-12 w-12 items-center justify-center gap-4 rounded-lg bg-blue-100 dark:bg-blue-900/30"
						>
							<svg
								class="h-6 w-6 text-blue-600 dark:text-blue-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{#if value === m.valueSustainability()}
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 7h3l-4 4-4-4h3V3h2v4zm-6 8H4l4-4 4 4h-3v4h-2v-4z"
									/>
								{:else if value === m.valueQuality()}
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								{:else}
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								{/if}
							</svg>
						</div>
						<h3 class="mb-4 text-xl font-semibold dark:text-white">{value}</h3>
						<p class="text-gray-600 dark:text-gray-300">{m.valueDescription()}</p>
					</div>
				{/each}
			</div>
		{:else if activeTab === 'team'}
			<div class="space-y-8" transition:fade>
				<div class="mb-8 flex justify-end space-x-4">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class:bg-gray-200={isTeamGrid}
						class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
						onclick={() => (isTeamGrid = true)}
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
							/>
						</svg>
					</button>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						class:bg-gray-200={!isTeamGrid}
						class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
						onclick={() => (isTeamGrid = false)}
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>

				{#if isTeamGrid}
					<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{#each teamPhotos as member}
							<div
								class="flex items-center gap-6 rounded-xl bg-white p-6 transition-shadow hover:shadow-lg dark:bg-gray-800"
							>
								<img
									src={member.image}
									alt={member.name}
									class="h-32 w-32 rounded-full object-cover"
								/>
								<div>
									<h3 class="mb-2 text-xl font-semibold dark:text-white">{member.name}</h3>
									<p class="text-gray-600 dark:text-gray-300">{member.title}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="space-y-6">
						{#each teamPhotos as member}
							<div
								class="flex items-center gap-6 rounded-xl bg-white p-6 transition-shadow hover:shadow-lg dark:bg-gray-800"
							>
								<img
									src={member.image}
									alt={member.name}
									class="h-32 w-32 rounded-full object-cover"
								/>
								<div>
									<h3 class="mb-2 text-xl font-semibold dark:text-white">{member.name}</h3>
									<p class="text-gray-600 dark:text-gray-300">{member.title}</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Stats Section -->
	<section class="bg-gray-50 dark:bg-gray-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid gap-8 text-center md:grid-cols-3">
				{#each [{ number: '10k+', label: m.statsCustomers() }, { number: '200+', label: m.statsArtisans() }, { number: '15', label: m.statsCountries() }] as stat}
					<div class="p-16">
						<div class="mb-4 text-5xl font-bold text-blue-600 dark:text-blue-400">
							{stat.number}
						</div>
						<div class="text-sm uppercase tracking-wide text-gray-600 dark:text-gray-300">
							{stat.label}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>
