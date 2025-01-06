<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getContextClient } from '@urql/svelte'
	import { type CreateCustomerInput, type CreateAddressInput } from '$lib/gql/graphql';
	import { SetOrderCustomer, SetOrderBillingAddress, SetOrderShippingAddress } from '$lib/vendure';
	import * as m from '$lib/paraglide/messages.js';
	
	const client = getContextClient();

	interface CheckoutForm {
		customerForm : CreateCustomerInput;
		addressForm : CreateAddressInput;
		errors: {customer:string;address:string};
	}

	// Convert form data to state runes
	let form : CheckoutForm = $state({
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
			countryCode: '',
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
		
		errors: {
			customer: '',
			address: ''
		}
	});

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
		console.log("customer", result);
	}

	const setShippingAddress = async (input: CreateAddressInput) => {
		let result = await client.mutation(SetOrderShippingAddress, { input }).toPromise();
		//console.log(result);
	}

	const setBillingAddress = async (input: CreateAddressInput) => {
		let result = await client.mutation(SetOrderBillingAddress, { input }).toPromise();
		//console.log(result);
	}

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
		if (!form.customerForm.firstName && !form.customerForm.lastName){
			form.errors.customer = 'name missing';
			return false
		}
		form.addressForm.fullName = `${form.customerForm.firstName} ${form.customerForm.lastName}`
		form.errors.customer = '';
		console.log("FORM VALIDATED")
		return true;
	}

	function validateAddressForm(): boolean {
		if (!form.addressForm.streetLine1){
			form.errors.address = 'streetline missing';
			return false;
		}
		if (!form.addressForm.city){
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

	// Debounced update functions
	const debouncedCustomerUpdate = debounce(async (field: string, value: string) => {
		if (!validateCustomerForm()) return;

		try {
			await setCustomer(form.customerForm);
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
			await Promise.all([
				setShippingAddress(form.addressForm),
				setBillingAddress(form.addressForm)
			]);
			form.errors.address = '';
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
		if (browser) {
			const savedCustomer = sessionStorage.getItem('customerForm');
			const savedAddress = sessionStorage.getItem('addressForm');

			if (savedCustomer) form.customerForm = JSON.parse(savedCustomer);
			if (savedAddress) form.addressForm = JSON.parse(savedAddress);
		}
	});
</script>

<div class="col-span-1 space-y-4 text-black">
	<!-- Customer Form -->
	<h1 class="text-xl font-bold mb-4">{m.checkout()}</h1>
	<div class="bg-white p-4 rounded shadow">
	<h2 class="text-xl font-bold mb-4">{m.customer_information()}</h2>
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
				/>
			</div>
			{#if form.errors.customer}
				<p class="text-red-500 text-sm">{form.errors.customer}</p>
			{/if}
		</div>
	</div>

	<!-- Address Form -->
	<div class="bg-white p-4 rounded shadow">
		<h2 class="text-xl font-bold mb-4">{m.address_information()}</h2>
		<div class="space-y-3">
			<div>
				<label for="company" class="block text-sm font-medium">{m.company()}</label>
				<input
					type="text"
					value={form.addressForm.company}
					oninput={(e) => handleAddressInput('company', e.currentTarget.value)}
					name="company"
					class="mt-1 block w-full rounded border p-2"
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
				>
					<option value="FI" selected>Finland</option>
					<!-- Add more countries as needed -->
				</select>
			</div>
			{#if form.errors.address}
				<p class="text-red-500 text-sm">{form.errors.address}</p>
			{/if}
		</div>
	</div>
</div>