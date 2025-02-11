<script>
  import * as m from '$lib/paraglide/messages.js';
  import Meta from '$lib/components/Meta.svelte';
</script>

<Meta
  config={{
    title: m.cookie_policy_title(),
    description: m.cookie_policy_description()
  }}
/>

<main class="container mx-auto px-4 py-8 max-w-3xl">
  <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
    {m.cookie_policy_title()}
  </h1>

  <div class="prose prose-gray max-w-none">
    <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-50">
      {m.cookie_policy_intro()}
    </p>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.what_are_cookies_title()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.what_are_cookies_content()}
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.how_we_use_cookies_title()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.how_we_use_cookies_content()}
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.cookie_types_title()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.cookie_types_content()}
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.manage_cookies_title()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.manage_cookies_content()}
      </p>
    </section>
  </div>
</main>