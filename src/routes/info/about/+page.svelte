<script>
    import Meta from '$src/lib/components/Meta.svelte';
    import { fade, fly } from 'svelte/transition';
    
    // Sample images - replace with your actual image paths
    const teamPhotos = [
        'https://plus.unsplash.com/premium_photo-1677545183884-421157b2da02?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ];

    let activeTab = $state('story');
    let isTeamGrid = $state(true);
</script>

<Meta
    config={{
        title: "About Us - Your Store Name",
        description: "Discover our story, values, and the passionate team behind Your Store Name"
    }}
/>

<main class="bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="relative h-96 py-10 flex items-center justify-center">
        <img 
            src="https://plus.unsplash.com/premium_photo-1707353402061-c31b6ba8562e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Our team working together" 
            class="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div class="relative z-10 text-center px-4">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
                Crafting Your Experience
            </h1>
            <p class="text-xl text-white/90 max-w-2xl mx-auto [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                For over a decade, we've been committed to bringing you the finest products with exceptional service
            </p>
        </div>
    </section>

    <!-- Content Tabs -->
    <nav class="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-center space-x-8 gap-4">
                <button
                    class:font-bold={activeTab === 'story'}
                    class="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors dark:text-gray-300"
                    onclick={() => activeTab = 'story'}
                >
                    Our Story
                </button>
                <button
                    class:font-bold={activeTab === 'values'}
                    class="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors dark:text-gray-300"
                    onclick={() => activeTab = 'values'}
                >
                    Our Values
                </button>
                <button
                    class:font-bold={activeTab === 'team'}
                    class="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors dark:text-gray-300"
                    onclick={() => activeTab = 'team'}
                >
                    Our Team
                </button>
            </div>
        </div>
    </nav>

    <!-- Tab Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 gap-2 mb-5">
        {#if activeTab === 'story'}
            <section class="grid md:grid-cols-2 gap-6 items-center" transition:fade>
                <img 
                    src="https://plus.unsplash.com/premium_photo-1707353402061-c31b6ba8562e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Our humble beginnings" 
                    class="rounded-lg shadow-xl w-full h-96 object-cover"
                />
                <div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-6 dark:text-white">From Garage to Global</h2>
                    <div class="prose prose-lg dark:prose-invert">
                        <p>What started as a small family workshop in 2010 has blossomed into an international e-commerce destination. Our founder, Jane Doe, began crafting handmade jewelry at her kitchen table, driven by a passion for sustainable fashion.</p>
                        <p class="mt-4">Today, we partner with over 200 artisans worldwide, bringing you unique, ethically-made products while maintaining that personal touch that started it all.</p>
                    </div>
                </div>
            </section>

        {:else if activeTab === 'values'}
            <div class="grid md:grid-cols-3 gap-8" transition:fade>
                {#each ['Sustainability', 'Quality', 'Community'] as value, i}
                    <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center gap-4 justify-center mb-6 dark:bg-blue-900/30">
                            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {#if value === 'Sustainability'}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h3l-4 4-4-4h3V3h2v4zm-6 8H4l4-4 4 4h-3v4h-2v-4z"/>
                                {:else if value === 'Quality'}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                {:else}
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                {/if}
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold mb-4 dark:text-white">{value}</h3>
                        <p class="text-gray-600 dark:text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                    </div>
                {/each}
            </div>

        {:else if activeTab === 'team'}
            <div class="space-y-8" transition:fade>
                <div class="flex justify-end space-x-4 mb-8">
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        class:bg-gray-200={isTeamGrid}
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        onclick={() => isTeamGrid = true}
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                        </svg>
                    </button>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
                    <button
                        class:bg-gray-200={!isTeamGrid}
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        onclick={() => isTeamGrid = false}
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>

                {#if isTeamGrid}
                    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {#each teamPhotos as photo, i}
                            <div class="group relative overflow-hidden rounded-xl">
                                <img 
                                    src={photo} 
                                    alt="Team member {i + 1}" 
                                    class="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div class="text-white">
                                        <h3 class="text-xl font-semibold">Team Member {i + 1}</h3>
                                        <p class="text-sm opacity-90">Position Title</p>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="space-y-6">
                        {#each teamPhotos as photo, i}
                            <div class="flex items-center gap-6 p-6 bg-white rounded-xl hover:shadow-lg transition-shadow dark:bg-gray-800">
                                <img 
                                    src={photo} 
                                    alt="Team member {i + 1}" 
                                    class="w-32 h-32 rounded-full object-cover"
                                />
                                <div>
                                    <h3 class="text-xl font-semibold mb-2 dark:text-white">Team Member {i + 1}</h3>
                                    <p class="text-gray-600 dark:text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-3  gap-8 text-center">
                {#each [{ number: '10k+', label: 'Happy Customers' }, { number: '200+', label: 'Artisan Partners' }, { number: '15', label: 'Countries Served' }] as stat}
                    <div class="p-16">
                        <div class="text-5xl font-bold text-blue-600 mb-4 dark:text-blue-400">{stat.number}</div>
                        <div class="text-gray-600 uppercase tracking-wide text-sm dark:text-gray-300">{stat.label}</div>
                    </div>
                {/each}
            </div>
        </div>
    </section>
</main>