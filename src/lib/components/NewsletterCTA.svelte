<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import Mail from '@lucide/svelte/icons/mail';

	let email = $state('');
	let submitted = $state(false);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!email) return;
		submitted = true;
	}
</script>

<section class="mx-auto my-8 max-w-screen-xl px-4 py-12 md:my-16 md:py-16">
	<div
		class="overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 shadow-xl md:p-12"
	>
		<div class="mx-auto max-w-2xl text-center text-white">
			<div
				class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15"
			>
				<Mail size={22} />
			</div>
			<h2 class="text-3xl font-bold tracking-tight md:text-4xl">
				{m.newsletter_heading()}
			</h2>
			<p class="mt-3 text-base text-white/80 md:text-lg">
				{m.newsletter_subheading()}
			</p>

			{#if submitted}
				<p class="mt-6 text-base font-medium text-white">✓ {email}</p>
			{:else}
				<form
					onsubmit={handleSubmit}
					class="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
				>
					<label class="sr-only" for="newsletter-email">{m.newsletter_placeholder()}</label>
					<input
						id="newsletter-email"
						bind:value={email}
						type="email"
						required
						placeholder={m.newsletter_placeholder()}
						class="flex-1 rounded-lg border-0 bg-white/95 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
					/>
					<button
						type="submit"
						class="rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
					>
						{m.newsletter_submit()}
					</button>
				</form>
			{/if}

			<p class="mt-4 text-xs text-white/60">
				{m.newsletter_privacy()}
			</p>
		</div>
	</div>
</section>
