<script lang="ts">
	//@ts-nocheck
	import { userStore } from '$src/lib/stores';
	import { formatCurrency } from '$src/lib/utils';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
	import { getContextClient } from '@urql/svelte';
	import {
		updateCustomer,
		updateCustomerAddress,
		CreateCustomerAddress,
		GetCustomer,
		RequestPasswordReset
	} from '$src/lib/vendure';
	import type {
		UpdateCustomerInput,
		UpdateAddressInput,
		CreateAddressInput
	} from '$src/lib/gql/graphql';
	import { useFragment } from '$src/lib/gql';
	import { Customer } from '$src/lib/vendure';
	import * as m from '$lib/paraglide/messages';
	import { toast } from '$src/lib/toast.svelte';
	import Meta from '$src/lib/components/Meta.svelte';

	const user = $derived(useFragment(Customer, $userStore));
	const isLoading = $derived(!user || Object.keys(user).length === 0);
	const client = getContextClient();

	let isEditing = $state(false);
	let formData: UpdateCustomerInput = $state({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		customFields: {}
	});

	let addressFormData: UpdateAddressInput | null = $state(null);

	let isAddingAddress = $state(false);
	let newAddressFormData: CreateAddressInput = $state({
		fullName: '',
		streetLine1: '',
		streetLine2: '',
		city: '',
		province: '',
		postalCode: '',
		countryCode: 'FI', // Default country code
		phoneNumber: '',
		defaultShippingAddress: true,
		defaultBillingAddress: false
	});

	// Create new address function
	const createAddress = async (input: CreateAddressInput) => {
		try {
			const result = await client.mutation(CreateCustomerAddress, { input }).toPromise();
			if (result.data?.createCustomerAddress) {
				await new Promise((resolve) => setTimeout(resolve, 500));
				await client.query(GetCustomer, {}, { requestPolicy: 'network-only' }).toPromise();
				toast.success(m.success_new_address());
				isAddingAddress = false;
				return true;
			} else if (result.error) {
				console.error('Error creating address:', result.error);
				toast.error(m.error_general());
				return false;
			}
		} catch (error) {
			console.error('err: ', error);
			toast.error(`${m.generic_error()} ${error}`);
			return false;
		}
	};

	const startEditing = () => {
		if (!user) return;
		formData = {
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber || '',
			customFields: {}
		};

		const defaultAddress : any = user.addresses?.find((addr: any) => addr.defaultShippingAddress);
		if (defaultAddress) {
			addressFormData = {
				id: defaultAddress.id,
				fullName: defaultAddress.fullName,
				streetLine1: defaultAddress.streetLine1,
				streetLine2: defaultAddress.streetLine2 || '',
				city: defaultAddress.city,
				province: defaultAddress.province || '',
				postalCode: defaultAddress.postalCode,
				countryCode: defaultAddress.country.code,
				phoneNumber: defaultAddress.phoneNumber || '',
				defaultShippingAddress: true,
				defaultBillingAddress: defaultAddress.defaultBillingAddress
			};
		}
		isEditing = true;
	};

	const updateCustomerFunc = async (input: UpdateCustomerInput) => {
		try {
			const result = await client.mutation(updateCustomer, { input }).toPromise();
			if (result.data?.updateCustomer) {
				return true;
			} else if (result.error) {
				console.error('Error updating customer:', result.error);
				return false;
			}
		} catch (error) {
			console.error('Error updating customer:', error);
			return false;
		}
	};

	const updateAddressFunc = async (input: UpdateAddressInput) => {
		try {
			const result = await client.mutation(updateCustomerAddress, { input }).toPromise();
			if (result.data?.updateCustomerAddress) {
				return true;
			} else if (result.error) {
				console.error('Error updating address:', result.error);
				return false;
			}
		} catch (error) {
			console.error('Error updating address:', error);
			return false;
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		let success = true;

		// Update customer details
		const customerSuccess = await updateCustomerFunc(formData);
		if (!customerSuccess) success = false;

		// Update address if changed
		if (addressFormData) {
			const addressSuccess = await updateAddressFunc(addressFormData);
			if (!addressSuccess) success = false;
		}

		if (success) {
			// Refresh user data or show success message
			isEditing = false;
		} else {
			// Show error message
		}
	};

	const cancelEdit = () => {
		isEditing = false;
		addressFormData = null;
	};

	// Format date
	const formatDate = (dateString: string) => {
		if (!dateString) return 'In Progress';
		return new Date(dateString).toLocaleDateString('fi-FI');
	};

	async function resetPass(e: SubmitEvent) {
		e.preventDefault();
		try {
			const result = await client
				.mutation(RequestPasswordReset, {
					emailAddress: user?.emailAddress!
				})
				.toPromise();
			if (result.data?.requestPasswordReset?.__typename) {
				toast.success(m.password_reset_link_sent());
			} else {
				//@ts-ignore
				toast.error( result.data?.registerCustomerAccount.message || m.generic_error());
			}
		} catch (e) {
			toast.error(m.unexpected_error());
		}
	}
</script>

<Meta
config={{
	title: m.customer_profile(),
	description: m.customer_profile()
}}
/>

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center p-4">
		<div class="flex flex-col items-center space-y-4">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
			<p class="text-gray-600">{m.loading()}</p>
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8">
		<!-- User Info Section -->
		<div
			class="rounded-xl bg-white p-6 shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl dark:bg-slate-700 lg:p-8"
		>
			<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 class="text-2xl font-bold text-gray-900 lg:text-3xl">{m.customer_profile()}</h1>
				</div>
				<form onsubmit={resetPass}>
					<button
					type="submit"
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
					>
					<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
							<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
							<path d="M16 5l3 3" />
						</svg>
						{m.change_password()}
					</button>
				</form>
				{#if !isEditing}
					<button
						onclick={startEditing}
						class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
							<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
							<path d="M16 5l3 3" />
						</svg>
						{m.edit_profile()}
					</button>
				{/if}
			</div>

			{#if isEditing}
				<form onsubmit={handleSubmit} class="space-y-6">
					<!-- Personal Information -->
					<div class="grid-cols grid">
						<div class="space-y-6">
							<h2 class="text-lg font-semibold text-gray-900 lg:text-xl">
								{m.personal_information()}
							</h2>
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700"
										>{m.first_name()}
										<input
											type="text"
											bind:value={formData.firstName}
											class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
											required
										/>
									</label>
								</div>
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700"
										>{m.last_name()}
										<input
											type="text"
											bind:value={formData.lastName}
											class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
											required
										/>
									</label>
								</div>
								<div class="space-y-2">
									<label class="block text-sm font-medium text-gray-700"
										>{m.phone()}
										<input
											type="text"
											bind:value={formData.phoneNumber}
											class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
											required
										/>
									</label>
								</div>
								<div class="space-y-6">
									<h2 class="text-lg font-semibold text-gray-900 lg:text-xl">
										{m.address_information()}
									</h2>
									<div class="grid gap-4 sm:grid-cols-2">
										<div class="space-y-2">
											<label class="block text-sm font-medium text-gray-700"
												>{m.full_name()}
												<input
													type="text"
													bind:value={addressFormData!.fullName}
													class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													required
												/>
											</label>
										</div>
										<div class="space-y-2">
											<label class="block text-sm font-medium text-gray-700"
												>{m.street_address()}
												<input
													type="text"
													bind:value={addressFormData!.streetLine1}
													class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													required
												/>
											</label>
										</div>
										<div class="space-y-2">
											<label class="block text-sm font-medium text-gray-700"
												>{m.street_address_2()}
												<input
													type="text"
													bind:value={addressFormData!.streetLine2}
													class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
												/>
											</label>
										</div>
										<div class="space-y-2">
											<label class="block text-sm font-medium text-gray-700"
												>{m.postal_code()}
												<input
													type="text"
													bind:value={addressFormData!.postalCode}
													class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													required
												/>
											</label>
										</div>
										<div class="space-y-2">
											<label class="block text-sm font-medium text-gray-700"
												>{m.city()}
												<input
													type="text"
													bind:value={addressFormData!.city}
													class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													required
												/>
											</label>
										</div>
										<div class="space-y-2">
											<label class="block text-sm font-medium text-gray-700"
												>{m.country()}
												<input
													type="text"
													bind:value={addressFormData!.countryCode}
													class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													required
												/>
											</label>
										</div>
										<div class="space-y-2">
											<label class="block text-sm font-medium text-gray-700"
												>{m.phone()}
												<input
													type="tel"
													bind:value={addressFormData!.phoneNumber}
													class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
												/>
											</label>
										</div>
										<div class="flex items-center gap-3 space-y-2">
											<label class="flex items-center gap-2 text-sm font-medium">
												<input
													type="checkbox"
													bind:checked={addressFormData!.defaultShippingAddress}
													class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
												{m.default_shipping_address()}
											</label>
											<label class="flex items-center gap-2 text-sm font-medium">
												<input
													type="checkbox"
													bind:checked={addressFormData!.defaultBillingAddress}
													class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
												{m.default_billing_address()}
											</label>
										</div>
									</div>
								</div>
							</div>
							<!-- Repeat for other fields -->
						</div>
					</div>

					<!-- Form Buttons -->
					<div class="flex flex-wrap gap-3">
						<button
							type="submit"
							class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
								<path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
								<path d="M14 4l0 4l-6 0l0 -4" />
							</svg>
							{m.save_changes()}
						</button>
						<button
							type="button"
							onclick={cancelEdit}
							class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/20"
						>
							{m.cancel()}
						</button>
					</div>
				</form>
			{:else if user}
				<div class="grid gap-8 md:grid-cols-2">
					<!-- Personal Info Card -->
					<div class="rounded-lg bg-gray-50 p-4 dark:bg-slate-300">
						<div class="space-y-4">
							<div class="flex items-center gap-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								<h2 class="text-lg font-semibold text-gray-900">{m.personal_information()}</h2>
							</div>
							<dl class="space-y-3">
								<div class="flex items-center gap-2">
									<dt class="w-24 shrink-0 text-sm font-medium text-gray-600">{m.name()}:</dt>
									<dd class="text-gray-900">{user.firstName} {user.lastName}</dd>
								</div>
								<div class="flex items-center gap-2">
									<dt class="w-24 shrink-0 text-sm font-medium text-gray-600">{m.phone()}:</dt>
									<dd class="text-gray-900">{user.phoneNumber}</dd>
								</div>
								<!-- Repeat for other fields -->
							</dl>
						</div>
					</div>

					<!-- Address Card -->
					{#if user.addresses?.length > 0}
						<div class="rounded-lg p-4 dark:bg-slate-300">
							<div class="space-y-4">
								<div class="flex items-center gap-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6 text-blue-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<h2 class="text-lg font-semibold text-gray-900">{m.default_address()}</h2>
								</div>
								{#each user.addresses.filter((addr) => addr.defaultShippingAddress) as address}
									<address class="space-y-2 not-italic text-gray-900">
										<p class="font-medium">{address.fullName}</p>
										<p>{address.streetLine1}</p>
										{#if address.streetLine2}<p>{address.streetLine2}</p>{/if}
										<p>{address.postalCode} {address.city}</p>
										<p class="text-sm text-gray-600">{address.country.name}</p>
									</address>
								{/each}
							</div>
						</div>
					{:else}
						<div class="rounded-lg bg-gray-50 p-4 dark:bg-slate-300">
							<div class="space-y-4">
								<div class="flex items-center gap-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6 text-blue-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<h2 class="text-lg font-semibold text-gray-900">{m.no_addresses()}</h2>
								</div>

								{#if isAddingAddress}
									<form
										onsubmit={async () => await createAddress(newAddressFormData)}
										class="space-y-4"
									>
										<div class="grid gap-4 sm:grid-cols-2">
											<div class="space-y-2">
												<label class="block text-sm font-medium text-gray-700"
													>{m.full_name()}
													<input
														type="text"
														bind:value={newAddressFormData.fullName}
														class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
														required
													/>
												</label>
											</div>
											<div class="space-y-2">
												<label class="block text-sm font-medium text-gray-700"
													>{m.street_address()}
													<input
														type="text"
														bind:value={newAddressFormData.streetLine1}
														class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
														required
													/>
												</label>
											</div>
											<div class="space-y-2">
												<label class="block text-sm font-medium text-gray-700"
													>{m.street_address_2()}
													<input
														type="text"
														bind:value={newAddressFormData.streetLine2}
														class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													/>
												</label>
											</div>
											<div class="space-y-2">
												<label class="block text-sm font-medium text-gray-700"
													>{m.postal_code()}
													<input
														type="text"
														bind:value={newAddressFormData.postalCode}
														class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
														required
													/>
												</label>
											</div>
											<div class="space-y-2">
												<label class="block text-sm font-medium text-gray-700"
													>{m.city()}
													<input
														type="text"
														bind:value={newAddressFormData.city}
														class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
														required
													/>
												</label>
											</div>
											<div class="space-y-2">
												<label class="block text-sm font-medium text-gray-700"
													>{m.phone()}
													<input
														type="tel"
														bind:value={newAddressFormData.phoneNumber}
														class="block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
													/>
												</label>
											</div>
										</div>

										<div class="flex flex-wrap gap-3">
											<button
												type="submit"
												class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20"
											>
												{m.save_address()}
											</button>
											<button
												type="button"
												onclick={() => (isAddingAddress = false)}
												class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/20"
											>
												{m.cancel()}
											</button>
										</div>
									</form>
								{:else}
									<button
										onclick={() => (isAddingAddress = true)}
										class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											fill="none"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
											<path d="M9 12l6 0" />
											<path d="M12 9l0 6" />
										</svg>
										{m.add_address()}
									</button>
								{/if}
							</div>
						</div>
					{/if}
					<!-- END Address Card -->
				</div>
			{/if}
		</div>

		<!-- Orders Section -->
		{#if user?.orders}
			<div class="rounded-xl bg-white p-6 shadow-lg ring-1 ring-black/5 dark:bg-slate-700 lg:p-8">
				<h2 class="mb-6 text-2xl font-bold text-gray-900">
					{m.order_history({ count: user.orders.totalItems })}
				</h2>

				<div class="space-y-4">
					{#each user.orders.items as order}
						<div
							class="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md dark:bg-slate-400"
						>
							<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
								<div class="space-y-1">
									<p class="font-medium text-gray-900">#{order.code}</p>
									<p class="text-sm text-gray-600">
										{formatDate(order.orderPlacedAt)}
									</p>
									<div class="flex items-center gap-2">
										<span
											class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
												order.state === 'PaymentAuthorized'
													? 'bg-green-100 text-green-800'
													: 'bg-yellow-100 text-yellow-800'
											}`}
										>
											{#if order.state === 'PaymentAuthorized'}
												<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clip-rule="evenodd"
													/>
												</svg>
											{:else}
												<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
														clip-rule="evenodd"
													/>
												</svg>
											{/if}
											{order.state}
										</span>
									</div>
								</div>
								<div class="text-right">
									<p class="text-lg font-semibold text-gray-900">
										{formatCurrency(order.totalWithTax, PUBLIC_DEFAULT_CURRENCY)}
									</p>
								</div>
							</div>

							<div class="mt-4 border-t border-gray-100 pt-4">
								{#each order.lines as line}
									<div class="flex items-center justify-between py-2 text-sm">
										<div class="flex items-center gap-3">
											<span class="text-gray-600">×{line.quantity}</span>
											<span class="text-gray-900">{line.productVariant.name}</span>
										</div>
										<span class="text-gray-600">
											{formatCurrency(line.productVariant.priceWithTax, PUBLIC_DEFAULT_CURRENCY)}
										</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
