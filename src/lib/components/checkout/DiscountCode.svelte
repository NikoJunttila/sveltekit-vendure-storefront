<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	let discountFormOpen = $state(false);
	const toggleDiscountForm = () => {
		let discountForm = document.getElementById('discount-form') as HTMLElement;
		if (discountFormOpen) {
			discountForm.classList.add('hidden');
			discountFormOpen = false;
		} else {
			discountForm.classList.remove('hidden');
			discountFormOpen = true;
		}
	};
</script>

<section class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
	<div class="p-6">
		<button
			type="button"
			onclick={toggleDiscountForm}
			class="text-sm font-medium text-lime-600 hover:text-lime-500"
		>
			{m.discount_coupon()}
		</button>
		<div id="discount-form" class="mt-4 hidden">
			<div class="flex space-x-4">
				<input
					type="text"
					id="discount-code"
					name="discount-code"
					placeholder={m.enter_code()}
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm"
				/>
				<button
					type="submit"
					class="inline-flex items-center justify-center rounded-md bg-lime-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
				>
					{m.redeem()}
				</button>
			</div>
		</div>
	</div>
</section>
