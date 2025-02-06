<script>
  import * as m from '$lib/paraglide/messages.js';
  const effectiveDate = new Date('2025-01-01').toLocaleDateString();
  import Meta from '$src/lib/components/Meta.svelte';
  import { PUBLIC_SITE_EMAIL } from '$env/static/public';
</script>

<Meta
  config={{
    title: m.privacyTitle(),
    description: m.privacyTitle()
  }}
/>

<main class="container mx-auto px-4 py-8 max-w-3xl">
  <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
    {m.privacyTitle()}
  </h1>

  <p class="text-lg text-gray-600 text-center mb-8 dark:text-gray-50">
    <strong>{m.effectiveDate({ date: effectiveDate })}</strong>
  </p>

  <div class="prose prose-gray max-w-none">
    <!-- Introduction -->
    <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-50">
      {m.introduction()}
    </p>

    <!-- Information We Collect -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.informationCollectionHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.informationCollectionContent()}
      </p>
    </section>

    <!-- How We Use Your Data -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.dataUsageHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.dataUsageContent()}
      </p>
    </section>

    <!-- Data Protection -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.dataProtectionHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.dataProtectionContent()}
      </p>
    </section>

    <!-- Your Rights -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.userRightsHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.userRightsContent()}
      </p>
    </section>

    <!-- Policy Changes -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.changesHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.changesContent()}
      </p>
    </section>

    <!-- Contact Information -->
    <div class="bg-gray-50 p-6 rounded-lg mt-8">
      <p class="text-gray-700 leading-relaxed mb-0">
        {m.contactUs({ email: PUBLIC_SITE_EMAIL || 'privacy@example.com' })}
      </p>
    </div>
  </div>
</main>

<style>
  p {
    font-size: 1.1rem;
  }
</style>
