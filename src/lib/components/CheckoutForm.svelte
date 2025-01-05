<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getContextClient } from '@urql/svelte'
	import { type CreateCustomerInput, type CreateAddressInput   } from '$lib/gql/graphql';
	import { SetOrderCustomer, SetOrderBillingAddress, SetOrderShippingAddress } from '$lib/vendure';
	
	// Store instances
	const client = getContextClient()
	
	// Debounce function
	function debounce<F extends (...args: any[]) => any>(fn: F, delay: number) {
	  let timeoutId: ReturnType<typeof setTimeout>;
	  return function (...args: Parameters<F>) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	  };
	}
	
	// Form data stores with session storage integration
	let customerForm: CreateCustomerInput = {
	  emailAddress: '',
	  firstName: '',
	  lastName: '',
	  phoneNumber: '',
	  title: '',
	  customFields: null
	};
	
	let addressForm: CreateAddressInput = {
	  city: '',
	  company: '',
	  countryCode: 'US',
	  customFields: null,
	  defaultBillingAddress: true,
	  defaultShippingAddress: true,
	  fullName: '',
	  phoneNumber: '',
	  postalCode: '',
	  province: '',
	  streetLine1: '',
	  streetLine2: ''
	};
	
	// Error states
	let errors = {
	  customer: '',
	  address: '',
	  payment: '',
	  shipping: '',
	  transition: ''
	};
	
	// Load data from session storage
	onMount(() => {
	  if (browser) {
		const savedCustomer = sessionStorage.getItem('customerForm');
		const savedAddress = sessionStorage.getItem('addressForm');
	
		if (savedCustomer) customerForm = JSON.parse(savedCustomer);
		if (savedAddress) addressForm = JSON.parse(savedAddress);
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
	const setCustomer = async (input: CreateCustomerInput) => {
		let result = await client.mutation(SetOrderCustomer, { input }).toPromise()
		console.log(result)
	}
	const setShippingAddress = async (input: CreateAddressInput) => {
		let result = await client.mutation(SetOrderShippingAddress, { input }).toPromise()
		console.log(result)
	}

	const setBillingAddress = async (input: CreateAddressInput) => {
		let result = await client.mutation(SetOrderBillingAddress, { input }).toPromise()
		console.log(result)
	}
	
	// Auto-update functions with debounce
	const debouncedCustomerUpdate = debounce(async (field: string, value: string) => {
	  if (!validateCustomerForm()) return;
	  
	  try {
		await setCustomer(customerForm)
		if (browser) {
		  sessionStorage.setItem('customerForm', JSON.stringify(customerForm));
		}
	  } catch (e : any) {
		errors.customer = e.message || 'Failed to update customer information';
	  }
	}, 500);
	
	const debouncedAddressUpdate = debounce(async (field: string, value: string) => {
	  if (!validateAddressForm()) return;
	  try {
		await Promise.all([
		  setShippingAddress(addressForm),
		  setBillingAddress(addressForm)
		]);
		errors.address = '';
		if (browser) {
		  sessionStorage.setItem('addressForm', JSON.stringify(addressForm));
		}
	  } catch (e : any) {
		errors.address = e.message || 'Failed to update address information';
	  }
	}, 500);
	
	// Validation functions
	function validateCustomerForm(): boolean {
	  if (customerForm.emailAddress && !validateEmail(customerForm.emailAddress)) {
		errors.customer = 'Invalid email address';
		return false;
	  }
	  if (customerForm.phoneNumber && !validatePhone(customerForm.phoneNumber)) {
		errors.customer = 'Invalid phone number';
		return false;
	  }
	  errors.customer = '';
	  return true;
	}
	
	function validateAddressForm(): boolean {
	  if (addressForm.postalCode && !validatePostalCode(addressForm.postalCode)) {
		errors.address = 'Invalid postal code';
		return false;
	  }
	  if (addressForm.phoneNumber && !validatePhone(addressForm.phoneNumber)) {
		errors.address = 'Invalid phone number';
		return false;
	  }
	  errors.address = '';
	  return true;
	}
	
	// Handle input changes
	function handleCustomerInput(field: string, value: string) {
	  //@ts-ignore
		customerForm[field] = value;
	  debouncedCustomerUpdate(field, value);
	}
	
	function handleAddressInput(field: string, value: string) {
			  //@ts-ignore
	  addressForm[field] = value;
	  debouncedAddressUpdate(field, value);
	}
	</script>

<div class="col-span-1 space-y-4">
    <!-- Customer Form -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-bold mb-4">Customer Information</h2>
      <div class="space-y-3">
        <div>
          <label for="name" class="block text-sm font-medium">First Name*</label>
          <input
            type="text"
            value={customerForm.firstName}
            on:input={(e) => handleCustomerInput('firstName', e.target.value)}
            required
            name="name"
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium">Last Name*</label>
          <input
            type="text"
            value={customerForm.lastName}
            on:input={(e) => handleCustomerInput('lastName', e.target.value)}
            required
            name="lastName"
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="emailaddr" class="block text-sm font-medium">Email*</label>
          <input
            type="email"
            value={customerForm.emailAddress}
            on:input={(e) => handleCustomerInput('emailAddress', e.target.value)}
            required
            name="emailaddr"
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium">Phone*</label>
          <input
            type="tel"
            value={customerForm.phoneNumber}
            on:input={(e) => handleCustomerInput('phoneNumber', e.target.value)}
            required
            name="phone"
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        {#if errors.customer}
          <p class="text-red-500 text-sm">{errors.customer}</p>
        {/if}
      </div>
    </div>

    <!-- Address Form -->
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-bold mb-4">Address Information</h2>
      <div class="space-y-3">
        <div>
          <label for="fullname" class="block text-sm font-medium">Full Name*</label>
          <input
            type="text"
            value={addressForm.fullName}
            on:input={(e) => handleAddressInput('fullName', e.target.value)}
            required
            name="fullname"
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="company" class="block text-sm font-medium">Company</label>
          <input
            type="text"
            value={addressForm.company}
            on:input={(e) => handleAddressInput('company', e.target.value)}
            name="company"
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="street1" class="block text-sm font-medium">Street Line 1*</label>
          <input
            name="street1"
            type="text"
            value={addressForm.streetLine1}
            on:input={(e) => handleAddressInput('streetLine1', e.target.value)}
            required
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="street2" class="block text-sm font-medium">Street Line 2</label>
          <input
            type="text"
            name="street2"
            value={addressForm.streetLine2}
            on:input={(e) => handleAddressInput('streetLine2', e.target.value)}
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="city" class="block text-sm font-medium">City*</label>
          <input
            name="city"
            type="text"
            value={addressForm.city}
            on:input={(e) => handleAddressInput('city', e.target.value)}
            required
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="postal" class="block text-sm font-medium">Postal Code*</label>
          <input
            name="postal"
            type="text"
            value={addressForm.postalCode}
            on:input={(e) => handleAddressInput('postalCode', e.target.value)}
            required
            class="mt-1 block w-full rounded border p-2"
          />
        </div>
		<div>
			<label for="country" class="block text-sm font-medium">Country*</label>
			<select
			  name="country"
			  value={addressForm.countryCode}
			  required
			  class="mt-1 block w-full rounded border p-2"
			  >
		<!-- 	  on:change={(e) => handleAddressInput('countryCode', e.target.value)} -->
			  <option value="">Select a country</option>
			  <option value="fi" selected>Finland</option>
			  <!-- Add more countries as needed -->
			</select>
		  </div>
        {#if errors.address}
          <p class="text-red-500 text-sm">{errors.address}</p>
        {/if}
      </div>
    </div>
  </div>
