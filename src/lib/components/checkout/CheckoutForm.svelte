<script lang="ts">
	//@ts-nocheck
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getContextClient } from '@urql/svelte';
	import {
		type CreateCustomerInput,
		type CreateAddressInput,
		type UpdateCustomerInput,
		type UpdateAddressInput
	} from '$lib/gql/graphql';
	import {
		SetOrderCustomer,
		SetOrderBillingAddress,
		SetOrderShippingAddress,
		updateCustomer,
		updateCustomerAddress,
		Customer
	} from '$lib/vendure';
	import * as m from '$lib/paraglide/messages.js';
	import { userStore } from '../../stores';
	import { useFragment } from '$src/lib/gql';
	import CountrySelect from './CountrySelect.svelte';

	const client = getContextClient();
	const user = $derived(useFragment(Customer, $userStore));

	let { valid = $bindable() } = $props();
	let customerValid = $state(false);
	let addressValid = $state(false);
	let countryCode = $state("FI")
	
	$effect(() => {
		customerValid = validateCustomerForm();
		addressValid = validateAddressForm();
		valid = customerValid && addressValid;
	});
	$effect(() => {
		handleAddressInput('countryCode', countryCode);
		$inspect(countryCode)
	});

	interface CheckoutForm {
		customerForm: CreateCustomerInput;
		addressForm: CreateAddressInput;
		disabledFields: {
			customer: Record<string, boolean>;
			address: Record<string, boolean>;
		};
		errors: {
			customer: Record<string, string>;
			address: Record<string, string>;
		};
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
			customer: {},
			address: {}
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
			const defaultAddress = user.addresses?.find((addr) => addr.defaultShippingAddress);
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
				countryCode = defaultAddress.country.code || "FI"
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
		let isValid = true;
		const errors: Record<string, string> = {};

		// Validate email
		if (!form.disabledFields.customer.emailAddress) {
			if (!form.customerForm.emailAddress) {
				errors.emailAddress = m.email_required();
				isValid = false;
			} else if (!validateEmail(form.customerForm.emailAddress)) {
				errors.emailAddress = m.invalid_email();
				isValid = false;
			}
		}

		// Validate first name
		if (!form.disabledFields.customer.firstName && !form.customerForm.firstName) {
			errors.firstName = m.first_name_required();
			isValid = false;
		}

		// Validate last name
		if (!form.disabledFields.customer.lastName && !form.customerForm.lastName) {
			errors.lastName = m.last_name_required();
			isValid = false;
		}

		// Validate phone number
		if (!form.disabledFields.customer.phoneNumber) {
			if (!form.customerForm.phoneNumber) {
				errors.phoneNumber = m.phone_required();
				isValid = false;
			} else if (!validatePhone(form.customerForm.phoneNumber)) {
				errors.phoneNumber = m.invalid_phone();
				isValid = false;
			}
		}

		// Update full name if valid
		if (form.customerForm.firstName && form.customerForm.lastName) {
			form.addressForm.fullName = `${form.customerForm.firstName} ${form.customerForm.lastName}`;
		}

		form.errors.customer = errors;
		return isValid;
	}

	function validateAddressForm(): boolean {
		let isValid = true;
		const errors: Record<string, string> = {};

		// Validate street line 1
		if (!form.disabledFields.address.streetLine1 && !form.addressForm.streetLine1) {
			errors.streetLine1 = m.street_line_1_required();
			isValid = false;
		}

		// Validate city
		if (!form.disabledFields.address.city && !form.addressForm.city) {
			errors.city = m.city_required();
			isValid = false;
		}

		// Validate postal code
		if (!form.disabledFields.address.postalCode) {
			if (!form.addressForm.postalCode) {
				errors.postalCode = m.postal_code_required();
				isValid = false;
			} else if (!validatePostalCode(form.addressForm.postalCode)) {
				errors.postalCode = m.invalid_postal_code();
				isValid = false;
			}
		}

		form.errors.address = errors;
		return isValid;
	}

	const debouncedCustomerUpdate = debounce(async (field: string, value: string) => {
		if (!customerValid) return;

		try {
			if (user) {
				// If user exists, update the existing user
				const updateInput: UpdateCustomerInput = {
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
		if (!addressValid) return;
		try {
			if (user && user.addresses?.length > 0) {
				// If user exists and has addresses, update the default address
				const defaultAddress = user.addresses.find((addr) => addr.defaultShippingAddress);
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
	onMount(async () => {
		if (user) {
			// If user exists in store, populate form with user data
			populateFormWithUserData();
			valid = true;
		} else if (browser) {
			// If no user in store, try to load from session storage
			const savedCustomer = sessionStorage.getItem('customerForm');
			const savedAddress = sessionStorage.getItem('addressForm');

			if (savedCustomer) {
				form.customerForm = JSON.parse(savedCustomer);
				await setCustomer(form.customerForm);
			}
			if (savedAddress) {
				const parsedAddress = JSON.parse(savedAddress);
				form.addressForm = parsedAddress;
				// Update countryCode from saved address
				countryCode = parsedAddress.countryCode || 'FI';
				await Promise.all([
					setShippingAddress(form.addressForm),
					setBillingAddress(form.addressForm)
				]);
			}
		}
	});
</script>

<div class="grid gap-4 text-black md:grid-cols-2">
	<!-- Customer Form -->
	<div class=" rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
		<div class="border-b border-gray-200 bg-gray-50 px-4 py-3">
			<h2 class="text-lg font-semibold text-gray-900">{m.customer_information()}</h2>
		</div>
		<div class="p-4">
			<div class="space-y-3">
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700"
							>{m.first_name()}*</label
						>
						<input
							type="text"
							value={form.customerForm.firstName}
							oninput={(e) => handleCustomerInput('firstName', e.currentTarget.value)}
							required
							name="name"
							class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm transition duration-150 focus:border-lime-500 focus:ring-lime-500 disabled:bg-gray-100 disabled:text-gray-500"
							disabled={form.disabledFields.customer.firstName}
						/>
						{#if form.errors.customer.firstName}
							<p class="mt-1 text-sm text-red-600">{form.errors.customer.firstName}</p>
						{/if}
					</div>
					<div>
						<label for="lastName" class="block text-sm font-medium text-gray-700"
							>{m.last_name()}*</label
						>
						<input
							type="text"
							value={form.customerForm.lastName}
							oninput={(e) => handleCustomerInput('lastName', e.currentTarget.value)}
							required
							name="lastName"
							class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm transition duration-150 focus:border-lime-500 focus:ring-lime-500 disabled:bg-gray-100 disabled:text-gray-500"
							disabled={form.disabledFields.customer.lastName}
						/>
						{#if form.errors.customer.lastName}
							<p class="mt-1 text-sm text-red-600">{form.errors.customer.lastName}</p>
						{/if}
					</div>
				</div>
				<div>
					<label for="emailaddr" class="block text-sm font-medium text-gray-700">{m.email()}*</label
					>
					<input
						type="email"
						value={form.customerForm.emailAddress}
						oninput={(e) => handleCustomerInput('emailAddress', e.currentTarget.value)}
						required
						name="emailaddr"
						class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm transition duration-150 focus:border-lime-500 focus:ring-lime-500 disabled:bg-gray-100 disabled:text-gray-500"
						disabled={form.disabledFields.customer.emailAddress}
					/>
					{#if form.errors.customer.emailAddress}
						<p class="mt-1 text-sm text-red-600">{form.errors.customer.emailAddress}</p>
					{/if}
				</div>
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700">{m.phone()}*</label>
					<input
						type="tel"
						value={form.customerForm.phoneNumber}
						oninput={(e) => handleCustomerInput('phoneNumber', e.currentTarget.value)}
						required
						name="phone"
						class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm transition duration-150 focus:border-lime-500 focus:ring-lime-500 disabled:bg-gray-100 disabled:text-gray-500"
						disabled={form.disabledFields.customer.phoneNumber}
					/>
					{#if form.errors.customer.phoneNumber}
						<p class="mt-1 text-sm text-red-600">{form.errors.customer.phoneNumber}</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Address Form -->
	<div class="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
		<div class="border-b border-gray-200 bg-gray-50 px-4 py-3">
			<h2 class="text-lg font-semibold text-gray-900">{m.address_information()}</h2>
		</div>
		<div class="p-4">
			<div class="space-y-3">
				<div>
					<label for="street1" class="block text-sm font-medium text-gray-700"
						>{m.street_line_1()}*</label
					>
					<input
						name="street1"
						type="text"
						value={form.addressForm.streetLine1}
						oninput={(e) => handleAddressInput('streetLine1', e.currentTarget.value)}
						required
						class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm transition duration-150 focus:border-lime-500 focus:ring-lime-500"
					/>
					{#if form.errors.address.streetLine1}
						<p class="mt-1 text-sm text-red-600">{form.errors.address.streetLine1}</p>
					{/if}
				</div>
				<div>
					<label for="street2" class="block text-sm font-medium text-gray-700"
						>{m.street_line_2()}</label
					>
					<input
						type="text"
						name="street2"
						value={form.addressForm.streetLine2}
						oninput={(e) => handleAddressInput('streetLine2', e.currentTarget.value)}
						class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm transition duration-150 focus:border-lime-500 focus:ring-lime-500"
					/>
				</div>
				<div class="grid gap-3 sm:grid-cols-2">
					<div>
						<label for="city" class="block text-sm font-medium text-gray-700">{m.city()}*</label>
						<input
							name="city"
							type="text"
							value={form.addressForm.city}
							oninput={(e) => handleAddressInput('city', e.currentTarget.value)}
							required
							class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm transition duration-150 focus:border-lime-500 focus:ring-lime-500"
						/>
						{#if form.errors.address.city}
							<p class="mt-1 text-sm text-red-600">{form.errors.address.city}</p>
						{/if}
					</div>
					<div>
						<label for="postal" class="block text-sm font-medium text-gray-700"
							>{m.postal_code()}*</label
						>
						<input
							name="postal"
							type="text"
							value={form.addressForm.postalCode}
							oninput={(e) => handleAddressInput('postalCode', e.currentTarget.value)}
							required
							class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm transition duration-150 focus:border-lime-500 focus:ring-lime-500"
						/>
						{#if form.errors.address.postalCode}
							<p class="mt-1 text-sm text-red-600">{form.errors.address.postalCode}</p>
						{/if}
					</div>
				</div>

				<CountrySelect bind:selectedCountryCode={countryCode}></CountrySelect>
			</div>
		</div>
	</div>
</div>