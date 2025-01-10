<script lang="ts">
	import { userStore } from '$src/lib/stores';
	import { formatCurrency } from '$src/lib/utils';
	import { PUBLIC_DEFAULT_CURRENCY } from '$env/static/public';
	import { getContextClient } from '@urql/svelte';
	import { updateCustomer, updateCustomerAddress } from '$src/lib/vendure';
	import type { UpdateCustomerInput, UpdateAddressInput } from '$src/lib/gql/graphql';
	import { useFragment } from '$src/lib/gql';
	import { Customer } from '$src/lib/vendure';

	const user = $derived(useFragment(Customer , $userStore));
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

	const startEditing = () => {
		if (!user)return
		formData = {
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber || '',
			customFields: {}
		};

		const defaultAddress = user.addresses?.find((addr:any) => addr.defaultShippingAddress);
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
</script>

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="animate-pulse text-xl">Loading...</div>
	</div>
{:else}
	<div class="mx-auto max-w-4xl space-y-8 p-6">
		<!-- User Info Section -->
		<div class="rounded-lg bg-primary-700 p-6 shadow-md">
			<div class="mb-6 flex items-center justify-between">
				<h1 class="text-3xl font-bold">Customer Profile</h1>
				{#if !isEditing}
					<button
						onclick={startEditing}
						class="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
					>
						Edit Profile
					</button>
				{/if}
			</div>

			{#if isEditing}
				<form onsubmit={handleSubmit} class="space-y-6">
					<!-- Personal Information -->
					<div>
						<h2 class="mb-4 text-xl font-semibold">Personal Information</h2>
						<div class="grid gap-4 md:grid-cols-2">
							<label class="block">
								<span class="text-sm font-medium">First Name</span>
								<input
									type="text"
									bind:value={formData.firstName}
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
									required
								/>
							</label>
							<label class="block">
								<span class="text-sm font-medium">Last Name</span>
								<input
									type="text"
									bind:value={formData.lastName}
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
									required
								/>
							</label>
							<label class="block">
								<span class="text-sm font-medium">Phone Number</span>
								<input
									type="tel"
									bind:value={formData.phoneNumber}
									class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
								/>
							</label>
						</div>
					</div>

					<!-- Address Information -->
					{#if addressFormData}
						<div>
							<h2 class="mb-4 text-xl font-semibold">Default Address</h2>
							<div class="grid gap-4 md:grid-cols-2">
								<label class="block">
									<span class="text-sm font-medium">Full Name</span>
									<input
										type="text"
										bind:value={addressFormData.fullName}
										class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
										required
									/>
								</label>
								<label class="block">
									<span class="text-sm font-medium">Street Address</span>
									<input
										type="text"
										bind:value={addressFormData.streetLine1}
										class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
										required
									/>
								</label>
								<label class="block">
									<span class="text-sm font-medium">Apartment, suite, etc.</span>
									<input
										type="text"
										bind:value={addressFormData.streetLine2}
										class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
									/>
								</label>
								<label class="block">
									<span class="text-sm font-medium">City</span>
									<input
										type="text"
										bind:value={addressFormData.city}
										class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
										required
									/>
								</label>
								<label class="block">
									<span class="text-sm font-medium">Postal Code</span>
									<input
										type="text"
										bind:value={addressFormData.postalCode}
										class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
										required
									/>
								</label>
							</div>
						</div>
					{/if}

					<!-- Form Buttons -->
					<div class="flex space-x-4">
						<button
							type="submit"
							class="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
						>
							Save Changes
						</button>
						<button
							type="button"
							onclick={cancelEdit}
							class="rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
						>
							Cancel
						</button>
					</div>
				</form>
			{:else if user}
				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<h2 class="mb-4 text-xl font-semibold">Personal Information</h2>
						<div class="space-y-2">
							<p><span class="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
							<p><span class="font-medium">Email:</span> {user.emailAddress}</p>
							<p><span class="font-medium">Phone:</span> {user.phoneNumber || 'Not provided'}</p>
						</div>
					</div>

					{#if user.addresses?.length > 0}
						<div>
							<h2 class="mb-4 text-xl font-semibold">Default Address</h2>
							{#each user.addresses.filter((addr) => addr.defaultShippingAddress) as address}
								<div class="space-y-1">
									<p>{address.fullName}</p>
									<p>{address.streetLine1}</p>
									{#if address.streetLine2}<p>{address.streetLine2}</p>{/if}
									<p>{address.postalCode} {address.city}</p>
									<p>{address.country.name}</p>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Orders Section -->
		{#if user!.orders}
			<div class="rounded-lg bg-primary-700 p-6 shadow-md">
				<h2 class="mb-6 text-2xl font-bold">Order History ({user!.orders.totalItems} orders)</h2>

				<div class="space-y-6">
					{#each user!.orders.items as order}
						<div class="rounded-lg border bg-primary-400 p-4 transition-colors">
							<div class="mb-4 flex items-start justify-between">
								<div>
									<p class="font-medium">Order #{order.code}</p>
									<p class="text-sm">
										{formatDate(order.orderPlacedAt)}
									</p>
								</div>
								<div class="text-right">
									<p class="font-semibold">
										{formatCurrency(order.totalWithTax, PUBLIC_DEFAULT_CURRENCY)}
									</p>
									<span
										class="inline-block rounded-full px-2 py-1 text-sm
                        {order.state === 'PaymentAuthorized'
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'}"
									>
										{order.state}
									</span>
								</div>
							</div>

							<div class="space-y-2">
								{#each order.lines as line}
									<div class="text-sm">
										<p>
											{line.productVariant.name}
											{formatCurrency(line.productVariant.priceWithTax, PUBLIC_DEFAULT_CURRENCY)} amount:
											{line.quantity}
										</p>
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