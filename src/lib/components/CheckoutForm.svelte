<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getContextClient } from '@urql/svelte';
	import { type CreateCustomerInput, type CreateAddressInput, type UpdateCustomerInput, type UpdateAddressInput  } from '$lib/gql/graphql';
	import { SetOrderCustomer, SetOrderBillingAddress, SetOrderShippingAddress,updateCustomer, updateCustomerAddress,Customer } from '$lib/vendure';
	import * as m from '$lib/paraglide/messages.js';
	import { userStore } from '../stores';
	import { useFragment } from '$src/lib/gql';

	const client = getContextClient();
	const user = $derived(useFragment(Customer , $userStore));

	interface CheckoutForm {
		customerForm: CreateCustomerInput;
		addressForm: CreateAddressInput;
		disabledFields: {
			customer: Record<string, boolean>;
			address: Record<string, boolean>;
		};
		errors: { customer: string; address: string };
	}

	// Initialize form with empty values and disabled states
	let form: CheckoutForm = $state({
		customerForm: {
			emailAddress: '',
			firstName: '',
			lastName: '',
			phoneNumber: '',
			title: '',
			customFields: null
		} as CreateCustomerInput,

		addressForm: {
			city: '',
			company: '',
			countryCode: 'FI',
			customFields: null,
			defaultBillingAddress: true,
			defaultShippingAddress: true,
			fullName: '',
			phoneNumber: '',
			postalCode: '',
			province: '',
			streetLine1: '',
			streetLine2: ''
		} as CreateAddressInput,

		disabledFields: {
			customer: {
				emailAddress: false,
				firstName: false,
				lastName: false,
				phoneNumber: false
			},
			address: {
				city: false,
				company: false,
				countryCode: false,
				fullName: false,
				phoneNumber: false,
				postalCode: false,
				province: false,
				streetLine1: false,
				streetLine2: false
			}
		},

		errors: {
			customer: '',
			address: ''
		}
	});
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

	// Function to populate form with user data and set disabled states
	function populateFormWithUserData() {
		if (user) {
			// Populate customer form and set disabled states
			form.customerForm = {
				...form.customerForm,
				emailAddress: user.emailAddress || '',
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				phoneNumber: user.phoneNumber || ''
			};

			// Set disabled states for customer fields
			form.disabledFields.customer = {
				emailAddress: Boolean(user.emailAddress),
				firstName: Boolean(user.firstName),
				lastName: Boolean(user.lastName),
				phoneNumber: Boolean(user.phoneNumber)
			};

			// Find default shipping address
			const defaultAddress = user.addresses?.find(addr => addr.defaultShippingAddress);
			if (defaultAddress) {
				form.addressForm = {
					...form.addressForm,
					city: defaultAddress.city || '',
					company: defaultAddress.company || '',
					countryCode: defaultAddress.country.code || 'FI',
					fullName: defaultAddress.fullName || '',
					phoneNumber: defaultAddress.phoneNumber || '',
					postalCode: defaultAddress.postalCode || '',
					province: defaultAddress.province || '',
					streetLine1: defaultAddress.streetLine1 || '',
					streetLine2: defaultAddress.streetLine2 || '',
					defaultBillingAddress: defaultAddress.defaultBillingAddress,
					defaultShippingAddress: defaultAddress.defaultShippingAddress
				};

				// Set disabled states for address fields
				form.disabledFields.address = {
					city: Boolean(defaultAddress.city),
					company: Boolean(defaultAddress.company),
					countryCode: Boolean(defaultAddress.country.code),
					fullName: Boolean(defaultAddress.fullName),
					phoneNumber: Boolean(defaultAddress.phoneNumber),
					postalCode: Boolean(defaultAddress.postalCode),
					province: Boolean(defaultAddress.province),
					streetLine1: Boolean(defaultAddress.streetLine1),
					streetLine2: Boolean(defaultAddress.streetLine2)
				};
			}
		}
	}

	// Validation functions
	function validateEmail(email: string): boolean {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	}

	function validatePhone(phone: string): boolean {
		const regex = /^\+?[\d\s-]{10,}$/;
		return regex.test(phone);
	}

	function validatePostalCode(code: string): boolean {
		const regex = /^[A-Za-z0-9\s-]{5,}$/;
		return regex.test(code);
	}

	// API functions
	const setCustomer = async (input: CreateCustomerInput) => {
		let result = await client.mutation(SetOrderCustomer, { input }).toPromise();
		console.log('customer', result);
	};

	const setShippingAddress = async (input: CreateAddressInput) => {
		let result = await client.mutation(SetOrderShippingAddress, { input }).toPromise();
	};

	const setBillingAddress = async (input: CreateAddressInput) => {
		let result = await client.mutation(SetOrderBillingAddress, { input }).toPromise();
	};

	// Debounce function
	function debounce<F extends (...args: any[]) => any>(fn: F, delay: number) {
		let timeoutId: ReturnType<typeof setTimeout>;
		return function (...args: Parameters<F>) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), delay);
		};
	}

	// Form validation functions
	function validateCustomerForm(): boolean {
		if (form.customerForm.emailAddress && !validateEmail(form.customerForm.emailAddress)) {
			form.errors.customer = 'Invalid email address';
			return false;
		}
		if (form.customerForm.phoneNumber && !validatePhone(form.customerForm.phoneNumber)) {
			form.errors.customer = 'Invalid phone number';
			return false;
		}
		if (!form.customerForm.firstName && !form.customerForm.lastName) {
			form.errors.customer = 'name missing';
			return false;
		}
		form.addressForm.fullName = `${form.customerForm.firstName} ${form.customerForm.lastName}`;
		form.errors.customer = '';
		return true;
	}

	function validateAddressForm(): boolean {
		if (!form.addressForm.streetLine1) {
			form.errors.address = 'streetline missing';
			return false;
		}
		if (!form.addressForm.city) {
			form.errors.address = 'city missing';
			return false;
		}
		if (form.addressForm.postalCode && !validatePostalCode(form.addressForm.postalCode)) {
			form.errors.address = 'Invalid postal code';
			return false;
		}

		form.errors.address = '';
		return true;
	}

	const debouncedCustomerUpdate = debounce(async (field: string, value: string) => {
		if (!validateCustomerForm()) return;

		try {
			if (user) {
				// If user exists, update the existing user
				const updateInput: UpdateCustomerInput = {
					id: user.id,
					[field]: value
				};
				const success = await updateCustomerFunc(updateInput);
				if (!success) {
					form.errors.customer = 'Failed to update customer information';
				}
			} else {
				// If no user exists, create new customer in order
				await setCustomer(form.customerForm);
			}

			if (browser) {
				sessionStorage.setItem('customerForm', JSON.stringify(form.customerForm));
			}
		} catch (e: any) {
			form.errors.customer = e.message || 'Failed to update customer information';
		}
	}, 500);

	const debouncedAddressUpdate = debounce(async (field: string, value: string) => {
		if (!validateAddressForm()) return;
		try {
			if (user && user.addresses?.length > 0) {
				// If user exists and has addresses, update the default address
				const defaultAddress = user.addresses.find(addr => addr.defaultShippingAddress);
				if (defaultAddress) {
					const updateInput: UpdateAddressInput = {
						id: defaultAddress.id,
						[field]: value
					};
					const success = await updateAddressFunc(updateInput);
					if (!success) {
						form.errors.address = 'Failed to update address information';
					}
				}
			} else {
				// If no user or no addresses, set addresses in order
				await Promise.all([
					setShippingAddress(form.addressForm),
					setBillingAddress(form.addressForm)
				]);
			}

			if (browser) {
				sessionStorage.setItem('addressForm', JSON.stringify(form.addressForm));
			}
		} catch (e: any) {
			form.errors.address = e.message || 'Failed to update address information';
		}
	}, 500);

	// Input handlers
	function handleCustomerInput(field: keyof CreateCustomerInput, value: string) {
		form.customerForm[field] = value as never;
		debouncedCustomerUpdate(field, value);
	}

	function handleAddressInput(field: keyof CreateAddressInput, value: string) {
		form.addressForm[field] = value as never;
		debouncedAddressUpdate(field, value);
	}

	// Load saved data on mount
	onMount(() => {
		if (user) {
			// If user exists in store, populate form with user data
			populateFormWithUserData();
		} else if (browser) {
			// If no user in store, try to load from session storage
			const savedCustomer = sessionStorage.getItem('customerForm');
			const savedAddress = sessionStorage.getItem('addressForm');

			if (savedCustomer) form.customerForm = JSON.parse(savedCustomer);
			if (savedAddress) form.addressForm = JSON.parse(savedAddress);
		}
	});
