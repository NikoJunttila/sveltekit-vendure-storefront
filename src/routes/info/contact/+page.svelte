<script>
    import * as m from '$lib/paraglide/messages.js';
    import Meta from '$src/lib/components/Meta.svelte';
    import {
		PUBLIC_SITE_ADDRESS,
		PUBLIC_SITE_CITY,
		PUBLIC_SITE_STATE,
		PUBLIC_SITE_ZIP,
		PUBLIC_SITE_COUNTRY,
		PUBLIC_SITE_PHONE,
		PUBLIC_SITE_EMAIL,
	} from '$env/static/public';

    let name = $state('');
    let email = $state('');
    let message = $state('');
    let isSubmitted = $state(false);

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
    <h1 class="text-3xl md:text-4xl font-bold  text-center mb-8">
      {m.contactTitle()}
    </h1>
  
    <div class="prose prose-gray text-black dark:text-white max-w-none">
      <p class=" leading-relaxed mb-6 text-center">
        {m.contactIntroduction()}
      </p>
  
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="bg-gray-50 dark:bg-gray-900  p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-black dark:text-white   mb-4">
            {m.contactDetails()}
          </h2>
          <ul class="space-y-2">
            <li class="flex items-center ">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
              </svg>
              {PUBLIC_SITE_EMAIL || m.contactEmail()}
            </li>
            <li class="flex items-center ">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              {PUBLIC_SITE_PHONE || m.contactPhone()}
            </li>
            <li class="flex items-start ">
              <svg class="w-5 h-5 mr-2 mt-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>
                <address class="not-italic ">
                {PUBLIC_SITE_ADDRESS}<br />
                {PUBLIC_SITE_CITY}, {PUBLIC_SITE_STATE} {PUBLIC_SITE_ZIP}<br />
                {PUBLIC_SITE_COUNTRY}
              </address>
            </span>
            </li>
          </ul>
        </div>
  
        <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-black dark:text-white  mb-4">
            {m.businessHours()}
          </h2>
          <ul class="space-y-2">
            <li class="">{m.hoursWeekdays()}</li>
            <li class="">{m.hoursWeekends()}</li>
            <li class="">{m.hoursHolidays()}</li>
          </ul>
        </div>
      </div>
  
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-black dark:text-white mb-6">
          {m.contactFormHeading()}
        </h2>
        
        <form onsubmit={handleSubmit} class="space-y-6">
          {#if isSubmitted}
            <div class="bg-green-50 p-4 rounded-lg text-green-700">
              {m.contactSuccessMessage()}
            </div>
          {:else}
            <div>
              <label class="block  mb-2" for="name">
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
              <label class="block  mb-2" for="email">
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
              <label class="block  mb-2" for="message">
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
  
      <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
        <h2 class="text-xl font-semibold  mb-4 text-black dark:text-white text-center">
          {m.locationHeading()}
        </h2>
        <div class="aspect-video rounded-lg flex items-center justify-center">
          <!-- svelte-ignore a11y_missing_attribute -->
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2823.8043652622987!2d24.982276665068113!3d60.17459553332388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46920bdfb47017a1%3A0xebfbc9dbb5cdaf66!2sKorkeasaari%20Zoo!5e1!3m2!1sen!2sfi!4v1738841712785!5m2!1sen!2sfi" width="600" height="450" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  </main>