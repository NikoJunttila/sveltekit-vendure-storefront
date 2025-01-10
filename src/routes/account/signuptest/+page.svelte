<script lang="ts">
    import { getContextClient } from '@urql/svelte';
    import { SignUp } from '$lib/vendure';
    import { toast } from 'svelte-sonner';
    import { goto } from '$app/navigation';
    import * as m from '$lib/paraglide/messages.js';
    
    const client = getContextClient();
    
    let stuff = $state({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        error: '',
        loading: false
    });

    async function signUp(e: SubmitEvent) {
        e.preventDefault();
        stuff.loading = true;
        stuff.error = '';
        
        try {
            const result = await client.mutation(SignUp, {
                input: {
                    emailAddress: stuff.email,
                    password: stuff.password,
                    firstName: stuff.firstName,
                    lastName: stuff.lastName
                }
            }).toPromise();

            if (result.data?.registerCustomerAccount.__typename === 'Success') {
                toast.success(m.verification_email_sent());
                goto('/login?verified=true');
            } else {
                toast.error(m.generic_error());
                //@ts-ignore
                stuff.error = result.data?.registerCustomerAccount.message || m.generic_error();
            }
        } catch (e) {
            stuff.error = m.unexpected_error();
        } finally {
            stuff.loading = false;
        }
    }
</script>

<div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {m.create_account()}
        </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" onsubmit={signUp}>
                {#if stuff.error}
                    <div class="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                        <div class="flex">
                            <div class="text-sm text-red-700 dark:text-red-200">
                                {stuff.error}
                            </div>
                        </div>
                    </div>
                {/if}

                <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {m.first_name()}
                    </label>
                    <div class="mt-1">
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            placeholder={m.placeholder_first_name()}
                            bind:value={stuff.firstName}
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {m.last_name()}
                    </label>
                    <div class="mt-1">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            placeholder={m.placeholder_last_name()}
                            bind:value={stuff.lastName}
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {m.email()}
                    </label>
                    <div class="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            placeholder={m.placeholder_email()}
                            bind:value={stuff.email}
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {m.password()}
                    </label>
                    <div class="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="new-password"
                            required
                            placeholder={m.placeholder_password()}
                            bind:value={stuff.password}
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={stuff.loading}
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {stuff.loading ? m.creating_account() : m.sign_up()}
                    </button>
                </div>
            </form>

            <div class="mt-6">
                <div class="relative">
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 text-gray-500 dark:text-gray-400">
                            {m.already_account()}
                            <a href="/login" class="font-medium text-primary-600 hover:text-primary-500">
                                {m.sign_in()}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>