<script lang="ts">
	import { getContextClient } from '@urql/svelte';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/toast.svelte';
	import { ResetPassword } from '$lib/vendure';
	import * as m from '$lib/paraglide/messages.js';

	const { data } = $props();
	const token = $derived(data.code);
	const client = getContextClient();

	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);

	function validatePassword(pass: string): boolean {
		return pass.length >= 8 && /[0-9]/.test(pass) && /[a-zA-Z]/.test(pass);
	}

	async function resetPass() {
		if (password !== confirmPassword) {
			toast.error(m.errorMessages_passwordMismatch());
			return;
		}

		if (!validatePassword(password)) {
			toast.error(m.errorMessages_passwordTooShort());
			return;
		}

		isLoading = true;

		try {
			const result = await client
				.mutation(ResetPassword, {
					token,
					password
				})
				.toPromise();

			if (result.error) {
				throw new Error(result.error.message);
			}

			toast.success(m.successMessage());
			await goto('/account');
		} catch (error) {
			console.error('Password reset error:', error);
			toast.error(m.errorMessages_general());
		} finally {
			isLoading = false;
		}
	}
</script>

{#if token}
	<div class="password-reset-container">
		<h1>{m.title()}</h1>

		<div class="form-group">
			<input
				type="password"
				bind:value={password}
				placeholder={m.newPassword()}
				disabled={isLoading}
				class="password-input"
			/>
		</div>

		<div class="form-group">
			<input
				type="password"
				bind:value={confirmPassword}
				placeholder={m.confirmPassword()}
				disabled={isLoading}
				class="password-input"
			/>
		</div>

		<p class="requirements-text">
			{m.passwordRequirements()}
		</p>

		<button
			onclick={resetPass}
			disabled={isLoading || !password || !confirmPassword}
			class="reset-button"
		>
			{#if isLoading}
				Loading...
			{:else}
				{m.resetButton()}
			{/if}
		</button>
	</div>
{/if}

<style>
	.password-reset-container {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.password-input {
		width: 100%;
		padding: 8px;
		margin-bottom: 8px;
	}

	.requirements-text {
		font-size: 0.875rem;
		color: #666;
		margin-bottom: 1rem;
	}

	.reset-button {
		width: 100%;
		padding: 10px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.reset-button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
</style>