</script>


<div class="col-span-1 space-y-4 text-black">
	<!-- Customer Form -->
	<h1 class="mb-4 text-xl font-bold">{m.checkout()}</h1>
	<div class="rounded bg-white p-4 shadow">
		<h2 class="mb-4 text-xl font-bold">{m.customer_information()}</h2>
		<div class="space-y-3">
			<div>
				<label for="name" class="block text-sm font-medium">{m.first_name()}*</label>
				<input
					type="text"
					value={form.customerForm.firstName}
					oninput={(e) => handleCustomerInput('firstName', e.currentTarget.value)}
					required
					name="name"
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.customer.firstName}
				/>
			</div>
			<div>
				<label for="lastName" class="block text-sm font-medium">{m.last_name()}*</label>
				<input
					type="text"
					value={form.customerForm.lastName}
					oninput={(e) => handleCustomerInput('lastName', e.currentTarget.value)}
					required
					name="lastName"
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.customer.lastName}
				/>
			</div>
			<div>
				<label for="emailaddr" class="block text-sm font-medium">{m.email()}*</label>
				<input
					type="email"
					value={form.customerForm.emailAddress}
					oninput={(e) => handleCustomerInput('emailAddress', e.currentTarget.value)}
					required
					name="emailaddr"
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.customer.emailAddress}
				/>
			</div>
			<div>
				<label for="phone" class="block text-sm font-medium">{m.phone()}*</label>
				<input
					type="tel"
					value={form.customerForm.phoneNumber}
					oninput={(e) => handleCustomerInput('phoneNumber', e.currentTarget.value)}
					required
					name="phone"
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.customer.phoneNumber}
				/>
			</div>
			{#if form.errors.customer}
				<p class="text-sm text-red-500">{form.errors.customer}</p>
			{/if}
		</div>
	</div>

	<!-- Address Form -->
	<div class="rounded bg-white p-4 shadow">
		<h2 class="mb-4 text-xl font-bold">{m.address_information()}</h2>
		<div class="space-y-3">
			<div>
				<label for="company" class="block text-sm font-medium">{m.company()}</label>
				<input
					type="text"
					value={form.addressForm.company}
					oninput={(e) => handleAddressInput('company', e.currentTarget.value)}
					name="company"
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.address.company}
				/>
			</div>
			<div>
				<label for="street1" class="block text-sm font-medium">{m.street_line_1()}*</label>
				<input
					name="street1"
					type="text"
					value={form.addressForm.streetLine1}
					oninput={(e) => handleAddressInput('streetLine1', e.currentTarget.value)}
					required
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.address.streetLine1}
				/>
			</div>
			<div>
				<label for="street2" class="block text-sm font-medium">{m.street_line_2()}</label>
				<input
					type="text"
					name="street2"
					value={form.addressForm.streetLine2}
					oninput={(e) => handleAddressInput('streetLine2', e.currentTarget.value)}
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.address.streetLine2}
				/>
			</div>
			<div>
				<label for="city" class="block text-sm font-medium">{m.city()}*</label>
				<input
					name="city"
					type="text"
					value={form.addressForm.city}
					oninput={(e) => handleAddressInput('city', e.currentTarget.value)}
					required
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.address.city}
				/>
			</div>
			<div>
				<label for="postal" class="block text-sm font-medium">{m.postal_code()}*</label>
				<input
					name="postal"
					type="text"
					value={form.addressForm.postalCode}
					oninput={(e) => handleAddressInput('postalCode', e.currentTarget.value)}
					required
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.address.postalCode}
				/>
			</div>
			<div>
				<label for="country" class="block text-sm font-medium">{m.country()}*</label>
				<select
					name="country"
					value={form.addressForm.countryCode}
					onchange={(e) => handleAddressInput('countryCode', e.currentTarget.value)}
					required
					class="mt-1 block w-full rounded border p-2"
					disabled={form.disabledFields.address.countryCode}
				>
					<option value="FI" selected>Finland</option>
					<!-- Add more countries as needed -->
				</select>
			</div>
			{#if form.errors.address}
				<p class="text-sm text-red-500">{form.errors.address}</p>
			{/if}
		</div>
	</div>
</div>