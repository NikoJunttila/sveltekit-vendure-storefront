<script lang="ts">
	// usage
	// <ShowHideIcon bind:reveal={reveal}>
	//    <input
	//       name="password"
	//       type="{reveal? 'text' : 'password' }"
	//       class="input"
	//       aria-invalid={$loginErrors.password ? 'true' : undefined}
	//       on:input={(e) => { $loginForm.password = e.target.value }}
	//    />
	
	interface Props {
		// </ShowHideIcon>
		reveal?: boolean;
		children?: import('svelte').Snippet;
	}

	let { reveal = $bindable(false), children }: Props = $props();
</script>
<div class="relative">
	{@render children?.()}
	<button type="button" onclick={() => reveal = !reveal} aria-label="Toggle Show or Hide Password" class="absolute top-1/2 right-0 mr-3 transform -translate-y-1/2 inline-block hover:scale-110 transition duration-100 text-gray-400">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
	</button>
</div>
