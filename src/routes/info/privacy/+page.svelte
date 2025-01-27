<script>
    import * as m from '$lib/paraglide/messages.js';
    import Meta from '$src/lib/components/Meta.svelte';
    const effectiveDate = new Date('2025-01-01').toLocaleDateString();
  </script>
  
<Meta
config={{
  title: m.privacyTitle(),
  description: m.privacyTitle()
}}

/>
  <main class="container mx-auto px-4 py-8 max-w-3xl">
    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
      {m.privacyTitle()}
    </h1>
  
    <p class="text-lg text-gray-600 text-center mb-8">
      <strong>{m.effectiveDate({ date: effectiveDate })}</strong>
    </p>
  
    <div class="prose prose-gray max-w-none">
      <p class="text-gray-700 leading-relaxed mb-6">
        {m.introduction()}
      </p>
  
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          {m.informationCollectionHeading()}
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">
          {m.informationCollectionContent()}
        </p>
      </section>
  
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          {m.dataUsageHeading()}
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">
          {m.dataUsageContent()}
        </p>
      </section>
  
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          {m.dataProtectionHeading()}
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">
          {m.dataProtectionContent()}
        </p>
      </section>
  
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          {m.userRightsHeading()}
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">
          {m.userRightsContent()}
        </p>
      </section>
  
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          {m.changesHeading()}
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">
          {m.changesContent()}
        </p>
      </section>
  
      <div class="bg-gray-50 p-6 rounded-lg mt-8">
        <p class="text-gray-700 leading-relaxed mb-0">
          {m.contactUs()}
        </p>
      </div>
    </div>
  </main>