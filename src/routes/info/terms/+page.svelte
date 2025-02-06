<script>
  import * as m from '$lib/paraglide/messages.js';
  const effectiveDate = new Date('2025-01-01').toLocaleDateString();
  import Meta from '$src/lib/components/Meta.svelte';
  import {PUBLIC_SITE_EMAIL,} from '$env/static/public';
</script>

<Meta
config={{
title: m.orderTitle(),
description: m.orderTitle()
}}
/>

<main class="container mx-auto px-4 py-8 max-w-3xl">
  <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
    {m.orderTitle()}
  </h1>

  <p class="text-lg text-gray-600 text-center mb-8 dark:text-gray-50">
    <strong>{m.effectiveDate({ date: effectiveDate })}</strong>
  </p>

  <div class="prose prose-gray max-w-none">
    <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-50">
      {m.orderIntroduction()}
    </p>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">
        {m.orderProcessHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.orderProcessContent()}
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4 dark:text-gray-50">
        {m.paymentMethodsHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.paymentMethodsContent()}
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4 dark:text-gray-50">
        {m.deliveryOptionsHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.deliveryOptionsContent()}
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4 dark:text-gray-50">
        {m.returnsHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.returnsContent()}
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4 dark:text-gray-50">
        {m.liabilityHeading()}
      </h2>
      <p class="text-gray-700 leading-relaxed mb-6 dark:text-gray-200">
        {m.liabilityContent()}
      </p>
    </section>

    <div class="bg-gray-50 p-6 rounded-lg mt-8">
      <p class="text-gray-700 leading-relaxed mb-0">
        {m.orderContact({email: PUBLIC_SITE_EMAIL})}
      </p>
    </div>
  </div>
</main>
<style>
  p{
    font-size: 1.1rem;
  }
</style>