<script>
	import * as m from '$lib/paraglide/messages.js';
	import Meta from '$src/lib/components/Meta.svelte';
</script>

<Meta
	config={{
		title: m.page_not_found(),
		description: m.page_not_found()
	}}
/>

<section
	class="my-2 flex max-w-screen-xl items-center rounded-sm p-12 py-24 md:mx-8 md:py-32 xl:mx-auto"
>
	<div class="max-w-screen mx-auto">
		<h1 class="p-4 text-4xl md:text-6xl">{m.page_not_found()}</h1>
	</div>
</section>
