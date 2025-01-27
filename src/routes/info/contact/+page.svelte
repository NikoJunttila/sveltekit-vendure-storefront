<script>
    import * as m from '$lib/paraglide/messages.js';
    import Meta from '$src/lib/components/Meta.svelte';
    let name = '';
    let email = '';
    let message = '';
    let isSubmitted = false;
  
    function handleSubmit() {
      // Add your form submission logic here
      isSubmitted = true;
    }
  </script>
  <Meta
	config={{
		title: m.contactTitle(),
		description: m.contactTitle()
	}}
/>
  
  <main class="container mx-auto px-4 py-8 max-w-3xl">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
      {m.contactTitle()}
    </h1>
  
    <div class="prose prose-gray max-w-none">
      <p class="text-gray-700 leading-relaxed mb-6 text-center">
        {m.contactIntroduction()}
      </p>
  
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="bg-gray-50 p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {m.contactDetails()}
          </h2>
          <ul class="space-y-2">
            <li class="flex items-center text-gray-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
              </svg>
              {m.contactEmail()}
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {m.contactPhone()}
            </li>
            <li class="flex items-start text-gray-700">
              <svg class="w-5 h-5 mr-2 mt-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{m.contactAddress()}</span>
            </li>
          </ul>
        </div>
  
        <div class="bg-gray-50 p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {m.businessHours()}
          </h2>
          <ul class="space-y-2">
            <li class="text-gray-700">{m.hoursWeekdays()}</li>
            <li class="text-gray-700">{m.hoursWeekends()}</li>
            <li class="text-gray-700">{m.hoursHolidays()}</li>
          </ul>
        </div>
      </div>
  
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">
          {m.contactFormHeading()}
        </h2>
        
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          {#if isSubmitted}
            <div class="bg-green-50 p-4 rounded-lg text-green-700">
              {m.contactSuccessMessage()}
            </div>
          {:else}
            <div>
              <label class="block text-gray-700 mb-2" for="name">
                {m.nameLabel()}
              </label>
              <input
                type="text"
                id="name"
                bind:value={name}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder={m.namePlaceholder()}
              />
            </div>
  
            <div>
              <label class="block text-gray-700 mb-2" for="email">
                {m.emailLabel()}
              </label>
              <input
                type="email"
                id="email"
                bind:value={email}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder={m.emailPlaceholder()}
              />
            </div>
  
            <div>
              <label class="block text-gray-700 mb-2" for="message">
                {m.messageLabel()}
              </label>
              <textarea
                id="message"
                bind:value={message}
                rows="4"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder={m.messagePlaceholder()}
              ></textarea>
            </div>
  
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {m.submitButton()}
            </button>
          {/if}
        </form>
      </section>
  
      <div class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          {m.locationHeading()}
        </h2>
        <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-gray-500">{m.mapPlaceholder()}</span>
        </div>
      </div>
    </div>
  </main>